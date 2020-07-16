import {useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, text, layout} from '../../Theme';
import React from 'react';
import Icon from '../../Assets/iconfont/Icon';
import { observer, inject } from 'mobx-react';
import { AppleAuthError } from '@invertase/react-native-apple-authentication';
import AuthService from '../../Services/AuthService';

const AppleSignInButton = ({ onSignIn, userStore, customStyle}) => {
  const [signInError, setSignInError] = useState(null);

  const _signIn = async () => {
    try {
      // That loading status will be changed to false in the onAuthStateChanged method in App.js
      //userStore.setIsLoading(true);
      console.log("sign In");
      const userInfo = await AuthService.getInstance().signInApple();
      console.log("userInfo -> ", userInfo);

      //userInfo.user.uid
      //userInfo.user.email

      //if (onSignIn) {
      //  onSignIn(userInfo);
      //}
      //setSignInError(null);
    } catch (error) {
      userStore.setIsLoading(false);
      console.log(error);
      switch (error.code) {
      case AppleAuthError.CANCELED:
        setSignInError('Canceled');
        break;
      case AppleAuthError.FAILED:
        setSignInError('Failed');
        break;
      case AppleAuthError.INVALID_RESPONSE:
        setSignInError('Invalid response');
        break;
      case AppleAuthError.NOT_HANDLED:
        setSignInError('Not handled');
        break;
      case AppleAuthError.UNKNOWN:
        setSignInError('Unknown error');
        break;
      default:
        setSignInError(error);
      }
    }
  };

  const renderSignInButton = () => {
    return (
      <>
        <TouchableOpacity style={{...layout.btnOutline, ...customStyle}} onPress={_signIn}>
          <Icon style={{...layout.btnLeftIcon, ...{marginLeft: 5}}} name="apple-logo" size={22} />
          <Text style={text.buttonblack}>Continue with Apple</Text>
        </TouchableOpacity>
      </>
    );
  };

  // <>
  //       <AppleButton
  //         buttonStyle={AppleButton.Style.WHITE}
  //         buttonType={AppleButton.Type.SIGN_IN}
  //         style={{
  //           width: 160,
  //           height: 45,
  //         }}
  //         onPress={_signIn}
  //       />
  //     </>

  const renderError = () => {
    if (signInError) {
      const errorText = `${signInError.toString()} ${
        signInError.code ? signInError.code : ''
      }`;
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.errorMessage}>{errorText}</Text>
          <View style={layout.messageErrorTriangle} />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {renderError()}
      {renderSignInButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    paddingHorizontal: 24,
  },
  messageContainer: {
    ...layout.messageError,
    ...layout.marginBottomM,
  },
  errorMessage: {
    color: colors.error,
  },
});

export default inject('userStore')(observer(AppleSignInButton));
