const express = require("express");
const router = express.Router();

const Web3 = require("web3");
const contractAbi = require("../../ethereum/contracts/abi/InventoryAbi.json");
const contractReciept = require("../../ethereum/contracts/receipt/InventoryReceipt.json");

const { ganacheUrl } = require("./Common.js");
const web3 = new Web3(ganacheUrl);
const contract = new web3.eth.Contract(contractAbi, contractReciept.address);

// SHIPMENT ENDPOINTS
router.get("/:id", async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  const address= accounts[0];
  const { id } = req.params;

  contract.methods
    .getShipment(id)
    .call({
      from: address
    })
    .then((result) => {
      const id = result[0];
      const productSKU = result[1];
      const quantity = result[2];
      const date = result[3];

      res.json({ id, productSKU, quantity, date });
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
    .getAllShipments()
    .call({
      from: address
    })
    .then((result) => {
      const shipments = result.map((shipment) => {
        const id = shipment[0];
        const productSKU = shipment[1];
        const quantity = shipment[2];
        const date = shipment[3];

        return { id, productSKU, quantity, date };
      });
      res.json(shipments);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

router.post("/", async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  const address= accounts[0];
  const { id, productSKU, quantity, date } = req.body;
  const dateInMiliseconds = new Date(date).getTime();

  contract.methods
    .addShipment(id, productSKU, quantity, dateInMiliseconds)
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
  const { productSKU, quantity, date } = req.body;
  const dateInMiliseconds = new Date(date).getTime();

  contract.methods
    .updateShipment(id, productSKU, quantity, dateInMiliseconds)
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
    .deleteShipment(id)
    .send({ from: address, gas: "1000000" })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});
// END SHIPMENT ENDPOINTS

module.exports = router;