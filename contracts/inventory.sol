pragma solidity ^0.8.0;

contract Inventory {
    struct Product {
        uint256 id;
        string name;
        uint256 quantity;
    }

    mapping(uint256 => Product) private products;
    uint256 private totalProducts;

    event ProductAdded(uint256 id, string name, uint256 quantity);
    event ProductUpdated(uint256 id, string name, uint256 quantity);
    event ProductDeleted(uint256 id);

    function addProduct(uint256 id, string memory name, uint256 quantity) public {
        require(id > 0, "Invalid product ID");
        require(bytes(name).length > 0, "Product name cannot be empty");
        require(quantity > 0, "Product quantity must be greater than zero");
        require(products[id].id == 0, "Product with the same ID already exists");

        Product memory newProduct = Product(id, name, quantity);
        products[id] = newProduct;
        totalProducts++;

        emit ProductAdded(id, name, quantity);
    }

    function updateProduct(uint256 id, string memory name, uint256 quantity) public {
        require(id > 0, "Invalid product ID");
        require(bytes(name).length > 0, "Product name cannot be empty");
        require(quantity > 0, "Product quantity must be greater than zero");
        require(products[id].id != 0, "Product with the specified ID does not exist");

        Product storage product = products[id];
        product.name = name;
        product.quantity = quantity;

        emit ProductUpdated(id, name, quantity);
    }

    function deleteProduct(uint256 id) public {
        require(id > 0, "Invalid product ID");
        require(products[id].id != 0, "Product with the specified ID does not exist");

        delete products[id];
        totalProducts--;

        emit ProductDeleted(id);
    }

    function getProduct(uint256 id) public view returns (uint256, string memory, uint256) {
        require(id > 0, "Invalid product ID");
        require(products[id].id != 0, "Product with the specified ID does not exist");

        Product memory product = products[id];
        return (product.id, product.name, product.quantity);
    }

    function getTotalProducts() public view returns (uint256) {
        return totalProducts;
    }
}
