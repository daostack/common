import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
} from 'react-native';

//import Swiper from 'react-native-swiper';

import React, {useEffect} from 'react';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {layout, colors, text, sizeL, sizeXXL} from '../Theme';
import {observer, inject} from 'mobx-react';
import AccordionBtn from '../Components/AccordionBtn';
import CreateAccount from '../Screens/CreateAccount';

import {CommonActions} from '@react-navigation/native';
import Toast from '../Util/Toast';
import UserProfileData from '../Components/UserProfileData';
import AuthService from '../Services/AuthService';

const UserProfile = ({editProfileFormStore, userStore, navigation, route}) => {
  //const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (route?.params?.userUpdated) {
      Toast.done('Your profile is updated');
    }
  });
  const _signOut = async () => {
    try {
      await AuthService.getInstance().signOut();
    } catch (error) {
      console.log('Error -> ', error);
    }
  };

  const onUserSignedIn = isNewUser => {
    if (navigation && isNewUser) {
      const navigate = CommonActions.navigate({
        name: 'EditProfile',
        params: {
          isFirstOpening: true,
        },
      });
      navigation.dispatch(navigate);
    }
  };

  const onTestPagePress = event => {
    navigation.navigate('NativeBridgeTests');
    if (userStore.userInfo) {
      console.log(
        'fetching some Eth for your address',
        userStore.userInfo.ethereumAddress,
      );
      fetch(
        `https://us-central1-common-daostack.cloudfunctions.net/api/send-test-eth/${userStore.userInfo.ethereumAddress}`,
      );
    }
  };

  const onMyWalletPress = event => {
    navigation.navigate('MyWallet');
    console.log('address: ', userStore.userInfo.ethereumAddress);
  };

  const onMyCommonsPress = event => {
    navigation.navigate('MyCommons');
  };

  const onMyProposalsPress = event => {
    navigation.navigate('MyProposals');
  };

  const renderUnsignedUserData = () => {
    return <CreateAccount onSignedIn={onUserSignedIn} />;
  };

  const renderSignedInUserData = () => {
    return (
      <UserProfileData navigation={navigation} userId={userStore.userInfo.id} />
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
                <AccordionBtn title="Test Page" onPress={onTestPagePress} />
                {userStore.userInfo ? (
                  <AccordionBtn
                    title="My wallet"
                    subtitle={userStore.userInfo.ethereumAddress}
                    onPress={onMyWalletPress}
                  />
                ) : null}
                <AccordionBtn title="FAQ" />
                <AccordionBtn title="Terms of use" />
                <AccordionBtn title="Privacy Policy" />
                <AccordionBtn title="Help" />
                <AccordionBtn title="Contact us" />
                <AccordionBtn
                  onPress={onMyProposalsPress}
                  title="My Proposals"
                />
                <AccordionBtn onPress={onMyCommonsPress} title="My Commons" />
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

  contentContainerWithoutPadding: {
    ...layout.content,
    ...layout.flexStart,
    ...layout.marginTopL,
    paddingHorizontal: 0,
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
    paddingVertical: 10,
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
    height: 240,
  },
  swiperContentWrapper: {
    paddingHorizontal: 20,
    flex: 1,
  },
  swiperContent: {
    backgroundColor: '#efefef',
    borderRadius: 14,
    flex: 1,
  },
});

export default inject(
  'editProfileFormStore',
  'userStore',
)(observer(UserProfile));
