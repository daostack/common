import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';

import Swiper from 'react-native-swiper';

import React, {useEffect} from 'react';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {layout, colors, text, sizeL, sizeXXL} from '../Theme';
import {observer, inject} from 'mobx-react';
import ImageField from '../Components/FormFields/ImageField';
import CountBox from '../Components/CountBox';
import AccordionBtn from '../Components/AccordionBtn';
import {GoogleSignin} from '@react-native-community/google-signin';
import EditProfileForm from '../Components/Forms/EditProfileForm';
import CreateAccount from '../Screens/CreateAccount';

import Icon from '../Assets/iconfont/Icon';
import {CommonActions} from '@react-navigation/native';
import Toast, {useToast} from '../Util/Toast';

const UserProfile = ({editProfileFormStore, userStore, navigation, route}) => {
  useEffect(() => {
    if (route.params?.userUpdated) {
      Toast.done('Your profile is updated');
    }
  });

  _signOut = async () => {
    try {
      //await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      userStore.setSignedInUser(null);
    } catch (error) {
      setSignInError(error);
    }
  };

  const onUserSignedIn = isNewUser => {
    if (navigation) {
      navigateToEditProfile(true);
    }
  };

  const navigateToEditProfile = isFirstOpening => {
    const navigate = CommonActions.navigate({
      name: 'EditProfile',
      params: {
        isFirstOpening: isFirstOpening,
      },
    });
    navigation.dispatch(navigate);
  };

  const onMyWalletPress = event => {
    navigation.navigate('MyWallet');
  };

  const renderUserProfilePicture = () => {
    return (
      <ImageField
        value={userStore.userInfo?.profileImage}
        placeholderUrl={userStore.userInfo?.photo}
        validation={{
          name: EditProfileForm.FIELD_PROFILE_IMAGE,
          formStore: editProfileFormStore,
          validateRule: 'string',
        }}
      />
    );
  };

  const renderUnsignedUserData = () => {
    return <CreateAccount onSignedIn={onUserSignedIn}></CreateAccount>;
  };

  const renderSignedInUserData = () => {
    return (
      <>
        <View style={styles.screenNav}>
          <TouchableOpacity onPress={() => navigateToEditProfile(false)}>
            <Icon name="edit-" size={26} />
          </TouchableOpacity>
        </View>
        {renderUserProfilePicture()}
        <Text style={{...text.h1Black, ...{paddingTop: 0, paddingBottom: 2}}}>
          Lyubomir Petkov
        </Text>
        <Text style={text.ashleyjquimbacom2}>
          lyubomir.petkov@limechain.tech
        </Text>

        <View style={styles.countBoxContainer}>
          <CountBox
            count={0}
            name="Commons"
            onPress={() => {
              console.log('Commons CardBox clicked');
            }}
          />
          <View style={styles.countBoxDivider}></View>
          <CountBox
            count={0}
            name="Proposals"
            onPress={() => {
              console.log('Proposals CardBox clicked');
            }}
          />
        </View>

        <View style={styles.contentContainer}>
          <Text style={text.h3Black}>About</Text>
          <Text style={{...text.blackText, ...layout.marginTopM}}>
            I work on a DAO project at iteratec and am interested in DAOs, coops
            as well as crypto and blockchain in general.
          </Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={text.h3Black}>Commons (0)</Text>

          <View style={styles.emptyObjectContainer}>
            <Icon name="group" size={56} />
            <Text style={{...text.h3Black, ...layout.marginTopS}}>
              No Commons
            </Text>
            <Text
              style={{
                ...text.blackText,
                ...text.centered,
                ...layout.marginTopS,
              }}>
              Join your first common and start making an impact
            </Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity style={styles.btn}>
                <Text style={text.buttonblue}>Explore Commons</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={text.h3Black}>Proposals (0)</Text>

          <View style={styles.emptyObjectContainer}>
            <Icon name="pencil" size={46} />
            <Text style={{...text.h3Black, ...layout.marginTopS}}>
              No Proposals
            </Text>
            <Text
              style={{
                ...text.blackText,
                ...text.centered,
                ...layout.marginTopS,
              }}>
              Join a common and propose actions you think it should take to
              achieve its goal
            </Text>
          </View>
        </View>
      </>
    );
  };

  const renderScreen = () => {
    return (
      <>
        <StatusBar barStyle="dark-content" />

        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}
            vertical={true}
            nestedScrollEnabled={true}
            directionalLockEnabled={true}>
            <View style={styles.body}>
              {userStore.userInfo
                ? renderSignedInUserData()
                : renderUnsignedUserData()}

              <View style={layout.marginTopL}>
                {userStore.userInfo ? (
                  <AccordionBtn
                    title="My wallet"
                    subtitle="1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2"
                    onPress={onMyWalletPress}
                  />
                ) : null}
                <AccordionBtn title="FAQ" />
                <AccordionBtn title="Terms of use" />
                <AccordionBtn title="Privacy Policy" />
                <AccordionBtn title="Help" />
                <AccordionBtn title="Contact us" />
                {userStore.userInfo ? (
                  <AccordionBtn
                    lightStyle={true}
                    title="Logout"
                    onPress={_signOut}
                  />
                ) : null}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  };

  const renderScreenLoader = () => {
    return (
      <View style={{...layout.content, ...{flex: 1}, ...colors.white}}>
        <Text style={text.h1Black}>Loading ...</Text>
      </View>
    );
  };
  return userStore.isLoading ? renderScreenLoader() : renderScreen();
};

const styles = StyleSheet.create({
  btn: {
    ...layout.btnOutline,
    flexDirection: 'row',
    marginTop: 20,
    borderRadius: 5,
    backgroundColor: colors.white,
    flexGrow: 0,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  screenNav: {
    paddingBottom: sizeL,
    paddingHorizontal: sizeL,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
  },

  contentContainer: {
    ...layout.content,
    ...layout.flexStart,
    ...layout.marginTopL,
  },

  countBoxContainer: {
    ...layout.flexRow,
    ...layout.marginTopL,
    justifyContent: 'space-around',
    paddingVertical: sizeL,
    alignSelf: 'stretch',
  },
  countBoxDivider: {
    height: '100%',
    width: 1,
    backgroundColor: '#eeeeee',
  },
  emptyObjectContainer: {
    ...layout.content,
    ...layout.marginTopM,
    borderRadius: 14,
    paddingHorizontal: sizeXXL,
    backgroundColor: colors.lightBlue,
  },
  body: {
    paddingTop: 40,
  },

  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
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
  wrapper: {
    flexGrow: 0,
  },
});

export default inject(
  'editProfileFormStore',
  'userStore',
)(observer(UserProfile));
