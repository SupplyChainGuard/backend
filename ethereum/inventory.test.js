import { describe, expect, test, beforeAll } from "@jest/globals";
const { deploy } = require("./scripts");

const Web3 = require("web3");
const contractAbi = require("./contracts/abi/InventoryAbi.json");
const contractReciept = require("./contracts/receipt/InventoryReceipt.json");

const ganacheUrl = "HTTP://127.0.0.1:7545"; // local ganache
const web3 = new Web3(ganacheUrl);
const contract = new web3.eth.Contract(contractAbi, contractReciept.address);

beforeAll(async () => {
  await deploy();

  const accounts = await web3.eth.getAccounts();
  const address = accounts[0];

  const id = 1;
  const firstName = "Test name";
  const lastName = "Test lastname";
  const email = "test@gmail.com";

  await contract.methods
    .addUser(id, firstName, lastName, email)
    .send({ from: address, gas: "3000000" });
});

describe("Users", () => {
  test("should create an user", async () => {
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    const id = 1;
    const firstName = "Test name";
    const lastName = "Test lastname";
    const email = "test@gmail.com";

    await contract.methods
      .addUser(id, firstName, lastName, email)
      .send({ from: address, gas: "3000000" });

    const user = await contract.methods.getUser().call({ from: address });

    expect(+user[0]).toBe(id);
    expect(user[1]).toBe(firstName);
    expect(user[2]).toBe(lastName);
    expect(user[3]).toBe(email);
  });

  test("should update a user", async () => {
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    const firstName = "Updated Name";
    const lastName = "Updated Lastname";
    const email = "updated@gmail.com";

    await contract.methods
      .updateUser(firstName, lastName, email)
      .send({ from: accounts[0], gas: "3000000" });

    const user = await contract.methods.getUser().call({ from: address });

    expect(user[1]).toBe(firstName);
    expect(user[2]).toBe(lastName);
    expect(user[3]).toBe(email);
  });

  test("should delete a user", async () => {
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    await contract.methods.deleteUser().send({ from: address, gas: "3000000" });

    const user = await contract.methods.getUser().call({ from: address });

    expect(+user[0]).toBe(0);
    expect(user[1]).toBe("");
    expect(user[2]).toBe("");
    expect(user[3]).toBe("");
  });
});

describe("Products", () => {
  test("should add a product", async () => {
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    const sku = 1;
    const name = "Product 1";
    const stock = 10;
    const category = "Category 1";
    const status = 0;

    await contract.methods
      .addProduct(sku, name, stock, category, status)
      .send({ from: address, gas: "3000000" });

    const product = await contract.methods
      .getProduct(sku)
      .call({ from: address });

    expect(+product[0]).toBe(sku);
    expect(product[1]).toBe(name);
    expect(+product[2]).toBe(stock);
    expect(product[3]).toBe(category);
    expect(+product[4]).toBe(status);
  });

  test("should update a product", async () => {
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    const sku = 1;
    const name = "Updated Product";
    const stock = 20;
    const category = "Category 2";
    const status = 1;

    await contract.methods
      .updateProduct(sku, name, stock, category, status)
      .send({ from: address, gas: "3000000" });

    const product = await contract.methods
      .getProduct(sku)
      .call({ from: address });

    expect(product[1]).toBe(name);
    expect(+product[2]).toBe(stock);
    expect(product[3]).toBe(category);
    expect(+product[4]).toBe(status);
  });

  test("should delete a product", async () => {
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    const sku = 1;

    await contract.methods
      .deleteProduct(sku)
      .send({ from: address, gas: "3000000" });

    const product = await contract.methods
      .getProduct(sku)
      .call({ from: address });

    expect(+product[0]).toBe(0);
    expect(product[1]).toBe("");
    expect(+product[2]).toBe(0);
    expect(+product[3]).toBe(0);
  });
});

