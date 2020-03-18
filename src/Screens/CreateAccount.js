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
  View,
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import React from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

const CreateAccount = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    _configureGoogleSignIn = () => {
      GoogleSignin.configure();
    };

    _configureGoogleSignIn();

    _getCurrentUser = async () => {
      try {
        const userInfo = await GoogleSignin.signInSilently();
        setUserInfo(userInfo);
        setError(null);
      } catch (error) {
        const errorMessage =
          error.code === statusCodes.SIGN_IN_REQUIRED
            ? 'Please sign in'
            : error.message;
        setError(new Error(errorMessage));
      }
    };

    _getCurrentUser();
  }, [error]);

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo);
      setError(null);
    } catch (error) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          Alert.alert('cancelled');
          break;
        case statusCodes.IN_PROGRESS:
          Alert.alert('in progress');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          Alert.alert('play services not available or outdated');
          break;
        default:
          setError(error);
      }
    }
  };

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

  renderUserInfo = userInfo => {
    return (
      <View>
        <Text>Welcome {userInfo.user.name}</Text>
        <Text>Your user info: {JSON.stringify(userInfo.user)}</Text>

        <Button onPress={_signOut} title="Log out" />
        {renderError()}
      </View>
    );
  };

  renderSignInButton = () => {
    return (
      <View>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Standard}
          color={GoogleSigninButton.Color.Auto}
          onPress={_signIn}
        />
        {renderError()}
      </View>
    );
  };

  renderError = () => {
    if (!error) {
      return null;
    }
    const text = `${error.toString()} ${error.code ? error.code : ''}`;
    return <Text>{text}</Text>;
  };

  _signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();

      setUserInfo(null);
      setError(null);
    } catch (error) {
      setError(null);
    }
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
              {userInfo ? renderUserInfo(userInfo) : renderSignInButton()}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default CreateAccount;
