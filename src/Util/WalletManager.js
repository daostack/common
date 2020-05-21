import {NativeWallet} from './NativeWallet';
import {ethers, Contract} from 'ethers';
import {web3ProviderUrl, web3NetworkId} from '../Config';

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
    console.log('UUUU', this.wallet, transaction);
    const hash = await this.wallet.sign(transaction);
    console.log('AAAA', hash);
    // const repsonse = await this.provider.sendTransaction(hash);
    let repsonse = await this.wallet.sendTransaction(transaction);
    console.log('BBB', repsonse);
    return response;
  };
}
