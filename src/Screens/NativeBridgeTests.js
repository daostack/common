import React from 'react';
import {NativeWallet} from '../Util/NativeWallet';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
const { width } = Dimensions.get('window');
import { inject, observer } from 'mobx-react';
import { BN } from 'bn.js';
import WalletManager from '../Util/WalletManager';
import { BOTTOM_SHEET_TEMPLATES } from '../Stores/BottomSheetStore';
import ArcService from '../Services/ArcService';
import {
  ARC_VERSION ,
  GRAPH_VERSION ,
  graphHttpLink ,
  web3ProviderUrl ,
  relayerUrl ,
  COMMONTOKENADDRESS ,
} from '../Config';
import Toast from '../Util/Toast';
import { auth } from '../Firebase';
import ABI from '../Util/abi.json';
import { ethers } from 'ethers';
import { showErrorPopUp } from '../Util';

class nativeBridgeTests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mnemonics: '',
      mnemonicsAndStore: '',
      storedMnemonic:
        'order cabin immune pond brave guilt boil index car aware snap list',
      keychainMnemonics: '',
      networkURL: web3ProviderUrl,
      address: '',
      balance: '',
      ownerAddress: '',
      ownerBalance: '',
      txStatus: '',
      txHash: '',
      signHash: '',
      result: '',
      cwTXHash: '',
      cwAddress: '',
      cw2TXHash: '',
      cw2Address: '',
      commonStatus: '',
      proposalStatus: '',
      proposalVotingStatus: '',
      safeTxHash: '',
      whiteListMsg: '',
      safeWallet: '',
      safeWalletBalance: '',
      safeSCHash: '',
      CMNBalance: '',
      CMNTxHash: '',
      CMNAllowance: '',
    };

    this.uid = auth().currentUser?.uid;
    this.child = React.createRef();
    if (!this.uid) {
      Toast.error('uid is null');
    }
    // console.log('NativeBridgeTests------------', this.uid);
  }

  generateMnemonic = async () => {
    try {
      const mnemonic = await NativeWallet.generateMnemonic();
      console.log('mnemonic: ', mnemonic);
      this.setState({ mnemonic });
    } catch (e) {
      console.log(e);
    }
  };

  generateAndStoreMnemonic = async () => {
    try {
      const mnemonicsAndStore = await NativeWallet.generateAndStoreMnemonic(
        this.uid,
      );
      console.log('mnemonicsAndStore: ', mnemonicsAndStore);
      this.setState({ mnemonicsAndStore });
    } catch (e) {
      console.log(e);
    }
  };

  storeMnemonic = async () => {
    try {
      const storedMnemonic = await NativeWallet.storeMnemonic(
        this.uid,
        'order cabin immune pond brave guilt boil index car aware snap list',
      );
      console.log('storeMnemonic: ', storedMnemonic);
      this.setState({ storedMnemonic: 'true' });
    } catch (e) {
      throw 'Store mnemonic failed with error: ' + e;
    }
  };

  retrieveMnemonic = async () => {
    try {
      const keychainMnemonics = await NativeWallet.retrieveMnemonic(this.uid);
      console.log('keychainMnemonics: ', keychainMnemonics);
      this.setState({ keychainMnemonics });
    } catch (e) {
      console.log(e);
    }
  };

  getOwnerBalance = async () => {
    try {
      const manager = await WalletManager.getInstance();
      const address = await manager.getAddress();
      const balance = await manager.getBalance(address);
      console.log('ADDRESS: ', address);
      console.log('BALANCE: ', balance);
      this.setState({ ownerAccount: address, ownerBalance: balance });
    } catch (e) {
      console.log(e);
    }
  };

  getBalance = async () => {
    try {
      const manager = await WalletManager.getInstance();
      const address = manager.getAddress();
      const balance = await manager.getBalance(manager.address);
      console.log('ADDRESS: ', address);
      console.log('BALANCE: ', balance);
      this.setState({ address, balance });
    } catch (e) {
      throw 'Send transaction failed with error: ' + e;
    }
  };

  signTransaction = async () => {
    try {
      const manager = await WalletManager.getInstance();
      const hash = await manager.signTransaction(
        '0xA60f8a3E6586aA590a4AD9EE0F264A1473Bab7cB',
        '0.001',
      );
      this.setState({ signHash: hash });
    } catch (e) {
      throw 'Send transaction failed with error: ' + e;
    }
  };

  sendTransaction = async () => {
    try {
      const manager = await WalletManager.getInstance();
      const { hash } = await manager.sendTransaction(
        '0xA60f8a3E6586aA590a4AD9EE0F264A1473Bab7cB',
        '0.001',
      );
      this.setState({ txHash: hash, txStatus: 'pending' });
      const receipt = await manager.provider.waitForTransaction(hash);
      this.setState({
        txStatus: receipt.status === 0 ? 'Failed' : 'Confirmed',
      });
    } catch (e) {
      throw 'Send transaction failed with error: ' + e;
    }
  };

  getSafeBalance = async () => {
    try {
      console.log('getSafeBalance');
      if (!this.props.userStore) {
        throw Error('No userinfo found - perhaps you are not logged in?');
      }
      const safeWallet = this.props.userStore.userInfo.safeAddress;
      const manager = await WalletManager.getInstance();
      console.log(
        'safeWallet',
        safeWallet,
        manager.safeAddress,
      );
      const safeWalletBalance = await manager.getBalance(safeWallet);
      console.log('safeWalletBalance', safeWalletBalance);
      this.setState({ safeWallet, safeWalletBalance });
    } catch (e) {
      throw 'Send transaction failed with error: ' + e;
    }
  };

  createSmartContractWallet = async () => {
    try {
      const safeWallet = this.props.userStore.userInfo.safeAddress;
      if (safeWallet) {
        this.setState({
          cwTXHash: 'You already have a safe wallet',
          cwAddress: safeWallet,
        });
        return;
      }
      const manager = await WalletManager.getInstance();
      const { txHash, safeAddress } = await manager.createSmartContractWallet();
      console.log('txHash ->', txHash);
      this.setState({ cwTXHash: txHash, cwAddress: safeAddress });
    } catch (e) {
      throw 'Send transaction failed with error: ' + e;
    }
  };

  create2SmartContractWallet = async () => {
    try {
      const safeWallet = this.props.userStore.userInfo.safeAddress;
      if (safeWallet) {
        this.setState({
          cw2TXHash: 'You already have a safe wallet',
          cw2Address: safeWallet,
        });
        return;
      }
      const manager = await WalletManager.getInstance();
      const { txHash } = await manager.create2SmartContractWallet();
      console.log('txHash ->', txHash);
      this.setState({ cw2TXHash: txHash });
      const address = await manager.getAddressFromEvent(txHash);
      this.setState({ cw2Address: address });
    } catch (e) {
      throw 'Send transaction failed with error: ' + e;
    }
  };

  execTransaction = async () => {
    try {
      const safeAddress = this.props.userStore.userInfo.safeAddress;
      if (safeAddress === null) {
        this.setState({ safeTxHash: 'No wallet found, you need create one' });
        return;
      }
      const manager = await WalletManager.getInstance();
      const response = await manager.execTransaction(
        safeAddress,
        '0xA60f8a3E6586aA590a4AD9EE0F264A1473Bab7cB',
        ethers.utils.parseEther('0.01').toString(10)
      );
      console.log('txHash ->', response.data.txHash);
      this.setState({
        safeTxHash: response.data.txHash || response.data.message,
      });
    } catch (e) {
      console.log(e);
      throw 'Send transaction failed with error: ' + e;
    }
  };

  execSmartContract = async () => {
    try {
      const safeAddress = this.props.userStore.userInfo.safeAddress;
      if (safeAddress === null) {
        this.setState({ safeSCHash: 'No wallet found, you need create one' });
        return;
      }
      const manager = await WalletManager.getInstance();
      const tokenAddress = '0x3111C94B9243a8A99D5A867e00609900e437E2c0';
      const iface = new ethers.utils.Interface(ABI.ERC20);
      const data = iface.functions.transfer.encode([
        '0xA60f8a3E6586aA590a4AD9EE0F264A1473Bab7cB',
        ethers.utils.parseEther('0.1'),
      ]);
      // console.log('iface ->', iface, data);
      const response = await manager.execTransaction(
        safeAddress,
        tokenAddress,
        '0',
        data,
      );
      // console.log('response ->', response);
      this.setState({
        safeSCHash: response.data.txHash || response.data.message,
      });
    } catch (e) {
      console.log(e);
    }
  };

  addToWhitelist = async () => {
    try {
      const manager = await WalletManager.getInstance();
      const response = await manager.addToWhitelist();
      console.log('addWhitleList ->', response);
      this.setState({ whiteListMsg: response.data.message });
    } catch (e) {
      console.log(e);
      throw 'Send transaction failed with error: ' + e;
    }
  };

  getTokenBalance = async () => {
    try {
      const manager = await WalletManager.getInstance();
      const balance = await manager.getTokenBalance();
      this.setState({ CMNBalance: balance });
    } catch (e) {
      console.log(e);
      throw 'Send transaction failed with error: ' + e;
    }
  }

  getTokenAllowance = async () => {
    try {
      const manager = await WalletManager.getInstance();
      const daoId = '0x59b1c80f882c38abd52a90c9b30edafa55f7e421';
      const address = await ArcService.getInstance().getJoinPluginAddress(daoId);
      const balance = await manager.getAllowance(address);
      this.setState({ CMNAllowance: balance });
    } catch (e) {
      console.log(e);
      throw 'Send transaction failed with error: ' + e;
    }
  }

  createCommon = async () => {
    try {
      if (!this.props.userStore) {
        throw Error('No userinfo found - perhaps you are not logged in?');
      }

      const manager = await WalletManager.getInstance();
      const commonAddress = await ArcService.getInstance().createCommon(
        {
          name: 'Test dao 666',
          founderAddresses: manager.safeAddress,
          minFeeToJoin: 0,
          fundingGoal: 10000,
          fundingGoalDeadline: Math.round(new Date().getTime() / 1000),
        },
        this.props.navigation
      );

      this.setState({ commonStatus: `${JSON.stringify(commonAddress)}` });
    } catch (error) {
      this.props.bottomSheetStore.showBottomSheet(
        BOTTOM_SHEET_TEMPLATES.TRANSACTION_ERROR,
        { errorMessage: error.message },
      );
      this.setState({ commonStatus: `${error}` });
    }
  };

  createRequestToJoin = async () => {
    console.log('creating proposal -- please wait');
    const daoId = '0x65b9355b8ab2e224693ca25bc9fa16f4a220edb9'; // 0 min join fee
    this.setState({
      proposalStatus: 'Creating Join proposal -- please wait',
    });
    let proposalId;
    try {
      const data = {
        title: `A test proposal to join ${daoId}`,
        description: 'Some description',
        files: [],
        images: [],
        links: [{ title: 'title', url: 'http://www.common.io/' }],
        funding: new BN(0), // this is the fee
        payment: {
          funding: 0,
        },
      };
      proposalId = await ArcService.getInstance().createRequestToJoin(
        daoId,
        data
      );
      this.setState({
        proposalStatus: `Join Proposal with id ${proposalId} created!`,
      });
      const msg = `proposal created: ${proposalId}`;
      console.log(msg);
      this.setState({ proposalState: msg });
    } catch (e) {
      showErrorPopUp(this.props.bottomSheetStore, JSON.stringify(e.data));
      this.setState({ proposalState: `${JSON.stringify(e)}` });
    }
  };

  createFundingProposal = async () => {
    console.log('creating Funding Proposal -- please wait');
    const daoId = '0x31f40d8843f46a29c43f5e7f1c88d86d5698bfb6';
    this.setState({
      proposalStatus: 'Creating Funding Request proposal -- please wait',
    });
    let proposal;
    try {
      const data = {
        title: `A test funding proposal on ${Date()}`,
        description: 'Funding request description',
        files: [],
        images: [],
        links: [], // {title: "title", url: "url"}
        funding: new BN(3),
      };
      proposal = await ArcService.getInstance().createFundingProposal(
        this.props.userStore.userInfo.safeAddress,
        daoId,
        data,
      );
      this.setState({
        proposalStatus: `Funding Request Proposal with id ${proposal.id} created!`,
      });
    } catch (e) {
      console.log(e);
      this.setState({ fundingProposalState: `${e}` });
    }
    console.log(`proposal created: ${proposal.id}`);
  };

  voteForJoinProposal = async () => {
    console.log('Vote for proposal -- please wait');
    const proposalId =
      '0xb99e0a8daeb6dcaab9756202ec375153a8498b947d7b2ac864df0635e2928ef0'; // Proposal for the 0 min funding dao made from user lyubomir.petkov@limechain.tech
    this.setState({
      proposalVotingStatus: 'VOTING for  proposal -- please wait',
    });
    try {
      const data = {
        vote: 1,
      };
      const vote = await ArcService.getInstance().voteForJoinProposal(
        proposalId,
        data,
      );
      this.setState({
        proposalVotingStatus: `VOTING for a Proposal with id ${vote.id} created!`,
      });
    } catch (e) {
      this.setState({ voteState: `${e}` });
      // showErrorPopUp(this.props.bottomSheetStore, e.message);
    }
    //console.log(`proposal created: ${proposal.id}`);
  };

  openTxhash = hash => {
    this.props.navigation.navigate('Browser', {
      url: `https://blockscout.com/poa/xdai/tx/${hash}`,
    });
  };

  openAddress = address => {
    this.props.navigation.navigate('Browser', {
      url: `https://blockscout.com/poa/xdai/address/${address}`,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>

          <TouchableOpacity onPress={this.error} style={styles.button}>
            <Text>Error</Text>
          </TouchableOpacity>
          <Text>Address: {this.state.ownerAccount}</Text>
          <Text>Balance: {this.state.ownerBalance}</Text>
          <TouchableOpacity
            onPress={this.getOwnerBalance}
            style={styles.button}>
            <Text>Get local Address and balance</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.getSomeFunds} style={styles.button}>
            <Text>Get some funds!</Text>
          </TouchableOpacity>

          <Text style={{ marginVertical: 10 }}>
            --------------- Common Interactions -----------------
          </Text>
          <Text>{this.state.commonStatus}</Text>
          <TouchableOpacity onPress={this.createCommon} style={styles.button}>
            <Text>Create Common</Text>
          </TouchableOpacity>

          <Text>{this.state.proposalState}</Text>
          <TouchableOpacity
            onPress={this.createRequestToJoin}
            style={styles.button}>
            <Text>Create a request to join</Text>
          </TouchableOpacity>

          <Text>{this.state.fundingProposalState}</Text>
          <TouchableOpacity
            onPress={this.createFundingProposal}
            style={styles.button}>
            <Text>Create a funding request</Text>
          </TouchableOpacity>

          <Text>{this.state.voteState}</Text>
          <TouchableOpacity
            onPress={this.voteForJoinProposal}
            style={styles.button}>
            <Text>Vote for proposal</Text>
          </TouchableOpacity>

          <Text>mnemonicsAndStore: {this.state.mnemonicsAndStore}</Text>
          <TouchableOpacity
            onPress={this.generateAndStoreMnemonic}
            style={styles.button}>
            <Text>Generate And Store Mnemonic</Text>
          </TouchableOpacity>

          <Text style={{ marginVertical: 10 }}>
            --------------- Native Bridge -----------------
          </Text>
          <Text>mnemonic: {this.state.mnemonic}</Text>
          <TouchableOpacity
            onPress={this.generateMnemonic}
            style={styles.button}>
            <Text>Generate Mnemonic</Text>
          </TouchableOpacity>

          <Text>mnemonicsAndStore: {this.state.mnemonicsAndStore}</Text>
          <TouchableOpacity
            onPress={this.generateAndStoreMnemonic}
            style={styles.button}>
            <Text>Generate And Store Mnemonic</Text>
          </TouchableOpacity>

          <Text>local: {this.state.keychainMnemonics}</Text>
          <TouchableOpacity
            onPress={this.retrieveMnemonic}
            style={styles.button}>
            <Text>Retrieve Mnemonic From Local</Text>
          </TouchableOpacity>

          <Text>storeMnemonic: {this.state.storedMnemonic}</Text>
          <TouchableOpacity onPress={this.storeMnemonic} style={styles.button}>
            <Text>Store Mnemonic</Text>
          </TouchableOpacity>

          <Text style={{ marginVertical: 10 }}>
            --------------- Local Wallet -----------------
          </Text>
          <TouchableOpacity
            onPress={() => this.openAddress(this.state.address)}>
            <Text>Address: {this.state.address}</Text>
          </TouchableOpacity>
          <Text>Balance: {this.state.balance}</Text>
          <TouchableOpacity onPress={this.getBalance} style={styles.button}>
            <Text>Get Wallet address Balance (obsolete)</Text>
          </TouchableOpacity>

          <Text>Status: {this.state.signHash}</Text>
          <TouchableOpacity
            onPress={this.signTransaction}
            style={styles.button}>
            <Text>Sign Transaction</Text>
          </TouchableOpacity>

          <Text>Status: {this.state.txStatus}</Text>
          <TouchableOpacity onPress={() => this.openTxhash(this.state.txHash)}>
            <Text>Hash: {this.state.txHash}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.sendTransaction}
            style={styles.button}>
            <Text>Send Transaction</Text>
          </TouchableOpacity>

          {/* <Text>Result: {this.state.result}</Text>
          <TouchableOpacity
            onPress={this.readSmartContract}
            style={styles.button}>
            <Text>Read Smart Contract</Text>
          </TouchableOpacity> */}

          <Text style={{ marginVertical: 10 }}>
            --------------- Relayer -----------------
          </Text>

          <TouchableOpacity
            onPress={() => this.openAddress(this.state.safeWallet)}>
            <Text>Address: {this.state.safeWallet}</Text>
          </TouchableOpacity>
          <Text>Balance: {this.state.safeWalletBalance}</Text>
          <TouchableOpacity onPress={this.getSafeBalance} style={styles.button}>
            <Text>Get Safe Wallet Balance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.openTxhash(this.state.cwTXHash)}>
            <Text>TXHash: {this.state.cwTXHash}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.openAddress(this.state.cwAddress)}>
            <Text>Address: {this.state.cwAddress}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.createSmartContractWallet}
            style={styles.button}>
            <Text>Create Smart Wallet</Text>
          </TouchableOpacity>

          {/* <Text>TXHash: {this.state.cw2TXHash}</Text>
          <Text>Address: {this.state.cw2Address}</Text>
          <TouchableOpacity
            onPress={this.create2SmartContractWallet}
            style={styles.button}>
            <Text>Create2 Smart Wallet</Text>
          </TouchableOpacity> */}

          {/* <Text>Msg: {this.state.whiteListMsg}</Text>
          <TouchableOpacity
            onPress={this.addToWhitelist}
            style={styles.button}>
            <Text>Add self white list</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => this.openTxhash(this.state.safeSCHash)}>
            <Text>TxHash: {this.state.safeSCHash}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.execSmartContract}
            style={styles.button}>
            <Text>execSmartContract</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.openTxhash(this.state.safeTxHash)}>
            <Text>TxHash: {this.state.safeTxHash}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.execTransaction}
            style={styles.button}>
            <Text>execTransaction</Text>
          </TouchableOpacity>

          <Text style={{ marginVertical: 10 }}>
            --------------- ERC20 -----------------
          </Text>

          <Text>{this.state.CMNBalance} CMN</Text>
          <TouchableOpacity
            onPress={this.getTokenBalance}
            style={styles.button}>
            <Text>Get Common Token Balance</Text>
          </TouchableOpacity>

          <Text>Allowance: {this.state.CMNAllowance} </Text>
          <TouchableOpacity
            onPress={this.getTokenAllowance}
            style={styles.button}>
            <Text>Get Common Token Allowance</Text>
          </TouchableOpacity>


          <Text style={{ marginBottom: 10 }}>
            ARC_VERSION: {ARC_VERSION}
          </Text>
          <Text style={{ marginBottom: 10 }}>
            GRAPH_VERSION: {GRAPH_VERSION}
          </Text>
          <Text style={{ marginBottom: 10 }}>
            graphHttpLink: {graphHttpLink}
          </Text>
          <Text style={{ marginBottom: 10 }}>
            ARC_VERSION: {ARC_VERSION}
          </Text>
          <Text style={{ marginBottom: 10 }}>
            relayerUrl: {relayerUrl()}
          </Text>
          <Text style={{ marginBottom: 10 }}>
            COMMONTOKENADDRESS: {COMMONTOKENADDRESS}
          </Text>
          <Text style={{ marginBottom: 10 }}>
          Network: {this.state.networkURL}
          </Text>

          {/* graphwsLink
  ipfsLink
  web3ProviderUrl */}

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    width,
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 40,
    backgroundColor: 'grey',
    marginBottom: 5,
  },
  smallButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 66,
    height: 40,
    backgroundColor: 'grey',
  },
});

export default inject(
  'userStore',
  'bottomSheetStore',
)(observer(nativeBridgeTests));
