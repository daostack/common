import React, {useRef} from 'react';

import {StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import GSignInButton from '../../Components/GSignInButton';
import {layout, text} from '../../Theme';
import {observer, inject} from 'mobx-react';

const CreateAccount = ({onSignedIn, hidePlaceholder}) => {
  const bottomSheetContainerRef = useRef();

  const openSheet = () => {
    bottomSheetContainerRef.current.snapTo(1);
  };

  const onSignIn = async userInfo => {
    if (onSignedIn) {
      onSignedIn(userInfo.additionalUserInfo.isNewUser);
    }
  };

  return (
    <View>
      { !hidePlaceholder && <View style={styles.sectionContainer}>
        <Image source={require('../../Assets/Account/account-place-holder.png')} />
      </View> }

      <GSignInButton style={styles.googleSignInButton} onSignIn={onSignIn} />

      <View style={styles.termsOfUseContainer}>
        <Text style={styles.termsOfUseText}>
          By using Common you agree to the app’s
        </Text>
        <TouchableOpacity>
          <Text style={styles.termsOfUseTextBtn}>
            terms of use
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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

  sectionContainer: {
    ...layout.content,
  },
  googleSignInButton: {
    alignSelf: 'stretch',
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
  termsOfUseContainer: {
    ...layout.content,
    paddingHorizontal: 40,
  },
  termsOfUseText: {
    ...text.smallGreyText,
    ...text.greyText,
    textAlign: 'center',
  },
  termsOfUseTextBtn: {
    ...text.smallBlackText,
  }
});

export default inject('userStore')(observer(CreateAccount));
