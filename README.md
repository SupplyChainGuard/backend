# SupplyChainGuard - Backend

Supply chain management system with blockchain technology.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Prerequisites

List the prerequisites and dependencies required to run the project. Include instructions on how to install them.

- [Docker](https://docs.docker.com/get-docker/)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/SupplyChainGuard/backend.git

2. Run the following command to start the Docker containers:

   ```bash
   docker-compose up --build

## Usage
Import the postman collection to test the API endpoints.

## API Endpoints

### Create User

- Description: Create a new user.
- Method: POST
- URL: `http://localhost:4000/users`
- Request Body:
  - id: User ID (integer)
  - firstName: User's first name (string)
  - lastName: User's last name (string)
  - email: User's email address (string)

### Update User

- Description: Update an existing user.
- Method: PUT
- URL: `http://localhost:4000/users`
- Request Body:
  - firstName: Updated first name (string)
  - lastName: Updated last name (string)
  - email: Updated email address (string)

### Delete User

- Description: Delete a user.
- Method: DELETE
- URL: `http://localhost:4000/users`

### Get User

- Description: Get user details.
- Method: GET
- URL: `http://localhost:4000/users`

### Get Product

- Description: Get product details.
- Method: GET
- URL: `http://localhost:4000/products/123`

### Get All Products

- Description: Get all products.
- Method: GET
- URL: `http://localhost:4000/products`

### Create Product

- Description: Create a new product.
- Method: POST
- URL: `http://localhost:4000/products`
- Request Body:
  - id: Product ID (integer)
  - name: Product name (string)
  - stock: Product stock (number)
  - category: Product category (string)
  - status: Product status (string)

### Update Product

- Description: Update an existing product.
- Method: PUT
- URL: `http://localhost:4000/products/123`
- Request Body:
  - name: Updated product name (string)
  - stock: Updated product stock (number)
  - category: Updated product category (string)
  - status: Updated product status (string)

### Delete Product

- Description: Delete a product.
- Method: DELETE
- URL: `http://localhost:4000/products/123`

### Get Provider

- Description: Get provider details.
- Method: GET
- URL: `http://localhost:4000/providers/123`

### Get All Providers

- Description: Get all providers.
- Method: GET
- URL: `http://localhost:4000/providers`

### Create Provider

- Description: Create a new provider.
- Method: POST
- URL: `http://localhost:4000/providers`
- Request Body:
  - id: Provider ID (integer)
  - name: Provider name (string)
  - category: Provider category (string)
  - status: Provider status (string)

### Update Provider

- Description: Update an existing provider.
- Method: PUT
- URL: `http://localhost:4000/providers/123`
- Request Body:
  - name: Updated provider name (string)
  - category: Updated provider category (string)
  - status: Updated provider status (string)

### Delete Provider

- Description: Delete a provider.
- Method: DELETE
- URL: `http://localhost:4000/providers/123`

### Get Shipment

- Description: Get shipment details.
- Method: GET
- URL: `http://localhost:4000/shipments/123`

### Get All Shipments

- Description: Get all shipments.
- Method: GET
- URL: `http://localhost:4000/shipments`

### Create Shipment

- Description: Create a new shipment.
- Method: POST
- URL: `http://localhost:4000/shipments`
- Request Body:
  - id: Shipment ID (integer)
  - productSKU: Product SKU (string)
  - quantity: Shipment quantity (integer)
  - date: Shipment date (integer)

### Update Shipment

- Description: Update an existing shipment.
- Method: PUT
- URL: `http://localhost:4000/shipments/123`
- Request Body:
  - productSKU: Updated product SKU (string)
  - quantity: Updated shipment quantity (integer)
  - date: Updated shipment date (integer)

### Delete Shipment

- Description: Delete a shipment.
- Method: DELETE
- URL: `http://localhost:4000/shipments/123`

### Get Order

- Description: Get order details.
- Method: GET
- URL: `http://localhost:4000/orders/123`

### Get All Orders

- Description: Get all orders.
- Method: GET
- URL: `http://localhost:4000/orders`

### Create Order

- Description: Create a new order.
- Method: POST
- URL: `http://localhost:4000/orders`
- Request Body:
  - id: Order ID (integer)
  - providerId: Provider ID (integer)
  - productSKU: Product SKU (string)
  - quantity: Order quantity (integer)
  - date: Order date (integer)

### Update Order

- Description: Update an existing order.
- Method: PUT
- URL: `http://localhost:4000/orders/123`
- Request Body:
  - providerId: Updated provider ID (integer)
  - productSKU: Updated product SKU (string)
  - quantity: Updated order quantity (integer)
  - date: Updated order date (integer)

### Delete Order

- Description: Delete an order.
- Method: DELETE
- URL: `http://localhost:4000/orders/123`

## License

This project is licensed under the MIT License.
