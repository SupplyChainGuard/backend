const express = require("express");
const router = express.Router();

const Web3 = require("web3");
const contractAbi = require("../../ethereum/contracts/abi/InventoryAbi.json");
const contractReciept = require("../../ethereum/contracts/receipt/InventoryReceipt.json");

const { ganacheUrl } = require("./Common.js");
const web3 = new Web3(ganacheUrl);
const contract = new web3.eth.Contract(contractAbi, contractReciept.address);

// PRODUCT ENDPOINTS
router.get("/:sku", async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  const address= accounts[0];
  const { sku } = req.params;

  contract.methods
    .getProduct(sku)
    .call({
      from: address
    })
    .then((result) => {
      const id = result[0];
      const name = result[1];
      const stock = result[2];
      const status = result[3];
      res.json({ id, name, stock, status });
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
    .getAllProducts()
    .call({
      from: address
    })
    .then((result) => {
      const products = result.map((product) => {
        const id = product[0];
        const name = product[1];
        const stock = product[2];
        const status = product[3];
        return { id, name, stock, status };
      });
      res.json(products);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

router.post("/", async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  const address= accounts[0];
  const { id, name, stock, category, status } = req.body;

  contract.methods
    .addProduct(id, name, stock, category, status)
    .send({ from: address, gas: "1000000" })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

router.put("/:sku", async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  const address= accounts[0];
  const { sku } = req.params;
  const { name, stock, category, status } = req.body;

  contract.methods
    .updateProduct(sku, name, stock, category, status)
    .send({ from: address, gas: "1000000" })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

router.delete("/:sku", async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  const address= accounts[0];
  const { sku } = req.params;

  contract.methods
    .deleteProduct(sku)
    .send({ from: address, gas: "1000000" })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});
// END PRODUCT ENDPOINTS

module.exports = router;