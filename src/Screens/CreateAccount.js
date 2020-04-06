import React, {useRef} from 'react';

import {Button, StyleSheet, View, Image} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import GSignInButton from '../Components/GSignInButton';
import FirebaseService from '../Services/FirebaseService';
import {filterObjectByKeys} from '../Util';
const firebaseService = new FirebaseService();
import {observer, inject} from 'mobx-react';

import {userInfoFields} from '../Stores/UserStore';
import EditProfileForm from '../Components/Forms/EditProfileForm';
import {layout} from '../Theme';

const dbUserInfoFields = [
  EditProfileForm.FIELD_NAME,
  EditProfileForm.FIELD_INTRO,
  EditProfileForm.FIELD_PROFILE_IMAGE,
  'byLine',
  'email',
  'ethereumAddress',
  'preferences',
];

const CreateAccount = ({navigation, onSignedIn, userStore}) => {
  bottomSheetContainerRef = useRef();

  openSheet = () => {
    bottomSheetContainerRef.current.snapTo(1);
  };

  onSignIn = async userInfo => {
    userStore.setIsLoading(true);
    const internalUser = await firebaseService.getUserById(userInfo.user.id);
    const isNewUser = !internalUser;
    if (isNewUser) {
      await firebaseService.addUser(
        userInfo.user.id,
        filterObjectByKeys(userInfo.user, dbUserInfoFields),
      );
    }
    const allUserInfo = {
      ...userInfo.user,
      ...internalUser,
    };

    const filteredUser = filterObjectByKeys(allUserInfo, userInfoFields);
    userStore.setSignedInUser(filteredUser);
    userStore.setIsLoading(false);

    if (onSignedIn) {
      onSignedIn(isNewUser);
    }
  };

  return (
    <View style={styles.componentContainer}>
      <View style={styles.sectionContainer}>
        <Image source={require('../Assets/accountPlaceHolder.png')} />
      </View>

      <GSignInButton style={styles.googleSignInButton} onSignIn={onSignIn} />

      {/*<BottomSheetContainer ref={bottomSheetContainerRef} />*/}
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
