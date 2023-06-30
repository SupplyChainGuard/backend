const express = require("express");
const router = express.Router();

const Web3 = require("web3");
const contractAbi = require("../../ethereum/contracts/abi/InventoryAbi.json");
const contractReciept = require("../../ethereum/contracts/receipt/InventoryReceipt.json");

const { ganacheUrl } = require("./Common.js");
const web3 = new Web3(ganacheUrl);
const contract = new web3.eth.Contract(contractAbi, contractReciept.address);

// PROVIDER ENDPOINTS
router.get("/:id", async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  const address= accounts[0];
  const { id } = req.params;

  contract.methods
    .getProvider(id)
    .call({
      from: address
    })
    .then((result) => {
      const id = result[0];
      const name = result[1];
      const category = result[2];
      const status = result[3];
      res.json({ id, name, category, status });
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
    .getAllProviders()
    .call({
      from: address
    })
    .then((result) => {
      const providers = result.map((provider) => {
        const id = provider[0];
        const name = provider[1];
        const category = provider[2];
        const status = provider[3];
        return { id, name, category, status };
      });
      res.json(providers);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

router.post("/", async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  const address= accounts[0];
  const { id, name, category, status } = req.body;

  contract.methods
    .addProvider(id, name, category, status)
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
  const { name, category, status } = req.body;

  contract.methods
    .updateProvider(id, name, category, status)
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
  const { id } = req.params;

  contract.methods
    .deleteProvider(id)
    .send({ from: address, gas: "1000000" })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});
// END PROVIDER ENDPOINTS

module.exports = router;
