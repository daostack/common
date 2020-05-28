import { NativeWallet } from './NativeWallet';
import { ethers, Contract } from 'ethers';
import { web3ProviderUrl, web3NetworkId } from '../Config';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import ABI from './abi.json';
export default class WalletManager {
  static myInstance = null;
  constructor(uid) {
    return (async () => {
      this.mnemonic = await NativeWallet.retrieveMnemonic(uid);
      this.provider = new ethers.providers.JsonRpcProvider(web3ProviderUrl);
      this.wallet = ethers.Wallet.fromMnemonic(this.mnemonic).connect(
        this.provider,
      );
      this.address = this.wallet.address.toLowerCase();
      return this;
    })();
  }

  static init = async uid => {
    WalletManager.myInstance = await new WalletManager(uid);
  };

  static getInstance = () => {
    if (WalletManager.myInstance == null) {
      throw new Error('WalletManager is not initialized');
    }
    return this.myInstance;
  };

  getAddress() {
    return this.address;
  }

  getBalance = async (address = this.address) => {
    return this.provider.getBalance(address).then(balance => {
      let balanceString = ethers.utils.formatEther(balance);
      return balanceString;
    });
  };

  readSmartContract = async (contractAddress, abi, functionName) => {
    const contract = new Contract(contractAddress, abi, this.provider);
    return await contract[functionName]();
  };

  signTransaction = async (to, value, data = '0x', chainId = web3NetworkId) => {
    const transaction = {
      to: to,
      value: ethers.utils.parseEther(value),
      data: data,
      chainId: chainId,
    };
    return await this.wallet.sign(transaction);
  };

  sendTransaction = async (to, value, data = '0x', chainId = web3NetworkId) => {
    const transaction = {
      to: to,
      value: ethers.utils.parseEther(value),
      data: data,
      chainId: chainId,
      gasLimit: 21000,
    };
    return await this.wallet.sendTransaction(transaction);
  };

  createSmartContractWallet = async () => {
    const idToken = await auth().currentUser.getIdToken();
    const options = { headers: { idToken } };
    const response = await axios.get(
      'https://us-central1-common-daostack.cloudfunctions.net/api/createWallet',
      options,
    );
    console.log('Create SCW', response);
    return response.data;
  };

  create2SmartContractWallet = async () => {
    const idToken = await auth().currentUser.getIdToken();
    const options = { headers: { idToken } };
    const response = await axios.get(
      'https://us-central1-common-daostack.cloudfunctions.net/api/create2Wallet',
      options,
    );
    console.log('Create2 SCW', response);
    return response.data;
  };

  execTransaction = async (safeWallet, toAddress, value = 0, data = '0x') => {
    try {
      const valueNumber = ethers.utils.parseEther(value).toString(10)
      console.log('valueNumber', valueNumber);
      const txHash = await this.createSafeTransactionHash(safeWallet, toAddress, valueNumber, data);
      const byteTxHash = ethers.utils.arrayify(txHash);
      const signedTx = await this.wallet.signMessage(byteTxHash)
      // Add 4
      let finalSignature = signedTx.replace(/1b$/, "1f").replace(/1c$/, "20");
      console.log('finalSignature', finalSignature)
      const idToken = await auth().currentUser.getIdToken();
      // const options = { headers: { idToken } };
      console.log('idToken', idToken)
      const body = { idToken, to: toAddress, value: valueNumber, data, signature: finalSignature }
      const response = await axios.post(
        'https://us-central1-common-daostack.cloudfunctions.net/api/execTransaction',
        // options,
        body
      );
      console.log('execTransaction ->', response)
      return response
    } catch (err) {
      console.log(err)
    }
  }

  createSafeTransactionHash = async (myWallet, toAddress, value, data = '0x') => {
    try {
      const masterCopyContract = new ethers.Contract(
        myWallet,
        ABI.MasterCopy,
        this.provider,
      );
      const zeroAddress = `0x${'0'.repeat(40)}`;
      const nonce = await masterCopyContract.nonce();
      const SAFE_TX_TYPEHASH = "0xbb8310d486368db6bd6f849402fdd73ad53d316b5a4b2644ad6efe0f941286d8";
      const DOMAIN_SEPARATOR_TYPEHASH = "0x035aff83d86937d35b32e04f0ddc6ff469290eef2f1b692d8a815c89404d4749";
      const domainSeperator = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["bytes32", "address"], [DOMAIN_SEPARATOR_TYPEHASH, myWallet]));
      let mySafeTxHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["bytes32", "address", "uint256", "bytes32", "uint8", "uint256", "uint256", "uint256", "address", "address", "uint"],
          [SAFE_TX_TYPEHASH, toAddress, value, ethers.utils.keccak256(data), 0, 0, 0, 0, zeroAddress, zeroAddress, nonce]
        )
      );

      let myTxHash = ethers.utils.solidityKeccak256(
        ["bytes1", "bytes1", "bytes32", "bytes32"],
        ["0x19", "0x01", domainSeperator, mySafeTxHash]
      );
      return myTxHash;
    } catch (err) {
      console.log(err)
    }
  }
}
