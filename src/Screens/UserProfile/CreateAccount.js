import React from 'react';

import {StyleSheet, View, Image, Platform} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import GSignInButton from '../../Components/Auth/GSignInButton';
import {layout} from '../../Theme';
import {observer, inject} from 'mobx-react';
import AppleSignInButton from '../../Components/Auth/AppleSignInButton';
import AuthService from '../../Services/AuthService';

const CreateAccount = ({onSignedIn}) => {
  const onSignIn = async userInfo => {
    if (onSignedIn) {
      onSignedIn(userInfo.additionalUserInfo.isNewUser);
    }
  };

  console.log("Platform.Version -> ", Platform.Version);

  const isIos = Platform.OS === 'ios';
  const isLoginWithAppleEnabled = isIos ? AuthService.getInstance().isAppleLoginSupported() : false;
  

  return (
    <View style={styles.componentContainer}>
      <View style={styles.sectionContainer}>
        <Image source={require('../../Assets/accountPlaceHolder.png')} />
      </View>

      { isIos && isLoginWithAppleEnabled ? <AppleSignInButton customStyle={layout.marginBottomM} onSignIn={onSignIn}/> : null }

      <GSignInButton onSignIn={onSignIn} />
      
    </View>
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

  sectionContainer: {
    ...layout.content,
  },
  buttonsArea: {
    alignSelf: 'stretch',
    marginTop: 60,
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

export default inject('userStore')(observer(CreateAccount));
