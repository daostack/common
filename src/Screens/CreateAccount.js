import {useEffect, useState} from 'react';
import FirebaseService from '../Services/FirebaseService';
import {
  Button,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  View,
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import AcordionBtn from '../Components/AcordionBtn';
import React from 'react';
import {GoogleSignin} from '@react-native-community/google-signin';

import GSignInButton from '../Components/GSignInButton';

const CreateAccount = () => {
  renderIsSignedIn = () => {
    return (
      <Button
        onPress={async () => {
          const isSignedIn = await GoogleSignin.isSignedIn();
          Alert.alert(String(isSignedIn));
        }}
        title="is user signed in?"
      />
    );
  };

  renderGetCurrentUser = () => {
    return (
      <Button
        onPress={async () => {
          const userInfo = await GoogleSignin.getCurrentUser();
          Alert.alert(
            'current user',
            userInfo ? JSON.stringify(userInfo.user) : 'null',
          );
        }}
        title="get current user"
      />
    );
  };

  renderGetTokens = () => {
    return (
      <Button
        onPress={async () => {
          const isSignedIn = await GoogleSignin.getTokens();
          Alert.alert('tokens', JSON.stringify(isSignedIn));
        }}
        title="get tokens"
      />
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Image source={require('../Assets/accountPlaceHolder.png')} />
            </View>

            <GSignInButton style={styles.googleSignInButton} />

            <View style={styles.buttonsArea}>
              <AcordionBtn name="FAQ" />
              <AcordionBtn name="Terms of use" />
              <AcordionBtn name="Privacy Policy" />
              <AcordionBtn name="Help" />
              <AcordionBtn name="Contact us" />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  body: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginTop: 22,
    marginBottom: 34,
  },
  googleSignInButton: {
    width: 327,
    height: 56,
    borderWidth: 1,
    borderRadius: 28,
    borderStyle: 'solid',
    borderColor: '#eeeeee',

    shadowOpacity: 0,
    shadowColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 0,
    elevation: 0,
  },
  buttonsArea: {
    alignSelf: 'stretch',
    marginTop: 60,
  },
});

export default CreateAccount;
