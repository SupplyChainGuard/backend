const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');

// Connect to Ganache
// const ganacheUrl = 'HTTP://127.0.0.1:7545'; // local ganache
const ganacheUrl = "http://ganache:8545"; // docker-compose.yml
const web3 = new Web3(ganacheUrl);

const contractName = 'Inventory';
const contractFilePath = `./ethereum/contracts/inventory.sol`;
const abiDirectoryPath = './ethereum/contracts/abi';
const receiptDirectoryPath = './ethereum/contracts/receipt';
// const contractFilePath = `./contracts/inventory.sol`;
// const abiDirectoryPath = './contracts/abi';
// const receiptDirectoryPath = './contracts/receipt';

const compile = () => {
    const contractSourceCode = fs.readFileSync(contractFilePath, 'utf8');

    // Compile the Solidity contract
    const input = {
        language: 'Solidity',
        sources: {
            [contractFilePath]: {
                content: contractSourceCode,
            },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['abi', 'evm.bytecode'],
                },
            },
        },
    };

    const compiledContract = JSON.parse(solc.compile(JSON.stringify(input)));
    const contractBytecode = compiledContract.contracts[contractFilePath][contractName].evm.bytecode.object;
    const contractAbi = compiledContract.contracts[contractFilePath][contractName].abi;

    if (!fs.existsSync(abiDirectoryPath)) {
        fs.mkdirSync(abiDirectoryPath);
    }

    // Save the contract's ABI
    const abiFilePath = `${abiDirectoryPath}/${contractName}Abi.json`;
    fs.writeFileSync(abiFilePath, JSON.stringify(contractAbi));
    console.log('Contract ABI generated and saved to', abiFilePath);

    return {
        contractBytecode,
        contractAbi,
    };
}

// Deploy the contract
const deploy = async () => {
    const { contractBytecode, contractAbi } = compile();
    // console.log('contractBytecode', contractBytecode);

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    // console.log('account', account);

    const MyContract = new web3.eth.Contract(contractAbi);
    const deployTransaction = MyContract.deploy({ data: '0x' + contractBytecode });
    const options = {
        data: deployTransaction.encodeABI(),
        gas: await deployTransaction.estimateGas(),
        gasPrice: await web3.eth.getGasPrice(),
        from: account,
        nonce: await web3.eth.getTransactionCount(account),
    };
    const result = await deployTransaction.send(options);
    const contractAddress = result.options.address;

    console.log('Contract deployed at address:', contractAddress);

    // Save the contract receipt
    const receiptFilePath = `${receiptDirectoryPath}/${contractName}Receipt.json`;
    fs.writeFileSync(receiptFilePath, JSON.stringify(result.options));

    console.log('Contract receipt generated and saved to', receiptFilePath);
};

(async () => {
  try {
    await deploy();
  } catch (error) {
    console.error(error);
  }
})();