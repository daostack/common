import {NativeWallet} from './NativeWallet';
import {ethers, Contract} from 'ethers';
import {web3ProviderUrl, web3NetworkId} from '../Config';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
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
      throw new Error('WalletManager have not initialized');
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
    const options = {headers: {idToken}};
    console.log('Create SCW');
    const response = await axios.get(
      'https://us-central1-common-daostack.cloudfunctions.net/api/createWallet',
      options,
    );
    return response.data;
  };

  create2SmartContractWallet = async () => {
    const idToken = await auth().currentUser.getIdToken();
    const options = {headers: {idToken}};
    console.log('Create2 SCW');
    const response = await axios.get(
      'https://us-central1-common-daostack.cloudfunctions.net/api/create2Wallet',
      options,
    );
    return response.data;
  };
}
