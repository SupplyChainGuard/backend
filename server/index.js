const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();

// Routes
const userRouter = require("./routes/UserRouter");
const productRouter = require("./routes/ProductRouter");
const providerRouter = require("./routes/ProviderRouter");
const orderRouter = require("./routes/OrderRouter");
const shipmentRouter = require("./routes/ShipmentRouter");

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