describe("Providers", () => {
  test("should add a provider", async () => {
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    const id = 1;
    const name = "Provider 1";
    const category = "Category 1";
    const status = 0;

    await contract.methods
      .addProvider(id, name, category, status)
      .send({ from: address, gas: "3000000" });

    const provider = await contract.methods
      .getProvider(id)
      .call({ from: address });

    expect(+provider[0]).toBe(id);
    expect(provider[1]).toBe(name);
    expect(provider[2]).toBe(category);
    expect(+provider[3]).toBe(status);
  });

  test("should update a provider", async () => {
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    const id = 1;
    const name = "Updated Provider";
    const category = "Category 2";
    const status = 1;

    await contract.methods
      .updateProvider(id, name, category, status)
      .send({ from: address, gas: "3000000" });

    const provider = await contract.methods
      .getProvider(id)
      .call({ from: address });

    expect(provider[1]).toBe(name);
    expect(provider[2]).toBe(category);
    expect(+provider[3]).toBe(status);
  });

  test("should delete a provider", async () => {
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    const id = 1;

    await contract.methods
      .deleteProvider(id)
      .send({ from: address, gas: "3000000" });

    const provider = await contract.methods
      .getProvider(id)
      .call({ from: address });

    expect(+provider[0]).toBe(0);
    expect(provider[1]).toBe("");
    expect(provider[2]).toBe("");
    expect(+provider[3]).toBe(0);
  });
});

describe("Shipments", () => {
  test("should add a shipment", async () => {
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    const id = 1;
    const productSKU = 1;
    const quantity = 5;
    const date = Date.now(); // Current timestamp

    await contract.methods
      .addShipment(id, productSKU, quantity, date)
      .send({ from: address, gas: "3000000" });

    const shipment = await contract.methods
      .getShipment(id)
      .call({ from: address });

    expect(+shipment[0]).toBe(id);
    expect(+shipment[1]).toBe(productSKU);
    expect(+shipment[2]).toBe(quantity);
    expect(+shipment[3]).toBe(date);
  });

  test("should update a shipment", async () => {
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    const id = 1;
    const productSKU = 1;
    const quantity = 10;
    const date = Date.now(); // Current timestamp

    await contract.methods
      .updateShipment(id, productSKU, quantity, date)
      .send({ from: address, gas: "3000000" });

    const shipment = await contract.methods
      .getShipment(id)
      .call({ from: address });

    expect(+shipment[2]).toBe(quantity);
    expect(+shipment[3]).toBe(date);
  });

  test("should delete a shipment", async () => {
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    const id = 1;

    await contract.methods
      .deleteShipment(id)
      .send({ from: address, gas: "3000000" });

    const shipment = await contract.methods
      .getShipment(id)
      .call({ from: address });

    expect(+shipment[0]).toBe(0);
    expect(+shipment[1]).toBe(0);
    expect(+shipment[2]).toBe(0);
    expect(+shipment[3]).toBe(0);
  });
});

describe("Orders", () => {
  test("should add an order", async () => {
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    const id = 1;
    const providerId = 1;
    const productSKU = 1;
    const quantity = 5;
    const date = Date.now(); // Current timestamp

    await contract.methods
      .addOrder(id, providerId, productSKU, quantity, date)
      .send({ from: address, gas: "3000000" });

    const order = await contract.methods.getOrder(id).call({ from: address });

    expect(+order[0]).toBe(id);
    expect(+order[1]).toBe(providerId);
    expect(+order[2]).toBe(productSKU);
    expect(+order[3]).toBe(quantity);
    expect(+order[4]).toBe(date);
  });

  test("should update an order", async () => {
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    const id = 1;
    const providerId = 2;
    const productSKU = 2;
    const quantity = 10;
    const date = Date.now(); // Current timestamp

    await contract.methods
      .updateOrder(id, providerId, productSKU, quantity, date)
      .send({ from: address, gas: "3000000" });

    const order = await contract.methods.getOrder(id).call({ from: address });

    expect(+order[1]).toBe(providerId);
    expect(+order[2]).toBe(productSKU);
    expect(+order[3]).toBe(quantity);
    expect(+order[4]).toBe(date);
  });

  test("should delete an order", async () => {
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    const id = 1;

    await contract.methods
      .deleteOrder(id)
      .send({ from: address, gas: "3000000" });

    const order = await contract.methods.getOrder(id).call({ from: address });

    expect(+order[0]).toBe(0);
    expect(+order[1]).toBe(0);
    expect(+order[2]).toBe(0);
    expect(+order[3]).toBe(0);
    expect(+order[4]).toBe(0);
  });
});
