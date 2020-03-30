import React from 'react';
import { NativeWallet } from '../Util/NativeWallet';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
const { height, width } = Dimensions.get('window');
import { ethers } from 'ethers';


export default class nativeBridgeTests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mnemonics: '',
      mnemonicsAndStore: '',
      storedMnemonic:
        'order cabin immune pond brave guilt boil index car aware snap list',
      keychainMnemonics: '',
      signedMessage: '',
      networkURL: 'Rinkeby',
      address: '',
      balance: '',
      txStatus: '',
      txHash: '',
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

  signMessage = async () => {
    try {
      const signedMessage = await NativeWallet.signMessage('Hello World');
      console.log('signedMessage: ', signedMessage);
      this.setState({signedMessage});
    } catch (e) {
      throw 'Sign message failed with error: ' + e;
    }
  };

  getAddress = async () => {
    try {
      const mnemonic = await NativeWallet.retrieveMnemonic();
      let wallet = ethers.Wallet.fromMnemonic(mnemonic);
      console.log('Address: ', wallet.address);
      this.setState({address: wallet.address});
    } catch (e) {
      console.log(e);
    }
  };

  getBalance = async () => {
    try {
      const mnemonic = await NativeWallet.retrieveMnemonic();
      let wallet = ethers.Wallet.fromMnemonic(mnemonic);
      let provider = new ethers.providers.InfuraProvider(
        'rinkeby',
        '3c08878d00734c0c98a3e4741d0b4cfc',
      );
      provider.getBalance(wallet.address).then(balance => {
        let etherString = ethers.utils.formatEther(balance);
        this.setState({balance: etherString});
      });
    } catch (e) {
      throw 'Send transaction failed with error: ' + e;
    }
  };

  sendTransaction = async () => {
    try {
      const mnemonic = await NativeWallet.retrieveMnemonic();
      let wallet = ethers.Wallet.fromMnemonic(mnemonic);
      let provider = new ethers.providers.InfuraProvider(
        'rinkeby',
        '3c08878d00734c0c98a3e4741d0b4cfc',
      );
      let rinkebyWallet = wallet.connect(provider);
      let tx = {
        to: '0x41B788babf69FC7F98336ff7A47F5A80c3A63d40',
        value: ethers.utils.parseEther('0.001'),
      };
      rinkebyWallet
        .sendTransaction(tx)
        .then(tx => {
          console.log(tx);
          this.setState({txHash: tx.hash, txStatus: 'pending'});
          return provider.waitForTransaction(tx.hash);
        })
        .then(receipt => {
          console.log(receipt);
          this.setState({
            txStatus: receipt.status === 0 ? 'Failed' : 'Confirmed',
          });
          return this.getBalance();
        })
        .catch(e => {
          console.log(e);
        });
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
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 200,
              height: 40,
              backgroundColor: 'grey',
            }}>
            <Text>Generate And Store Mnemonic</Text>
          </TouchableOpacity>

          <Text>local: {this.state.keychainMnemonics}</Text>
          <TouchableOpacity
            onPress={this.retrieveMnemonic}
            style={styles.button}>
            <Text>Retrieve Mnemonic From Local</Text>
          </TouchableOpacity>

          <Text>storeMnemonic: {this.state.storedMnemonic}</Text>
          <TouchableOpacity
            onPress={this.storeMnemonic}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 200,
              height: 40,
              backgroundColor: 'grey',
            }}>
            <Text>Store Mnemonic</Text>
          </TouchableOpacity>

          <Text>signedMessage: {this.state.signedMessage}</Text>
          <TouchableOpacity onPress={this.signMessage} style={styles.button}>
            <Text>Sign Message</Text>
          </TouchableOpacity>

          <Text style={{marginVertical: 10}}>
          --------------- JavaScript -----------------
          </Text>

          <Text style={{marginBottom: 10}}>
            Network: {this.state.networkURL}
          </Text>

          <Text>Address: {this.state.address}</Text>
          <TouchableOpacity onPress={this.getAddress} style={styles.button}>
            <Text>Get Address</Text>
          </TouchableOpacity>

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
