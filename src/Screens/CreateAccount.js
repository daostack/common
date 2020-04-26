import React, {useRef} from 'react';

import {StyleSheet, View, Image} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import GSignInButton from '../Components/GSignInButton';
import FirebaseService from '../Services/FirebaseService';
import {layout} from '../Theme';
import WalletManager from '../Util/WalletManager';
import {observer, inject} from 'mobx-react';

const CreateAccount = ({userStore, navigation, onSignedIn}) => {
  bottomSheetContainerRef = useRef();

  openSheet = () => {
    bottomSheetContainerRef.current.snapTo(1);
  };

  onSignIn = async userInfo => {
    console.log('ON SIGN IN -> ', userInfo);
    await WalletManager.init(userInfo.user.uid);
    if (userInfo.additionalUserInfo.isNewUser) {
      const manager = await WalletManager.getInstance(userInfo.user.uid);
      const userPublicData = {
        ethereumAddress: await manager.getOwnerAccount(),
        // store the google user info in the firestore DB
        ...{
          displayName: userInfo.user.displayName,
          email: userInfo.user.email,
          photoURL: userInfo.user.photoURL,
        },
      };

      await FirebaseService.getInstance().addUser(
        userInfo.user.uid,
        userPublicData,
      );

      const allUserInfo = {
        ...userInfo.user._user,
        ...userPublicData,
      };
      userStore.setSignedInUser(allUserInfo);
    }
    if (onSignedIn) {
      onSignedIn(userInfo.additionalUserInfo.isNewUser);
    }
  };

  return (
    <View style={styles.componentContainer}>
      <View style={styles.sectionContainer}>
        <Image source={require('../Assets/accountPlaceHolder.png')} />
      </View>

      <GSignInButton style={styles.googleSignInButton} onSignIn={onSignIn} />
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
});

export default inject('userStore')(observer(CreateAccount));
