import {useEffect, useState} from 'react';
import FirebaseService from '../Services/FirebaseService';
import {
  Button,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View, TouchableOpacity,
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import React from 'react';
import {GoogleSignin} from '@react-native-community/google-signin';

import GSignInButton from '../Components/GSignInButton';

const CreateAccount = ({navigation}) => {
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
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View>
            <View>
              {renderIsSignedIn()}
              {renderGetCurrentUser()}
              {renderGetTokens()}
              <View style={styles.hr} />
              <GSignInButton navigation={navigation}/>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  hr: {
    borderWidth: 0.5,
    borderColor: Colors.black,
    margin: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginHorizontal: 24,
    backgroundColor: '#3cc7e1',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 15,
  },
});

export default CreateAccount;
