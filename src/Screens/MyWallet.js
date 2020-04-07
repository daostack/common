import React from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';

import Icon from '../Assets/iconfont/Icon';

import {layout, text, sizeS} from '../Theme';

const MyWallet = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          vertical={true}
          nestedScrollEnabled={true}
          directionalLockEnabled={true}>
          <View style={styles.sectionContainer}>
            <Text style={text.h1Black}>What’s a wallet?</Text>
          </View>

          <View style={layout.content}>
            <Icon name="wallet1" size={130}></Icon>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={text.h3Black}>
              Your wallet is your ID on the blockchain
            </Text>
            <Text style={{...text.blackText, ...layout.marginTopM}}>
              Any vote or action you do on the app will be logged securely on
              the blockchain. This promises that the common activity is truely
              decentrallized and safe from hacking.
            </Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={text.h3Black}>
              It also functions as a regular wallet
            </Text>
            <Text style={{...text.blackText, ...layout.marginTopM}}>
              All the money transfered through the common app will appear here.
              You can then transfer them to any bank account.
            </Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={text.h3Black}>What do I do with this?</Text>
            <Text style={{...text.blackText, ...layout.marginTopM}}>
              if you get money you’ll find it here. Otherwise there’s not much
              to do with this wallet (just like any other wallet).
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  componentContainer: {
    marginBottom: 100,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },

  sectionContainer: {
    ...layout.content,
    marginVertical: sizeS,
    alignItems: 'flex-start',
  },
});

export default MyWallet;
