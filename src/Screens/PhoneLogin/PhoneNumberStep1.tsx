import React, {useRef, useState} from 'react';
import {inject, observer} from 'mobx-react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import {shape, InferProps, func} from 'prop-types';
import {font, colors} from '~/Theme';
import PhoneInput from 'react-native-phone-number-input';
//import {useStore} from '~/Util/hooks/useStore';
import AuthService from '~/Services/AuthService';
import Loader from '~/Components/Loader';
import Toast from '~/Util/Toast';

const props = {
  navigation: shape({
    goBack: func,
    navigate: func,
    setOptions: func,
  }),
  route: shape({
    params: shape({
      onSignIn: func,
    }).isRequired,
  }).isRequired,
};

const PhoneNumberStep1: React.FC<InferProps<typeof props>> = ({
  navigation,
  route: {
    params: {onSignIn},
  },
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const phoneInput = useRef(null);
  const [showLoader, setShowLoader] = useState(false);

  const _signIn = async () => {
    Keyboard.dismiss();
    const isValid = phoneInput.current?.isValidNumber(phoneNumber);
    if (!isValid) {
      Toast.error('Invalid number');
    } else {
      setShowLoader(true);
      //authStore.setIsLoading(false);
      const confirm = await AuthService.signInPhone(phoneNumber);
      setShowLoader(false);
      navigation.navigate('VerifyPhone', {
        phoneNumber,
        confirm,
        onSignIn,
      });
    }
  };

  return (
    <View style={{backgroundColor: colors.white, flex: 1}}>
      {showLoader ? (
        <View style={{flex: 0.5, justifyContent: 'flex-end'}}>
          <Loader />
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <View style={styles.wrapper}>
              <Text style={styles.titleStyle}>Enter your phone number</Text>
              <PhoneInput
                ref={phoneInput}
                defaultValue={phoneNumber}
                defaultCode="IL"
                layout="second"
                withShadow
                autoFocus
                placeholder={'052-123-4567'}
                containerStyle={styles.phoneNumberView}
                textContainerStyle={styles.phoneInput}
                onChangeFormattedText={(phoneInputText) => {
                  setPhoneNumber(phoneInputText);
                }}
              />
              <TouchableOpacity
                style={{
                  ...styles.continueButton,
                  backgroundColor:
                    phoneNumber.length === 14 ? colors.mainBlue : colors.grey3,
                }}
                disabled={phoneNumber.length !== 14}
                onPress={() => _signIn()}>
                <Text style={styles.continueButtonText}>Send Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  wrapper: {
    justifyContent: 'space-around',
    marginTop: 50,
    ...Platform.select({
      ios: {
        flex: 0.5,
      },
      android: {
        height: 200,
      },
    }),
  },
  titleStyle: {
    alignSelf: 'center',
    ...font.fontSize(4),
    ...font.primary.bold,
  },
  phoneNumberView: {
    alignSelf: 'center',
    borderRadius: 100,
    height: Platform.OS === 'ios' ? '20%' : 60,
    width: '90%',
    borderWidth: 1,
    borderColor: colors.grey4,
  },
  phoneInput: {
    paddingVertical: 0,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    borderLeftWidth: 1,
    borderColor: colors.grey4,
    backgroundColor: colors.white,
  },
  continueButton: {
    height: Platform.OS === 'ios' ? '20%' : 60,
    borderRadius: 100,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
  },
  continueButtonText: {
    ...font.primary.regular,
    ...font.fontSize(3),
    color: 'white',
  },
});

PhoneNumberStep1.propTypes = props;

export default inject('rootStore')(observer(PhoneNumberStep1));
