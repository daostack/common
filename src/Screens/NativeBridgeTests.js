import React from 'react';
import {NativeWallet} from '../Util/NativeWallet';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
const {height, width} = Dimensions.get('window');

export default class nativeBridgeTests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mnemonics: '',
      mnemonicsAndStore: '',
      storedMnemonic: 'order cabin immune pond brave guilt boil index car aware snap list',
      keychainMnemonics: '',
      signedMessage: '',
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
      const storedMnemonic = await NativeWallet.storeMnemonic('order cabin immune pond brave guilt boil index car aware snap list');
      console.log('storeMnemonic: ', storedMnemonic);
      this.setState({storedMnemonic : 'true'});
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

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ScrollView
          contentContainerStyle={{
            width,
            marginTop: 50,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 100,
          }}>
          <Text>mnemonic: {this.state.mnemonic}</Text>
          <TouchableOpacity
            onPress={this.generateMnemonic}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 200,
              height: 40,
              backgroundColor: 'grey',
            }}>
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
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 200,
              height: 40,
              backgroundColor: 'grey',
            }}>
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
          <TouchableOpacity
            onPress={this.signMessage}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 200,
              height: 40,
              backgroundColor: 'grey',
            }}>
            <Text>Sign Message</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9d48ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
