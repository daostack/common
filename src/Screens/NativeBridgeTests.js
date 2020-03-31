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
const {height, width} = Dimensions.get('window');
import WalletManager from '../Util/WalletManager';

export default class nativeBridgeTests extends React.Component {
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
      ownerAddress: '',
      ownerBalance: '',
      txStatus: '',
      txHash: '',
      result: '',
      scTXHash: '',
    };

    this.child = React.createRef();
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
      const mnemonicsAndStore = await NativeWallet.generateAndStoreMnemonic();
      console.log('mnemonicsAndStore: ', mnemonicsAndStore);
      this.setState({mnemonicsAndStore});
    } catch (e) {
      console.log(e);
    }
  };

  storeMnemonic = async () => {
    try {
      const storedMnemonic = await NativeWallet.storeMnemonic(
        'order cabin immune pond brave guilt boil index car aware snap list',
      );
      console.log('storeMnemonic: ', storedMnemonic);
      this.setState({storedMnemonic: 'true'});
    } catch (e) {
      throw 'Sign message failed with error: ' + e;
    }
  };

  retrieveMnemonic = async () => {
    try {
      const keychainMnemonics = await NativeWallet.retrieveMnemonic();
      console.log('keychainMnemonics: ', keychainMnemonics);
      this.setState({keychainMnemonics});
    } catch (e) {
      console.log(e);
    }
  };

  getOwnerBalance = async () => {
    try {
      const manager = await WalletManager.getInstance();
      const address = await manager.getOwnerAccount();
      const balance = await manager.getBalance(address);
      this.setState({ownerAccount: address, ownerBalance: balance});
    } catch (e) {
      console.log(e);
    }
  };

  getBalance = async () => {
    try {
      const manager = await WalletManager.getInstance();
      const address = manager.getAddress();
      const balance = await manager.getBalance(manager.address);
      this.setState({address, balance});
    } catch (e) {
      throw 'Send transaction failed with error: ' + e;
    }
  };

  sendTransaction = async () => {
    try {
      const manager = await WalletManager.getInstance();
      const {response, hash} = await manager.sendTransaction(
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
      const manager = await WalletManager.getInstance();
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
      const manager = await WalletManager.getInstance();
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

  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={{marginVertical: 10}}>
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

          <Text style={{marginVertical: 10}}>
            --------------- JavaScript -----------------
          </Text>

          <Text style={{marginBottom: 10}}>
            Network: {this.state.networkURL}
          </Text>

          <Text>Address: {this.state.ownerAccount}</Text>
          <Text>Balance: {this.state.ownerBalance}</Text>
          <TouchableOpacity
            onPress={this.getOwnerBalance}
            style={styles.button}>
            <Text>Get Owner Address</Text>
          </TouchableOpacity>

          <Text>Address: {this.state.address}</Text>
          <Text>Balance: {this.state.balance}</Text>
          <TouchableOpacity onPress={this.getBalance} style={styles.button}>
            <Text>Get Balance</Text>
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

const MessageContract = [
  {
    constant: false,
    inputs: [
      {
        name: 'newMessage',
        type: 'string',
      },
    ],
    name: 'setMessage',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getMessage',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];
