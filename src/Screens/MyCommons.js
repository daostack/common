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

const MyCommons = () => {
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
            <Text style={text.h1Black}>My proposals</Text>
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

export default MyCommons;
