const express = require("express");
const router = express.Router();

const Web3 = require("web3");
const contractAbi = require("../../ethereum/contracts/abi/InventoryAbi.json");
const contractReciept = require("../../ethereum/contracts/receipt/InventoryReceipt.json");

const { ganacheUrl } = require("./Common.js");
const web3 = new Web3(ganacheUrl);
const contract = new web3.eth.Contract(contractAbi, contractReciept.address);

// USER ENDPOINTS
router.post("/", async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  const address = accounts[0];
  const { id, firstName, lastName, email } = req.body;

  contract.methods
    .addUser(id, firstName, lastName, email)
    .send({ from: address, gas: "3000000" })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

router.put("/", async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  const address= accounts[0];
  const { firstName, lastName, email } = req.body;

  contract.methods
    .updateUser(firstName, lastName, email)
    .send({ from: address, gas: "3000000" })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

router.delete("/", async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  const address= accounts[0];

  contract.methods
    .deleteUser()
    .send({ from: address, gas: "3000000" })
    .then(() => {
      res.sendStatus(200);
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
    .getUser()
    .call({
      from: address
    })
    .then((result) => {
      const id = result[0];
      const firstName = result[1];
      const lastName = result[2];
      const email = result[3];
      res.json({ id, firstName, lastName, email });
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});
// END USER ENDPOINTS

module.exports = router;