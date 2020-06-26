import { NativeWallet } from './NativeWallet';
import { ethers, Contract } from 'ethers';
import { web3ProviderUrl, web3NetworkId, COMMONTOKENADDRESS, relayerUrl, defaultAllowance } from '../Config';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import ABI from './abi.json';
import FirebaseService from '../Services/FirebaseService';
import Toast from './Toast';

ethers.Contract.prototype.sendToRelayer = async function (funcName, params, value = '0') {
  const data = this.interface.functions[funcName].encode(params);
  const manager = await WalletManager.getInstance();
  console.log(data);
  const response = await manager.execTransaction(manager.safeAddress, this.address, value, data);
  return response.data?.txHash;
};


ethers.Contract.prototype.sendToRelayerWithReceipt = async function (funcName, params, value = '0') {
  const txHash = await this.sendToRelayer(funcName, params, value);
  console.log('txHash ->', txHash);
  if (!txHash) {
    // throw new Error('');
    return null;
  }
  const manager = await WalletManager.getInstance();
  const receipt = await manager.provider.waitForTransaction(txHash);
  const events = manager.getTransactionEvents(this.interface, receipt);
  receipt.events = events;
  return receipt;
};

const axiosClient = axios.create({
  baseURL: relayerUrl,
  // for dev
  // baseURL: 'http://localhost:5000/common-daostack/us-central1/relayer/',
  timeout: 1000000, // milliseconds
});

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

  static getInstance = async () => {
    if (WalletManager.myInstance == null) {
      const uid = auth().currentUser?.uid;
      if (uid) {
        await WalletManager.init(uid);
        return WalletManager.myInstance;
      }
      throw new Error('WalletManager is not initialized, user is null');
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
    const response = await axiosClient.get(
      'createWallet',
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
    const response = await axiosClient.get(
      'create2Wallet',
      options,
    );
    console.log('Create2 SCW', response);
    return response.data;
  };

  txHashSignature = async (safeAddress, toAddress, value = '0', data = '0x') => {
    try {
      const valueNumber = ethers.utils.parseEther(value).toString(10);
      const txHash = await this.createSafeTransactionHash(safeAddress, toAddress, valueNumber, data);
      const byteTxHash = ethers.utils.arrayify(txHash);
      const signedTx = await this.wallet.signMessage(byteTxHash);
      // Add 4
      let finalSignature = signedTx.replace(/1b$/, '1f').replace(/1c$/, '20');
      return finalSignature;
    } catch (err) {
      throw err;
    }
  }

  execTransaction = async (safeAddress, toAddress, value = 0, data = '0x') => {
    try {
      const finalSignature = await this.txHashSignature(safeAddress, toAddress, value, data);
      const idToken = await auth().currentUser.getIdToken();

      // const masterCopyContract = new ethers.Contract(
      //   safeAddress,
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

      const body = { idToken, to: toAddress, value: value, data, signature: finalSignature };
      const response = await axiosClient.post(
        'execTransaction',
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
    const response = await axiosClient.get(
      'addWhitleList',
      options,
    );
    return response;
  }

  requestToJoin = async (pluginContract, method, params, paymentData) => {
    try {
      const pluginAddress = pluginContract.address;
      const zeroValue = '0';
      let interf = new ethers.utils.Interface(ABI.CommonToken);
      // TODO: please to not use parseEther here, just pass on the intended allowance
      const data1 = interf.functions.approve.encode([pluginAddress, ethers.utils.parseEther(defaultAllowance.toString())]);
      const signature1 = await this.txHashSignature(this.safeAddress, COMMONTOKENADDRESS, zeroValue, data1);
      console.log('signature1 -->', signature1);
      const data2 = pluginContract.interface.functions[method].encode(params);
      const signature2 = await this.txHashSignature(this.safeAddress, pluginAddress, zeroValue, data2);
      console.log('signature2 -->', signature2);
      const idToken = await auth().currentUser.getIdToken();
      const body =
      {
        idToken,
        commonTx: {
          to: COMMONTOKENADDRESS,
          value: zeroValue,
          data: data1,
          signature: signature1,
        },
        pluginTx: {
          to: pluginAddress,
          value: zeroValue,
          data: data2,
          signature: signature2,
        },
        paymentData,
      };
      /* const idToken = await auth().currentUser.getIdToken();
      const body =
      {
        idToken,
        paymentData,
      }; */

      console.log('RequestToJoin Body ->', body);
      console.log('RequestToJoin sent to cloud function');
      const response = await axiosClient.post(
        'requestToJoin',
        body
      );

      let msg;
      if (!response.data) {
        console.log('RequestToJoin response -->', response);
        msg = 'Response has no "data" property - thats not good at all :(';
        throw Error(msg);
      }
      console.log('RequestToJoin response.data -->', response.data);
      if (response.data.errcode) {
        msg = `Code: ${response.data.errorCode}, Message: ${response.data.error}`;
        throw Error(msg);
      }

      if (!response.data.proposalId) {
        // TODO: print or return tha transaction hash, so we can debug more easily
        // this happens typically when some preconditions are not met (say you are already a member)
        msg = 'No proposal Id was found in the response';
        throw Error(msg);
      }
      console.log(JSON.stringify(response));
      console.log(`Created proposal with id ${response.data.proposalId}`);
      return response.data.proposalId;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  createCommonStep2 = async (contract, method, params, commonId) => {
    try {
      const idToken = await auth().currentUser.getIdToken();
      const address = contract.address;
      const zeroValue = '0';
      const data = contract.interface.functions[method].encode(params);
      const signature = await this.txHashSignature(this.safeAddress, address, zeroValue, data);

      console.log('signature1 -->', signature);

      const body = {
        idToken,
        commonTx: {
          to: address,
          value: zeroValue,
          data,
          signature,
        },
        commonId,
      };

      const response = await axiosClient.post(
        'createCommonStep2',
        body
      );

      console.log('CreateCommonStep2 response -->', response);

      if (!response.data) {
        console.log(response);
        throw Error('unexpected error sending request to createCommon2: empty response');
      }
      if (response.data.errcode) {
        // TODO: throw an error here, do not show it
        Toast.error(`Code: ${response.data.errorCode}, Message: ${response.data.error}`);
        return null;
      }

      console.log(response.data);

      return response.data;
    } catch (err){
      console.log(err);
      throw err;
    }
  }

  getAllowance = async pluginAddress => {
    let contract = new ethers.Contract(COMMONTOKENADDRESS, ABI.CommonToken, this.provider);
    let allowance = await contract.allowance(this.safeAddress, pluginAddress);
    const allowanceStr = ethers.utils.formatEther(allowance);
    console.log('allowance ->', allowanceStr);
    return allowanceStr;
  }

  getTokenBalance = async () => {
    const address = this.safeAddress;
    const contract = new ethers.Contract(COMMONTOKENADDRESS, ABI.CommonToken, this.provider);
    const balance = await contract.balanceOf(address);
    const balanceStr =  ethers.utils.formatEther(balance);
    console.log('balance ->', balance);
    return balanceStr;
  }

  createSafeTransactionHash = async (myWallet, toAddress, value, data = '0x') => {
    try {
      const masterCopyContract = new ethers.Contract(
        myWallet,
        ABI.MasterCopy,
        this.provider,
      );
      const zeroAddress = ethers.constants.AddressZero;
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

  isRelayerTxSuccess = async txHash => {
    const receipt = await this.provider.waitForTransaction(txHash);
    return this.isRelayerTxSuccessWithReceipt(receipt);
  }

  isRelayerTxSuccessWithReceipt = receipt => {
    const ExecutionFailureTopic = '0x23428b18acfb3ea64b08dc0c1d296ea9c09702c09083ca5272e64d115b687d23';
    for (const log of receipt.logs) {
      if (log.topics[0] === ExecutionFailureTopic) {
        return false;
      }
    }
    return true;
  }

  // Safe Wallet Address Event
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
