import React from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';

import { layout, text, sizeS, font, sizeM } from '~/Theme';

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
            <Text style={styles.title}>What’s a wallet?</Text>
          </View>

          <View style={layout.content}>
            <Image
              style={styles.wallet}
              source={require('~/Assets/wallet.png')}
            />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.subtitle}>
              Your wallet is your ID on the blockchain
            </Text>
            <Text style={styles.text}>
              Any vote or action you do on the app will be logged securely on
              the blockchain. This promises that the common activity is truely
              decentrallized and safe from hacking.
            </Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.subtitle}>
              It also functions as a regular wallet
            </Text>
            <Text style={styles.text}>
              All the money transfered through the common app will appear here.
              You can then transfer them to any bank account.
            </Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.subtitle}>What do I do with this?</Text>
            <Text style={styles.text}>
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
  },
  subtitle: {
    ...text.h2Black,
    textAlign: 'left',
  },
  wallet: {
    resizeMode: 'contain',
    height: 200,
  },
  title: {
    ...font.fontSize(5),
    ...font.heading.bold,
    textAlign: 'center',
  },
  text: {
    ...text.regularText,
    ...layout.marginTopS,
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
    paddingHorizontal: sizeM,
    paddingVertical: sizeS,
  },
});

export default MyWallet;
