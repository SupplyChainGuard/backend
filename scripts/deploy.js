const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');

// Connect to Ganache
const ganacheUrl = 'HTTP://127.0.0.1:7545';
const web3 = new Web3(ganacheUrl);

// Read the Solidity contract file
const contractFilePath = '../contracts/inventory.sol';
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
const contractName = 'Inventory';
const contractBytecode = compiledContract.contracts[contractFilePath][contractName].evm.bytecode.object;
const contractAbi = compiledContract.contracts[contractFilePath][contractName].abi;


const abiDirectoryPath = '../contracts/abi';
if (!fs.existsSync(abiDirectoryPath)) {
    fs.mkdirSync(abiDirectoryPath);
}

// Save the contract's ABI
const abiFilePath = `${abiDirectoryPath}/${contractName}Abi.json`;
fs.writeFileSync(abiFilePath, JSON.stringify(contractAbi));
console.log('Contract ABI generated and saved to', abiFilePath);

// Deploy the contract
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const privateKey = '0xea019fa103965d118d05c7686d151341e66f2e33b491c9900fd1b4425bdc603d'; // Replace with your actual private key

    const MyContract = new web3.eth.Contract(contractAbi);
    const deployTransaction = MyContract.deploy({ data: '0x' + contractBytecode });
    const options = {
        data: deployTransaction.encodeABI(),
        gas: await deployTransaction.estimateGas(),
        gasPrice: await web3.eth.getGasPrice(),
        from: account,
        nonce: await web3.eth.getTransactionCount(account),
    };
    const signedTransaction = await web3.eth.accounts.signTransaction(options, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

    const contractAddress = receipt.contractAddress;
    console.log('Contract deployed at address:', contractAddress);
};

(async () => {
  try {
    await deploy();
  } catch (error) {
    console.error(error);
  }
})();