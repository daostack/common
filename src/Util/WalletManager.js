import {NativeWallet} from './NativeWallet';
import {ethers, Contract} from 'ethers';
import CPK from 'contract-proxy-kit';
import {web3ProviderUrl} from '../Config';

export default class WalletManager {
  static myInstance = null;
  constructor(provider, cpkAddress, uid) {
    return (async () => {
      this.mnemonic = await NativeWallet.retrieveMnemonic(uid);
      this.provider = provider;
      this.ethWallet = ethers.Wallet.fromMnemonic(this.mnemonic).connect(
        this.provider,
      );
      this.wallet = await CPK.create({
        ethers,
        signer: this.ethWallet,
        networks: cpkAddress,
      });
      this.address = this.wallet.address.toLowerCase();
      return this;
    })();
  }

  static init = async uid => {
    const cpkAddress = {
      4: {
        masterCopyAddress: '0xaE32496491b53841efb51829d6f886387708F99B',
        proxyFactoryAddress: '0x336c19296d3989e9e0c2561ef21c964068657c38',
        multiSendAddress: '0xB522a9f781924eD250A11C54105E51840B138AdD',
        fallbackHandlerAddress: '0x40A930851BD2e590Bd5A5C981b436de25742E980',
      },
    };
    // const provider = new ethers.providers.InfuraProvider(
    //   'rinkeby',
    //   'e0cdf3bfda9b468fa908aa6ab03d5ba2',
    // );
    const provider = new ethers.providers.JsonRpcProvider(web3ProviderUrl);
    WalletManager.myInstance = await new WalletManager(
      provider,
      cpkAddress,
      uid,
    );
  };

  static getInstance = () => {
    if (WalletManager.myInstance == null) {
      throw new Error('WalletManager have not initialized');
    }
    return this.myInstance;
  };

  getAddress() {
    return this.wallet.address.toLowerCase();
  }

  getOwnerAccount = async () => {
    const account = await this.wallet.getOwnerAccount();
    return account.toLowerCase();
  };

  getBalance = async address => {
    return this.provider.getBalance(address).then(balance => {
      let balanceString = ethers.utils.formatEther(balance);
      return balanceString;
    });
  };

  sendTransaction = async (toAddress, value, data = '0x') => {
    return this.wallet
      .execTransactions([
        {
          operation: CPK.CALL,
          to: toAddress,
          value: ethers.utils.parseEther(value),
          data: data,
        },
      ])
      .catch(e => {
        console.log(e);
      });
  };

  readSmartContract = async (contractAddress, abi, functionName) => {
    const contract = new Contract(contractAddress, abi, this.provider);
    return await contract[functionName]();
  };

  writeSmartContract = async (
    contractAddress,
    abi,
    functionName,
    params,
    value = '0.0',
  ) => {
    const contract = new Contract(contractAddress, abi, this.provider);

    let data = contract.interface.functions[functionName].encode(params);
    let valueHex = ethers.utils.parseEther(value);

    return this.wallet
      .execTransactions([
        {
          operation: CPK.CALL,
          to: contractAddress,
          value: valueHex,
          data: data,
        },
      ])
      .catch(e => {
        console.log(e);
      });
  };
}
