const express = require("express");
const app = express();

// Routes
const userRouter = require("./routes/UserRouter");
const productRouter = require("./routes/ProductRouter");
const providerRouter = require("./routes/ProviderRouter");
const orderRouter = require("./routes/OrderRouter");
const shipmentRouter = require("./routes/ShipmentRouter");

// Middleware to parse JSON bodies
app.use(express.json());

// LIVE
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//ENDPOINTS
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/providers", providerRouter);
app.use("/orders", orderRouter);
app.use("/shipments", shipmentRouter);

// Start the Express server
const port = 80;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
