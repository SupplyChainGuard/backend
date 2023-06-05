const express = require("express");
const Web3 = require("web3");
const contractAbi = require("./contracts/abi/InventoryAbi.json"); // Replace with the path to your contract ABI file

const app = express();
const web3 = new Web3("http://127.0.0.1:7545");
const contractAddress = "0x82DdB721a3D2e2d41F1261baB7eeeB0CDa3BB4D1";
const contract = new web3.eth.Contract(contractAbi, contractAddress);
const accountPrivateKey =
  "0xea019fa103965d118d05c7686d151341e66f2e33b491c9900fd1b4425bdc603d"; // Replace with your actual private key

// Middleware to parse JSON bodies
app.use(express.json());

// Add product endpoint
app.post("/products", async (req, res) => {
  const { id, name, quantity } = req.body;
  const account = await web3.eth.accounts.privateKeyToAccount(
    accountPrivateKey
  );
  const address = account.address;

  contract.methods
    .addProduct(id, name, quantity)
    .send({ from: address, gas: "1000000" })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

// Update product endpoint
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, quantity } = req.body;
  const account = await web3.eth.accounts.privateKeyToAccount(
    accountPrivateKey
  );
  const address = account.address;

  contract.methods
    .updateProduct(id, name, quantity)
    .send({ from: address, gas: "1000000" })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

// Delete product endpoint
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const account = await web3.eth.accounts.privateKeyToAccount(
    accountPrivateKey
  );
  const address = account.address;

  contract.methods
    .deleteProduct(id)
    .send({ from: address, gas: "1000000" })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

// Get product endpoint
app.get("/products/:id", (req, res) => {
  const { id } = req.params;

  contract.methods
    .getProduct(id)
    .call()
    .then((result) => {
      const productId = result[0];
      const productName = result[1];
      const productQuantity = result[2];
      res.json({ id: productId, name: productName, quantity: productQuantity });
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

// Get total products endpoint
app.get("/products", (req, res) => {
  contract.methods
    .getTotalProducts()
    .call()
    .then((result) => {
      res.json({ totalProducts: result });
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

// Start the Express server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
