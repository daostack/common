import React from 'react';
import {IpfsClient} from '../Config';
import {NativeWallet} from '../Util/NativeWallet';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
const {width} = Dimensions.get('window');
import WalletManager from '../Util/WalletManager';
import MessageContract from '../Contracts/ABIs/MessageContract';
import {createCommon} from '../Util/createCommon';
import {createProposalRequestToJoin} from '../Util/createProposal';
import {getArc} from '../Util/arc';
import {inject, observer} from 'mobx-react';
import {BN} from 'bn.js';

const uid = 'test';

class nativeBridgeTests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mnemonics: '',
      mnemonicsAndStore: '',
      storedMnemonic:
        'order cabin immune pond brave guilt boil index car aware snap list',
      keychainMnemonics: '',
      networkURL: 'Rinkeby',
      address: '',
      balance: '',
      commonStatus: '',
      fetchSomeEthStatus: '',
      ownerAddress: '',
      ownerBalance: '',
      proposalStatus: '',
      scTXHash: '',
      txStatus: '',
      txHash: '',
      result: '',
    };

    this.child = React.createRef();
    WalletManager.init(uid);
  }

  generateMnemonic = async () => {
    try {
      const mnemonic = await NativeWallet.generateMnemonic();
      console.log('mnemonic: ', mnemonic);
      this.setState({mnemonic});
    } catch (e) {
      console.log(e);
    }
  };

  generateAndStoreMnemonic = async () => {
    try {
      const mnemonicsAndStore = await NativeWallet.generateAndStoreMnemonic(
        uid,
      );
      console.log('mnemonicsAndStore: ', mnemonicsAndStore);
      this.setState({mnemonicsAndStore});
    } catch (e) {
      console.log(e);
    }
  };

  storeMnemonic = async () => {
    try {
      const storedMnemonic = await NativeWallet.storeMnemonic(
        uid,
        'order cabin immune pond brave guilt boil index car aware snap list',
      );
      console.log('storeMnemonic: ', storedMnemonic);
      this.setState({storedMnemonic: 'true'});
    } catch (e) {
      throw 'Store mnemonic failed with error: ' + e;
    }
  };

  retrieveMnemonic = async () => {
    try {
      const keychainMnemonics = await NativeWallet.retrieveMnemonic(uid);
      console.log('keychainMnemonics: ', keychainMnemonics);
      this.setState({keychainMnemonics});
    } catch (e) {
      console.log(e);
    }
  };

  getOwnerBalance = async () => {
    try {
      const manager = WalletManager.getInstance();
      const address = await manager.getOwnerAccount();
      const balance = await manager.getBalance(address);
      console.log('ADDRESS: ', address);
      console.log('BALANCE: ', balance);
      this.setState({ownerAccount: address, ownerBalance: balance});
    } catch (e) {
      console.log(e);
    }
  };

  getSomeFunds = async () => {
    const manager = WalletManager.getInstance();
    const address = await manager.getOwnerAccount();
    let msg = `..fetching some Eth for your address ${address}`;
    this.setState({getSomeFundsStatus: msg});
    const response = await fetch(
      `https://us-central1-common-daostack.cloudfunctions.net/api/send-test-eth/${address}`,
    );
    this.setState({getSomeFundsStatus: `${await response.text()}`});
  };

  getBalance = async () => {
    try {
      const manager = WalletManager.getInstance();
      const address = manager.getAddress();
      const balance = await manager.getBalance(manager.address);
      console.log('ADDRESS: ', address);
      console.log('BALANCE: ', balance);
      this.setState({address, balance});
    } catch (e) {
      throw 'Send transaction failed with error: ' + e;
    }
  };

  sendTransaction = async () => {
    try {
      const manager = WalletManager.getInstance();
      const {hash} = await manager.sendTransaction(
        '0x41B788babf69FC7F98336ff7A47F5A80c3A63d40',
        '0.001',
      );
      this.setState({txHash: hash, txStatus: 'pending'});
      const receipt = await manager.provider.waitForTransaction(hash);
      this.setState({
        txStatus: receipt.status === 0 ? 'Failed' : 'Confirmed',
      });
    } catch (e) {
      throw 'Send transaction failed with error: ' + e;
    }
  };

  readSmartContract = async () => {
    try {
      const manager = WalletManager.getInstance();
      let value = await manager.readSmartContract(
        '0x2f21957c7147c3eE49235903D6471159a16c9ccd',
        MessageContract,
        'getMessage',
      );
      this.setState({result: value});
    } catch (e) {
      throw 'Send transaction failed with error: ' + e;
    }
  };

  callSmartContract = async () => {
    try {
      const manager = WalletManager.getInstance();
      let message = `Hello ${Math.floor(Math.random() * Math.floor(50))}`;
      console.log(message);
      const {
        hash,
      } = await manager.writeSmartContract(
        '0x2f21957c7147c3eE49235903D6471159a16c9ccd',
        MessageContract,
        'setMessage',
        [message],
      );
      this.setState({scTXHash: hash});
    } catch (e) {
      throw 'Send transaction failed with error: ' + e;
    }
  };

  createCommon = async () => {
    console.log('Creating common..');
    try {
      const wallet = WalletManager.getInstance();

      const arc = getArc(wallet.ethWallet);
      const name = `Test DAO ${Date()}`;
      IpfsClient.addAndPinString(
        JSON.stringify({
          name,
          byline: 'This is the byline',
          description:
            'This is the description, which can be loooooooooooooooooooonnnnnnnnnnnnnnnnnnnnnnnnggggggggggggggggggggg',
          courseOfAction: 'This is the course of action',
          // TODO: actuall add the values here (as an arry probably)
          rules: [
            {
              title: 'rule 1',
              description: 'description of rule 1',
            },
          ],
        }),
      );

      const receipt = await createCommon(
        await arc,
        {
          name,
          founderAddresses: wallet.ethWallet.address,
          minFeeToJoin: 100, // TDB: get from formData
          fundingGoal: 100000, // TBD: get from formdata
          // TBD: get form data for deadline; these are in secondSinceEpoch
          //TODO: get data for deadline from form data
          fundingGoalDeadline: 20200404,
          ipfsHash: 'QmNS94vjszCsBjnxYZLbfMSaQrnb7efuGs7zK6MXn34NCA',
        },
        this.props.navigation,
        this.props.daoStore,
      );

      this.setState({commonStatus: `Created common at ${receipt.result.id}`});
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  error = () => {
    this.props.daoStore.creationError('Error' + '2');
  };

  createProposal = async () => {
    console.log('creating proposal -- please wait');
    this.setState({
      proposalStatus: 'Creating JoinAndQuit proposal -- please wait',
    });
    try {
      const wallet = WalletManager.getInstance();
      console.log('wallet', wallet);
      const arc = await getArc(wallet.ethWallet);
      console.log('calling the function', arc);
      const data = {
        dao: '0x00f39da92b448670a258161d9d4143611ff6d9c5',
        title: `A test proposal on ${Date()}`,
        description: 'Some description',
        files: [],
        images: [],
        links: [], // {title: "title", url: "url"}
        funding: new BN(100000),
      };
      const proposal = await createProposalRequestToJoin(arc, data);
      this.setState({
        proposalStatus: `JoinAndQuit Proposal with id ${proposal.id} created!`,
      });
    } catch (e) {
      console.log(e);
      this.setState({proposalState: `${e}`});
    }
    console.log(`proposal created: ${proposal.id}`);
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={{marginBottom: 10}}>
            Network: {this.state.networkURL}
          </Text>

          <Text>Address: {this.state.ownerAccount}</Text>
          <Text>Balance: {this.state.ownerBalance}</Text>
          <TouchableOpacity
            onPress={this.getOwnerBalance}
            style={styles.button}>
            <Text>Get local Address and balance</Text>
          </TouchableOpacity>

          <Text>{this.state.getSomeFundsStatus}</Text>
          <TouchableOpacity onPress={this.getSomeFunds} style={styles.button}>
            <Text>Get some funds!</Text>
          </TouchableOpacity>

          <Text style={{marginVertical: 10}}>
            --------------- Common Interactions -----------------
          </Text>
          <Text>{this.state.commonStatus}</Text>
          <TouchableOpacity onPress={this.createCommon} style={styles.button}>
            <Text>Create Common</Text>
          </TouchableOpacity>

          <Text>{this.state.proposalStatus}</Text>
          <TouchableOpacity onPress={this.createProposal} style={styles.button}>
            <Text>Create a request-to-join Proposal</Text>
          </TouchableOpacity>

          <Text>{this.state.proposal2Status}</Text>
          <TouchableOpacity onPress={this.error} style={styles.button}>
            <Text>Create a funding request [TODO]</Text>
          </TouchableOpacity>

          <Text style={{marginVertical: 10}}>
            --------------- Wallet operrations -----------------
          </Text>

          <Text>mnemonicsAndStore: {this.state.mnemonicsAndStore}</Text>
          <TouchableOpacity
            onPress={this.generateAndStoreMnemonic}
            style={styles.button}>
            <Text>Generate And Store Mnemonic</Text>
          </TouchableOpacity>

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

          <TouchableOpacity onPress={this.error} style={styles.button}>
            <Text>Error</Text>
          </TouchableOpacity>
          <Text style={{marginVertical: 10}}>
            --------------- JavaScript -----------------
          </Text>
          <Text>Address: {this.state.address}</Text>
          <Text>Balance: {this.state.balance}</Text>
          <TouchableOpacity onPress={this.getBalance} style={styles.button}>
            <Text>Get Wallet address Balance (obsolete)</Text>
          </TouchableOpacity>

          <Text>Status: {this.state.txStatus}</Text>
          <Text>Hash: {this.state.txHash}</Text>
          <TouchableOpacity
            onPress={this.sendTransaction}
            style={styles.button}>
            <Text>Send Transaction</Text>
          </TouchableOpacity>

          <Text>Result: {this.state.result}</Text>
          <TouchableOpacity
            onPress={this.readSmartContract}
            style={styles.button}>
            <Text>Read Smart Contract</Text>
          </TouchableOpacity>

          <Text>TXHash: {this.state.scTXHash}</Text>
          <TouchableOpacity
            onPress={this.callSmartContract}
            style={styles.button}>
            <Text>Write Smart Contract</Text>
          </TouchableOpacity>
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
  },
});

export default inject('daoStore')(observer(nativeBridgeTests));
