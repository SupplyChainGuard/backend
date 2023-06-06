// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

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

    function isEmptyString(string memory str) internal pure returns (bool) {
        bytes memory strBytes = bytes(str);
        return (strBytes.length == 0);
    }

    function isProductStatusValid(uint256 status) internal pure returns (bool) {
        return (status == uint256(ProductStatus.AVAILABLE) || status == uint256(ProductStatus.OUT_OF_STOCK));
    }

    function isProviderStatusValid(uint256 status) internal pure returns (bool) {
        return (status == uint256(ProviderStatus.AVAILABLE) || status == uint256(ProviderStatus.NOT_AVAILABLE));
    }

    function existOrder(uint256 id) internal view returns (bool) {
        return (users[msg.sender].orders[id].id == id);
    }

    function existShipment(uint256 id) internal view returns (bool) {
        return (users[msg.sender].shipments[id].id == id);
    }

    function existProduct(uint256 sku) internal view returns (bool) {
        return (users[msg.sender].products[sku].sku == sku);
    }

    function existProvider(uint256 id) internal view returns (bool) {
        return (users[msg.sender].providers[id].id == id);
    }

    function existUser() internal view returns (bool) {
        return (!isEmptyString(users[msg.sender].firstName));
    }

    // START USER FUNCTIONS
    function addUser(
        uint256 id,
        string memory firstName,
        string memory lastName,
        string memory email
    ) public {
        require(id > 0, "Invalid user ID");
        require(!isEmptyString(firstName), "First name cannot be empty");
        require(!isEmptyString(lastName), "Last name cannot be empty");
        require(!isEmptyString(email), "Email cannot be empty");

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
        require(existUser(), "User for this address already exists");
        require(!isEmptyString(firstName), "First name cannot be empty");
        require(!isEmptyString(lastName), "Last name cannot be empty");
        require(!isEmptyString(email), "Email cannot be empty");

        User storage user = users[msg.sender];
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
    }

    function deleteUser() public {
        require(existUser(), "User for this address already exists");

        delete users[msg.sender];
    }

    function getUser() public view returns (uint256, string memory, string memory, string memory) {
        require(existUser(), "User for this address already exists");

        User storage user = users[msg.sender];
        return (user.id, user.firstName, user.lastName, user.email);
    }
    // END USER FUNCTIONS

    // START PRODUCT FUNCTIONS
    function getProduct(uint256 sku) public view returns (uint256, string memory, uint256, ProductStatus) {
        require(existProduct(sku), "Product with the specified SKU does not exist");

        Product memory product = users[msg.sender].products[sku];
        return (product.sku, product.name, product.stock, product.status);
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
        require(sku > 0, "Invalid product SKU");
        require(!isEmptyString(name), "Product name cannot be empty");
        require(stock > 0, "Product stock must be greater than zero");
        require(!isEmptyString(category), "Product category cannot be empty");
        require(isProductStatusValid(uint256(status)), "Invalid product status");

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
        require(existProduct(sku), "Product with the specified SKU does not exist");
        require(!isEmptyString(name), "Product name cannot be empty");
        require(stock > 0, "Product stock must be greater than zero");
        require(!isEmptyString(category), "Product category cannot be empty");
        require(isProductStatusValid(uint256(status)), "Invalid product status");

        Product storage product = users[msg.sender].products[sku];
        product.name = name;
        product.stock = stock;
        product.category = category;
        product.status = status;
    }

    function deleteProduct(uint256 sku) public {
        require(sku > 0, "Invalid product SKU");
        require(existProduct(sku), "Product with the specified SKU does not exist");

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
        require(existProvider(id), "Provider with the specified ID does not exist");

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
        require(id > 0, "Invalid provider ID");
        require(!isEmptyString(name), "Provider name cannot be empty");
        require(!isEmptyString(category), "Provider category cannot be empty");
        require(isProviderStatusValid(uint256(status)), "Invalid provider status");

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
        require(existProvider(id), "Provider with the specified ID does not exist");
        require(!isEmptyString(name), "Provider name cannot be empty");
        require(!isEmptyString(category), "Provider category cannot be empty");
        require(isProviderStatusValid(uint256(status)), "Invalid provider status");

        Provider storage provider = users[msg.sender].providers[id];
        provider.name = name;
        provider.category = category;
        provider.status = status;
    }

    function deleteProvider(uint256 id) public {
        require(existProvider(id), "Provider with the specified ID does not exist");

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
        require(id > 0, "Invalid shipment ID");
        require(existShipment(id), "Shipment with the specified ID does not exist");

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
        require(id > 0, "Invalid shipment ID");
        require(existProduct(productSKU), "Product with the specified SKU does not exist");
        require(quantity > 0, "Shipment quantity must be greater than zero");
        require(date > 0, "Invalid shipment date");

        Shipment memory newShipment = Shipment(id, productSKU, quantity, date);
        users[msg.sender].shipments[id] = newShipment;
        users[msg.sender].shipmentIds.push(id);
        users[msg.sender].products[productSKU].stock -= quantity;
    }

    function updateShipment(uint256 id, uint256 productSKU, uint256 quantity, uint256 date) public {
        require(id > 0, "Invalid shipment ID");
        require(existShipment(id), "Shipment with the specified ID does not exist");
        require(!existProduct(productSKU), "Product with the specified SKU does not exist");
        require(quantity > 0, "Shipment quantity must be greater than zero");
        require(date > 0, "Invalid shipment date");

        Shipment storage shipment = users[msg.sender].shipments[id];
        shipment.productSKU = productSKU;
        shipment.quantity = quantity;
        shipment.date = date;
    }

    function deleteShipment(uint256 id) public {
        require(id > 0, "Invalid shipment ID");
        require(existShipment(id), "Shipment with the specified ID does not exist");

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
        require(id > 0, "Invalid order ID");
        require(existOrder(id), "Order with the specified ID does not exist");

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
        require(!existOrder(id), "Order with the specified ID already exists");
        require(existProvider(providerId), "Provider with the specified ID does not exist");
        require(existProduct(productSKU), "Product with the specified SKU does not exist");
        require(quantity > 0, "Order quantity must be greater than zero");
        require(date > 0, "Invalid order date");

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
        require(id > 0, "Invalid order ID");
        require(existOrder(id), "Order with the specified ID already exists");
        require(existProvider(providerId), "Provider with the specified ID does not exist");
        require(existProduct(productSKU), "Product with the specified SKU does not exist");
        require(date > 0, "Invalid order date");

        Order storage order = users[msg.sender].orders[id];
        order.providerId = providerId;
        order.productSKU = productSKU;
        order.quantity = quantity;
        order.date = date;
    }

    function deleteOrder(uint256 id) public {
        require(id > 0, "Invalid order ID");
        require(existOrder(id), "Order with the specified ID does not exist");

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
