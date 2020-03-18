import React from 'react';
import {NativeModules, NativeEventEmitter} from 'react-native';
import {ethers} from 'ethers';
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
      keychainMnemonics: '',
      signedMessage: '',
    };

    this.child = React.createRef();
  }

  generateMnemonic = async () => {
    try {
      const mnemonic = await NativeModules.WalletModule.generateMnemonic();
      console.log('mnemonic: ', mnemonic);
      this.setState({mnemonic});
    } catch (e) {
      console.log(e);
    }
  };

  retrieveMnemonic = async () => {
    try {
      const keychainMnemonics = await NativeModules.WalletModule.retrieveMnemonic();
      console.log('keychainMnemonics: ', keychainMnemonics);
      this.setState({keychainMnemonics});
    } catch (e) {
      console.log(e);
    }
  };

  signMessage = async () => {
    try {
      const signedMessage = await NativeModules.WalletModule.signMessage(
        ethers.utils.formatBytes32String('Hello World'),
      );
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
