import React, {useState, useEffect} from 'react';
import {observer} from 'mobx-react';
import {shape, InferProps, string, func} from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from 'react-native';
import {useStore} from '~/Util/hooks/useStore';
import Icon from '~/Assets/iconfont/Icon';
import {text, font, colors} from '~/Theme';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import CountDown from 'react-native-countdown-component';
import AuthService from '~/Services/AuthService';
import Loader from '~/Components/Loader';
import Toast from '~/Util/Toast';
import {CELL_COUNT} from './constants';

const props = {
  navigation: shape({
    goBack: func,
    navigate: func,
  }),
  route: shape({
    params: shape({
      onSignIn: func.isRequired,
      phoneNumber: string.isRequired,
      confirm: func.isRequired,
    }).isRequired,
  }).isRequired,
};

const VerificationStep2: React.FC<InferProps<typeof props>> = ({
  navigation,
  route: {
    params: {onSignIn, phoneNumber, confirm},
  },
}) => {
  const authStore = useStore('authStore');
  const [userInfo, setUserInfo] = useState(null);
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [codeProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [buttonText, setButtonText] = useState('timer');
  const [buttonColor, setButtonColor] = useState(colors.mainBlue);
  const [textColor, setTextColor] = useState(colors.white);

  useEffect(() => {
    if (value.length === CELL_COUNT) {
      setButtonText('Submit');
    }
  }, [value]);

  useEffect(() => {
    if (userInfo) {
      onSignIn(userInfo, false, true);
    }
  }, [userInfo]);

  const resendCode = async () => {
    setButtonText('timer');
    confirm = await AuthService.signInPhone(phoneNumber);
  };

  useEffect(() => {
    switch (buttonText) {
      case 'timer':
        setButtonColor(colors.grey4);
        setTextColor(colors.grey2);
        break;
      case 'Resend Code':
        setButtonColor(colors.white);
        setTextColor(colors.greySteel);
        break;
      default:
        setButtonColor(colors.mainBlue);
        setTextColor(colors.white);
        break;
    }
  }, [buttonText]);

  const finishCountdown = () => {
    if (value.length !== CELL_COUNT) {
      setButtonText('Resend Code');
    } else {
      setButtonText('Submit');
      verifyCode();
    }
  };

  const submit = () => {
    if (buttonText === 'Resend Code') {
      resendCode();
    } else {
      verifyCode();
    }
  };

  const verifyCode = async () => {
    authStore.setIsLoading(true);
    try {
      const userInfoResp = await confirm.confirm(value);
      // TODO: here I can get credentials
      setUserInfo(userInfoResp);
    } catch (error) {
      authStore.setIsLoading(false);
      Toast.error('Invalid code');
      setButtonText('Resend Code');
      setValue('');
    }
  };

  const getText = () => {
    if (buttonText === 'timer') {
      return (
        <CountDown
          timeToShow={['M', 'S']}
          digitTxtStyle={styles.timerText}
          timeLabels={false}
          showSeparator={true}
          separatorStyle={styles.timerText}
          digitStyle={{
            height: 'auto',
            width: 'auto',
          }}
          until={120}
          onFinish={() => finishCountdown()}
        />
      );
    } else {
      return buttonText;
    }
  };

  return authStore.isLoading ? (
    <Loader isFullScreen phoneLogin />
  ) : (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Text style={styles.titleStyle}>Enter verification code</Text>
          <Text style={styles.subtitle}>
            We have sent the code to the following number
          </Text>
          <View style={styles.editContainer}>
            <Text style={styles.phoneNumber}>{phoneNumber}</Text>
            <TouchableOpacity
              style={styles.editText}
              onPress={() => navigation.goBack()}>
              <Icon
                style={{marginTop: 2}}
                size={10}
                name="edit"
                color={colors.white}
              />
            </TouchableOpacity>
          </View>

          <CodeField
            ref={ref}
            {...codeProps}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />

          <TouchableOpacity
            style={{
              ...styles.continueButton,
              backgroundColor: buttonColor,
            }}
            onPress={() => submit()}>
            <Text style={{...styles.continueButtonText, color: textColor}}>
              {getText()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  titleStyle: {
    alignSelf: 'center',
    ...font.fontSize(4),
    ...font.primary.bold,
  },
  subtitle: {
    alignSelf: 'center',
    ...font.fontSize(3),
    ...font.primary.regular,
    width: '60%',
    color: colors.gray1,
    textAlign: 'center',
  },
  phoneNumber: {
    alignSelf: 'center',
    ...font.fontSize(3),
    ...font.primary.bold,
  },
  phoneNumberView: {
    alignSelf: 'center',
    borderRadius: 100,
    height: '20%',
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
    height: '15%',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.grey4,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
  },
  continueButtonText: {
    ...font.primary.regular,
    ...font.fontSize(3),
    textAlign: 'center',
  },
  editText: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    width: 20,
    backgroundColor: colors.mainBlue,
    borderRadius: 100,
  },
  codeFieldRoot: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: 40,
    justifyContent: 'space-around',
    height: '20%',
  },
  cell: {
    borderWidth: 2,
    flex: 0.15,
    height: '100%',
    borderRadius: 10,
    borderColor: colors.grey4,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 1,
    shadowRadius: 5,
    fontSize: 60,
    textAlign: 'center',
    fontWeight: '300',
  },
  focusCell: {
    borderColor: '#000',
  },
  timerText: {
    ...text.smallBlackText,
    color: colors.grey2,
    ...font.fontSize(4),
    textAlign: 'center',
  },
  editContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '50%',
    justifyContent: 'space-around',
  },
});

VerificationStep2.propTypes = props;

export default observer(VerificationStep2);
