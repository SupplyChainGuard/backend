const express = require("express");
const Web3 = require("web3");
const contractAbi = require("../ethereum/contracts/abi/InventoryAbi.json"); // Replace with the path to your contract ABI file
const contractReciept = require("../ethereum/contracts/receipt/InventoryReceipt.json"); // Replace with the path to your contract receipt file

const app = express();
// const ganacheUrl = 'HTTP://127.0.0.1:7545'; // local ganache
const ganacheUrl = "http://ganache:8545"; // docker-compose.yml
const web3 = new Web3(ganacheUrl);
const contract = new web3.eth.Contract(contractAbi, contractReciept.address);

// Middleware to parse JSON bodies
app.use(express.json());

// USER ENDPOINTS
app.post("/users", async (req, res) => {
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

app.put("/users", async (req, res) => {
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

app.delete("/users", async (req, res) => {
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

app.get("/users", async (req, res) => {
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

// PRODUCT ENDPOINTS
app.get("/products/:sku", async (req, res) => {
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

app.get("/products", async (req, res) => {
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

app.post("/products", async (req, res) => {
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

app.put("/products/:sku", async (req, res) => {
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

app.delete("/products/:sku", async (req, res) => {
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

// PROVIDER ENDPOINTS
app.get("/providers/:id", async (req, res) => {
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

app.get("/providers", async (req, res) => {
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

app.post("/providers", async (req, res) => {
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

app.put("/providers/:id", async (req, res) => {
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

app.delete("/providers/:id", async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  const address= accounts[0];

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

// SHIPMENT ENDPOINTS
app.get("/shipments/:id", async (req, res) => {
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

app.get("/shipments", async (req, res) => {
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

app.post("/shipments", async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  const address= accounts[0];
  const { id, productSKU, quantity, date } = req.body;

  contract.methods
    .addShipment(id, productSKU, quantity, date)
    .send({ from: address, gas: "1000000" })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

app.put("/shipments/:id", async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  const address= accounts[0];
  const { id } = req.params;
  const { productSKU, quantity, date } = req.body;

  contract.methods
    .updateShipment(id, productSKU, quantity, date)
    .send({ from: address, gas: "1000000" })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

app.delete("/shipments/:id", async (req, res) => {
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

// ORDER ENDPOINTS
app.get("/orders/:id", async (req, res) => {
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

app.get("/orders", async (req, res) => {
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

app.post("/orders", async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  const address= accounts[0];
  const { id, providerId, productSKU, quantity, date } = req.body;

  contract.methods
    .addOrder(id, providerId, productSKU, quantity, date)
    .send({ from: address, gas: "1000000" })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

app.put("/orders/:id", async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  const address= accounts[0];
  const { id } = req.params;
  const { providerId, productSKU, quantity, date } = req.body;

  contract.methods
    .updateOrder(id, providerId, productSKU, quantity, date)
    .send({ from: address, gas: "1000000" })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

app.delete("/orders/:id", async (req, res) => {
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

// Start the Express server
const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
