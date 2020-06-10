import { NativeWallet } from './NativeWallet';
import { ethers, Contract } from 'ethers';
import { web3ProviderUrl, web3NetworkId } from '../Config';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import ABI from './abi.json';
import FirebaseService from '../Services/FirebaseService';

ethers.Contract.prototype.sendToRelayer = async function (funcName, params, value = '0') {
  const data = this.interface.functions[funcName].encode(params);
  const manager = WalletManager.getInstance();
  const response = await manager.execTransaction(manager.safeAddress, this.address, value, data);
  return response.data?.txHash;
};


ethers.Contract.prototype.sendToRelayerWithReceipt = async function (funcName, params, value = '0') {
  console.log(`HERE: ${funcName}`, params, value);
  const txHash = await this.sendToRelayer(funcName, params, value);
  console.log('txHash ->', txHash);
  if (!txHash) {
    // throw new Error('');
    return null;
  }
  const manager = WalletManager.getInstance();
  const receipt = await manager.provider.waitForTransaction(txHash);
  const events = manager.getTransactionEvents(this.interface, receipt);
  receipt.events = events;
  return receipt;
};

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
      // TODO: replace with userStore or user manager
      const userData = await FirebaseService.getInstance().getUserById(uid);
      this.safeAddress = userData?.safeAddress;
      console.log('safeAddress ->', this.safeAddress);
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
    return WalletManager.myInstance;
  };

  getAddress() {
    return this.address;
  }

  getSafeAddress() {
    return this.safeAddress;
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
    const currentUser = auth().currentUser;
    const idToken = await currentUser.getIdToken();
    const options = { headers: { idToken } };
    const response = await axios.get(
      'https://us-central1-common-daostack.cloudfunctions.net/api/createWallet',
      options,
    );
    await this.provider.waitForTransaction(response.data.txHash);
    await WalletManager.init(currentUser.uid); // Re-init for safeAddress
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
      const valueNumber = ethers.utils.parseEther(value).toString(10);
      const txHash = await this.createSafeTransactionHash(safeWallet, toAddress, valueNumber, data);
      const byteTxHash = ethers.utils.arrayify(txHash);
      const signedTx = await this.wallet.signMessage(byteTxHash);
      // Add 4
      let finalSignature = signedTx.replace(/1b$/, '1f').replace(/1c$/, '20');
      // console.log('finalSignature', finalSignature)
      const idToken = await auth().currentUser.getIdToken();

      // const masterCopyContract = new ethers.Contract(
      //   safeWallet,
      //   ABI.MasterCopy,
      //   this.wallet,
      // );

      // const OVERRIDES = {
      //   gasLimit: 10000000,
      //   gasPrice: 15000000000,
      // };

      // const zeroAddress = `0x${'0'.repeat(40)}`;
      // const tx = await masterCopyContract.execTransaction(toAddress, valueNumber, data, 0, 0, 0, 0, zeroAddress, zeroAddress, finalSignature, OVERRIDES);
      // console.log('execTransaction', tx);

      const body = { idToken, to: toAddress, value: valueNumber, data, signature: finalSignature };
      const response = await axios.post(
        'https://us-central1-common-daostack.cloudfunctions.net/api/execTransaction',
        // options,
        body
      );
      // console.log('execTransaction ->', response);
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  addToWhitelist = async () => {
    const idToken = await auth().currentUser.getIdToken();
    const options = { headers: { idToken } };
    const response = await axios.get(
      'https://us-central1-common-daostack.cloudfunctions.net/api/addWhitleList',
      options,
    );
    return response;
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
      const SAFE_TX_TYPEHASH = '0xbb8310d486368db6bd6f849402fdd73ad53d316b5a4b2644ad6efe0f941286d8';
      const DOMAIN_SEPARATOR_TYPEHASH = '0x035aff83d86937d35b32e04f0ddc6ff469290eef2f1b692d8a815c89404d4749';
      const domainSeperator = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['bytes32', 'address'], [DOMAIN_SEPARATOR_TYPEHASH, myWallet]));
      let mySafeTxHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['bytes32', 'address', 'uint256', 'bytes32', 'uint8', 'uint256', 'uint256', 'uint256', 'address', 'address', 'uint'],
          [SAFE_TX_TYPEHASH, toAddress, value, ethers.utils.keccak256(data), 0, 0, 0, 0, zeroAddress, zeroAddress, nonce]
        )
      );
      let myTxHash = ethers.utils.solidityKeccak256(
        ['bytes1', 'bytes1', 'bytes32', 'bytes32'],
        ['0x19', '0x01', domainSeperator, mySafeTxHash]
      );
      return myTxHash;
    } catch (err) {
      console.log(err);
    }
  }

  getAddressFromEvent = async hash => {
    const receipt = await this.provider.waitForTransaction(hash);
    console.log('receipt', receipt);
    let eventABI = [
      {
        type: 'event',
        name: 'ProxyCreation',
        inputs: [
          {
            type: 'address',
            name: 'proxy',
            internalType: 'contract GnosisSafeProxy',
            indexed: false,
          },
        ],
        anonymous: false,
      },
    ];
    const iface = new ethers.utils.Interface(eventABI);
    const events = receipt.logs.map(log => {
      return iface.parseLog(log);
    });
    console.log('address', events[0].values.proxy);
    return events[0].values.proxy;
  };

  getTransactionEvents = (interf, receipt) => {
      const txEvents = {};
      const abiEvents = Object.values(interf.events);
      for (const log of receipt.logs)
      {
          for (const abiEvent of abiEvents)
          {
              if (abiEvent.topic === log.topics[0])
              {
                  txEvents[abiEvent.name] = abiEvent.decode(log.data, log.topics);
                  break;
              }
          }
      }
      return txEvents;
  }
}
