import React, {useRef} from 'react';

import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import BottomSheetContainer from '../Components/BottomSheetContainer';
import AccordionBtn from '../Components/AccordionBtn';

import GSignInButton from '../Components/GSignInButton';
import {CommonActions} from '@react-navigation/native';
import FirebaseService from '../Services/FirebaseService';
import {filterObjectByKeys} from '../Util';
const firebaseService = new FirebaseService();

import CompleteAccountForm from '../Components/Forms/CompleteAccountForm';
import {layout} from '../Theme';

const userInfoFields = [
  CompleteAccountForm.FIELD_NAME,
  CompleteAccountForm.FIELD_INTRO,
  CompleteAccountForm.FIELD_PROFILE_IMAGE,
  'byLine',
  'email',
  'ethereumAddress',
  'preferences',
];

const CreateAccount = ({navigation}) => {
  bottomSheetContainerRef = useRef();

  openSheet = () => {
    bottomSheetContainerRef.current.snapTo(1);
  };

  onSignIn = async userInfo => {
    const internalUser = await firebaseService.getUserById(userInfo.user.id);
    if (!internalUser) {
      await firebaseService.addUser(
        userInfo.user.id,
        filterObjectByKeys(userInfo.user, userInfoFields),
      );

      if (navigation) {
        const navigate = CommonActions.navigate({
          name: 'CompleteAccount',
          params: {
            userId: userInfo.user.id,
            email: userInfo.user.email,
            image: userInfo.user.photo,
            name: userInfo.user.name,
          },
        });
        navigation.dispatch(navigate);
      }
    } else {
      if (navigation) {
        navigation.navigate('Commons');
      }
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <Button
              style={layout.marginTopM}
              title="button"
              onPress={openSheet}
            />

            <View style={styles.sectionContainer}>
              <Image source={require('../Assets/accountPlaceHolder.png')} />
            </View>

            <GSignInButton
              navigation={navigation}
              style={styles.googleSignInButton}
              onSignIn={onSignIn}
            />

            <View style={styles.buttonsArea}>
              <AccordionBtn name="FAQ" />
              <AccordionBtn name="Terms of use" />
              <AccordionBtn name="Privacy Policy" />
              <AccordionBtn name="Help" />
              <AccordionBtn name="Contact us" />
            </View>

            <BottomSheetContainer ref={bottomSheetContainerRef} />
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

export default CreateAccount;
