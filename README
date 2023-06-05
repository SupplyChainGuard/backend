# SupplyChainGuard

Supply chain management system with blockchain technology.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Prerequisites

List the prerequisites and dependencies required to run the project. Include instructions on how to install them.

- Node.js
- npm or yarn

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/SupplyChainGuard/backend.git

2. Install dependencies:

   ```bash
   npm install

3. Install software:
    * [Ganache](https://www.trufflesuite.com/ganache)
    * [Metamask](https://metamask.io/)

4. Set up your local development environment, including Ganache or a compatible Ethereum network.
5. Update the necessary configurations, such as the Ganache URL and account private key, in the code files.
6. Compile your Solidity smart contracts and generate the contract ABI files. Make sure to place the ABI files in the appropriate location.

    ```bash
    node .\scripts\deploy.js

## Usage
To start the Express server, run the following command:

    node index.js

## API Endpoints
* POST /products
    * Description: Add a new product.
    * Request Body:
        * id: Product ID (uint256)
        * name: Product name (string)
        * quantity: Product quantity (uint256)

* PUT /products/:id
    * Description: Update an existing product.
    * Request Parameters:
        * id: Product ID
    * Request Body:
        * name: Updated product name (string)
        * quantity: Updated product quantity (uint256)

* DELETE /products/:id
    * Description: Delete a product.
    * Request Parameters:
        * id: Product ID

* GET /products/:id
    * Description: Get product details.
    * Request Parameters:
        * id: Product ID

* GET /products
    * Description: Get the total number of products.

## License

This project is licensed under the MIT License.