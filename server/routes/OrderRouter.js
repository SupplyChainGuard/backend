const express = require("express");
const router = express.Router();

const Web3 = require("web3");
const contractAbi = require("../../ethereum/contracts/abi/InventoryAbi.json");
const contractReciept = require("../../ethereum/contracts/receipt/InventoryReceipt.json");

const { ganacheUrl } = require("./Common.js");
const web3 = new Web3(ganacheUrl);
const contract = new web3.eth.Contract(contractAbi, contractReciept.address);

// ORDER ENDPOINTS
router.get("/:id", async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  const address= accounts[0];
  const { id } = req.params;

  contract.methods
    .getOrder(id)
    .call({
      from: address
    })
    .then((result) => {
      const id = result[0];
      const providerId = result[1];
      const productSKU = result[2];
      const quantity = result[3];
      const date = result[4];

      res.json({ id, providerId, productSKU, quantity, date });
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

router.get("/", async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  const address= accounts[0];

  contract.methods
    .getAllOrders()
    .call({
      from: address
    })
    .then((result) => {
      const orders = result.map((order) => {
        const id = order[0];
        const providerId = order[1];
        const productSKU = order[2];
        const quantity = order[3];
        const date = order[4];

        return { id, providerId, productSKU, quantity, date };
      });
      res.json(orders);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

router.post("/", async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  const address= accounts[0];
  const { id, providerId, productSKU, quantity, date } = req.body;
  const dateInMiliseconds = new Date(date).getTime();

  contract.methods
    .addOrder(id, providerId, productSKU, quantity, dateInMiliseconds)
    .send({ from: address, gas: "1000000" })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

router.put("/:id", async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  const address= accounts[0];
  const { id } = req.params;
  const { providerId, productSKU, quantity, date } = req.body;
  const dateInMiliseconds = new Date(date).getTime();

  contract.methods
    .updateOrder(id, providerId, productSKU, quantity, dateInMiliseconds)
    .send({ from: address, gas: "1000000" })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

router.delete("/:id", async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  const address= accounts[0];

  contract.methods
    .deleteOrder(id)
    .send({ from: address, gas: "1000000" })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});
// END ORDER ENDPOINTS

module.exports = router;