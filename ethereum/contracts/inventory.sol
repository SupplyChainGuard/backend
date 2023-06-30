// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.7.6;
pragma abicoder v2;

contract Inventory {
    enum ProductStatus {
        AVAILABLE,
        OUT_OF_STOCK
    }

    struct Product {
        uint256 sku;
        string name;
        uint256 stock;
        string category;
        ProductStatus status;
    }

    enum ProviderStatus {
        AVAILABLE,
        NOT_AVAILABLE
    }

    struct Provider {
        uint256 id;
        string name;
        string category;
        ProviderStatus status;
    }

    struct Shipment {
        uint256 id;
        uint256 productSKU;
        uint256 quantity;
        uint256 date;
    }

    struct Order {
        uint256 id;
        uint256 providerId;
        uint256 productSKU;
        uint256 quantity;
        uint256 date;
    }

    struct User {
        uint256 id;
        string firstName;
        string lastName;
        string email;
        mapping(uint256 => Product) products;
        uint256[] productIds;
        mapping(uint256 => Provider) providers;
        uint256[] providerIds;
        mapping(uint256 => Shipment) shipments;
        uint256[] shipmentIds;
        mapping(uint256 => Order) orders;
        uint256[] orderIds;
    }

    mapping(address => User) users;

    // START USER FUNCTIONS
    function addUser(
        uint256 id,
        string memory firstName,
        string memory lastName,
        string memory email
    ) public {
        User storage user = users[msg.sender];
        user.id = id;
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
    }

    function updateUser (
        string memory firstName,
        string memory lastName,
        string memory email
    ) public {
        User storage user = users[msg.sender];
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
    }

    function deleteUser() public {
        delete users[msg.sender];
    }

    function getUser() public view returns (uint256, string memory, string memory, string memory) {
        User storage user = users[msg.sender];
        return (user.id, user.firstName, user.lastName, user.email);
    }
    // END USER FUNCTIONS

    // START PRODUCT FUNCTIONS
    function getProduct(uint256 sku) public view returns (uint256, string memory, uint256, string memory, ProductStatus) {
        Product memory product = users[msg.sender].products[sku];
        return (product.sku, product.name, product.stock, product.category, product.status);
    }

    function getAllProducts() public view returns (Product[] memory) {
        Product[] memory products = new Product[](users[msg.sender].productIds.length);

        for (uint256 i = 0; i < users[msg.sender].productIds.length; i++) {
            products[i] = users[msg.sender].products[users[msg.sender].productIds[i]];
        }

        return products;
    }

    function addProduct(
        uint256 sku,
        string memory name,
        uint256 stock,
        string memory category,
        ProductStatus status
    ) public {
        Product memory newProduct = Product(sku, name, stock, category, status);
        users[msg.sender].products[sku] = newProduct;
        users[msg.sender].productIds.push(sku);
    }

    function updateProduct(
        uint256 sku,
        string memory name,
        uint256 stock,
        string memory category,
        ProductStatus status
    ) public {
        Product storage product = users[msg.sender].products[sku];
        product.name = name;
        product.stock = stock;
        product.category = category;
        product.status = status;
    }

    function deleteProduct(uint256 sku) public {
        for (uint256 i = 0; i < users[msg.sender].productIds.length; i++) {
            if (users[msg.sender].productIds[i] == sku) {
                users[msg.sender].productIds[i] = users[msg.sender].productIds[users[msg.sender].productIds.length - 1];
                users[msg.sender].productIds.pop();
                break;
            }
        }

        delete users[msg.sender].products[sku];
    }
    //END PRODUCT FUNCTIONS

    //START PROVIDER FUNCTIONS
    function getProvider(uint256 id) public view returns (uint256, string memory, string memory, ProviderStatus) {
        Provider memory provider = users[msg.sender].providers[id];
        return (provider.id, provider.name, provider.category, provider.status);
    }

    function getAllProviders() public view returns (Provider[] memory) {
        Provider[] memory providers = new Provider[](users[msg.sender].providerIds.length);

        for (uint256 i = 0; i < users[msg.sender].providerIds.length; i++) {
            providers[i] = users[msg.sender].providers[users[msg.sender].providerIds[i]];
        }

        return providers;
    }

    function addProvider(
        uint256 id,
        string memory name,
        string memory category,
        ProviderStatus status
    ) public {
        Provider memory newProvider = Provider(id, name, category, status);
        users[msg.sender].providers[id] = newProvider;
        users[msg.sender].providerIds.push(id);
    }

    function updateProvider(
        uint256 id,
        string memory name,
        string memory category,
        ProviderStatus status
    ) public {
        Provider storage provider = users[msg.sender].providers[id];
        provider.name = name;
        provider.category = category;
        provider.status = status;
    }

    function deleteProvider(uint256 id) public {
        for (uint256 i = 0; i < users[msg.sender].providerIds.length; i++) {
            if (users[msg.sender].providerIds[i] == id) {
                users[msg.sender].providerIds[i] = users[msg.sender].providerIds[users[msg.sender].providerIds.length - 1];
                users[msg.sender].providerIds.pop();
                break;
            }
        }

        delete users[msg.sender].providers[id];
    }
    //END PROVIDER FUNCTIONS

    //START SHIPMENT FUNCTIONS
    function getShipment(uint256 id) public view returns (uint256, uint256, uint256, uint256) {
        Shipment memory shipment = users[msg.sender].shipments[id];
        return (shipment.id, shipment.productSKU, shipment.quantity, shipment.date);
    }

    function getAllShipments() public view returns (Shipment[] memory) {
        Shipment[] memory shipments = new Shipment[](users[msg.sender].shipmentIds.length);

        for (uint256 i = 0; i < users[msg.sender].shipmentIds.length; i++) {
            shipments[i] = users[msg.sender].shipments[users[msg.sender].shipmentIds[i]];
        }

        return shipments;
    }

    function addShipment(uint256 id, uint256 productSKU, uint256 quantity, uint256 date) public {
        Shipment memory newShipment = Shipment(id, productSKU, quantity, date);
        users[msg.sender].shipments[id] = newShipment;
        users[msg.sender].shipmentIds.push(id);
        users[msg.sender].products[productSKU].stock -= quantity;
    }

    function updateShipment(uint256 id, uint256 productSKU, uint256 quantity, uint256 date) public {
        Shipment storage shipment = users[msg.sender].shipments[id];
        shipment.productSKU = productSKU;
        shipment.quantity = quantity;
        shipment.date = date;
    }

    function deleteShipment(uint256 id) public {
        for (uint256 i = 0; i < users[msg.sender].shipmentIds.length; i++) {
            if (users[msg.sender].shipmentIds[i] == id) {
                users[msg.sender].shipmentIds[i] = users[msg.sender].shipmentIds[users[msg.sender].shipmentIds.length - 1];
                users[msg.sender].shipmentIds.pop();
                break;
            }
        }

        delete users[msg.sender].shipments[id];
    }
    //END SHIPMENT FUNCTIONS

    //START ORDER FUNCTIONS
    function getOrder(uint256 id) public view returns (uint256, uint256, uint256, uint256, uint256) {
        Order memory order = users[msg.sender].orders[id];
        return (order.id, order.providerId, order.productSKU, order.quantity, order.date);
    }

    function getAllOrders() public view returns (Order[] memory) {
        Order[] memory orders = new Order[](users[msg.sender].orderIds.length);

        for (uint256 i = 0; i < users[msg.sender].orderIds.length; i++) {
            orders[i] = users[msg.sender].orders[users[msg.sender].orderIds[i]];
        }

        return orders;
    }

    function addOrder(
        uint256 id,
        uint256 providerId,
        uint256 productSKU,
        uint256 quantity,
        uint256 date
    ) public {
        Order memory newOrder = Order(id, providerId, productSKU, quantity, date);
        users[msg.sender].orders[id] = newOrder;
        users[msg.sender].orderIds.push(id);
        users[msg.sender].products[productSKU].stock += quantity;
    }

    function updateOrder(
        uint256 id,
        uint256 providerId,
        uint256 productSKU,
        uint256 quantity,
        uint256 date
    ) public {
        Order storage order = users[msg.sender].orders[id];
        order.providerId = providerId;
        order.productSKU = productSKU;
        order.quantity = quantity;
        order.date = date;
    }

    function deleteOrder(uint256 id) public {
        for (uint256 i = 0; i < users[msg.sender].orderIds.length; i++) {
            if (users[msg.sender].orderIds[i] == id) {
                users[msg.sender].orderIds[i] = users[msg.sender].orderIds[users[msg.sender].orderIds.length - 1];
                users[msg.sender].orderIds.pop();
                break;
            }
        }

        delete users[msg.sender].orders[id];
    }
    //END ORDER FUNCTIONS
}
