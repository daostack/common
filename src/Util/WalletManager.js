import {NativeWallet} from './NativeWallet';
import {ethers} from 'ethers';
import CPK from 'contract-proxy-kit';

export default class WalletManager {
  static myInstance = null;
  constructor(provider, cpkAddress) {
    return (async () => {
      this.mnemonic = await NativeWallet.retrieveMnemonic();
      this.provider = provider;
      this.ethWallet = ethers.Wallet.fromMnemonic(this.mnemonic).connect(
        this.provider,
      );
      this.wallet = await CPK.create({
        ethers,
        signer: this.ethWallet,
        networks: cpkAddress,
      });
      this.address = this.wallet.address;
      return this;
    })();
  }

  static getInstance = async () => {
    if (WalletManager.myInstance == null) {
      const cpkAddress = {
        4: {
          masterCopyAddress: '0xaE32496491b53841efb51829d6f886387708F99B',
          proxyFactoryAddress: '0x336c19296d3989e9e0c2561ef21c964068657c38',
          multiSendAddress: '0xB522a9f781924eD250A11C54105E51840B138AdD',
          fallbackHandlerAddress: '0x40A930851BD2e590Bd5A5C981b436de25742E980',
        },
      };
      const provider = new ethers.providers.InfuraProvider(
        'rinkeby',
        '3c08878d00734c0c98a3e4741d0b4cfc',
      );
      WalletManager.myInstance = await new WalletManager(provider, cpkAddress);
    }
    return this.myInstance;
  };

  getAddress() {
    return this.wallet.address;
  }

  getOwnerAccount = async () => {
    return await this.wallet.getOwnerAccount();
  };

  getBalance = async address => {
    return this.provider.getBalance(address).then(balance => {
      let balanceString = ethers.utils.formatEther(balance);
      return balanceString;
    });
  };

  sendTransaction = async (toAddress, amount, data = '0x') => {
    return this.wallet
      .execTransactions([
        {
          operation: CPK.CALL,
          to: toAddress,
          value: ethers.utils.parseEther(amount),
          data: data,
        },
      ])
      .catch(e => {
        console.log(e);
      });
  };
}
