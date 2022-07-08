import {
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import {getVersion, getBuildNumber} from 'react-native-device-info';
import React, {useEffect, useState} from 'react';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {layout, colors, text, sizeL, font} from '~/Theme';
import {observer, inject} from 'mobx-react';
import AccordionBtn from '~/Components/AccordionBtn';
import CreateAccount from './CreateAccount';
import {CommonActions, useNavigation, useRoute} from '@react-navigation/native';
import UserProfileData from '~/Components/UserProfileData';
import AuthService from '~/Services/AuthService';
import Toast from '~/Util/Toast';
import CodePush from 'react-native-code-push';
import Config from 'react-native-config';
import {isProduction} from '~/Config';
import {string, object, shape} from 'prop-types';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import logger from '../../Services/Logger';
import {authStorePropTypes} from '~/Types/propTypes';
import {LINKS} from '~/Util/constants/links';
import {NAVIGATION_SCREENS} from '~/Navigation/routes.enum';
import {WebView} from 'react-native-webview';

const UserProfile = ({authStore}) => {
  const navigation = useNavigation();
  const route = useRoute();

  const [codePushVersion, setCodePushVersion] = useState('');
  useEffect(() => {
    const getStatus = async () => {
      CodePush.getUpdateMetadata().then((status) => {
        if (status) {
          setCodePushVersion(status.label.replace('v', ''));
        }
      });
    };
    getStatus();
  }, []);

  const _logout = async () => {
    try {
      Alert.alert('Oops', 'Do you want to sign out?', [
        {
          text: 'Cancel',
          onPress: () => logger.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            // That loading status will be changed to false in the onAuthStateChanged method in App.js
            authStore.setIsLoading(true);

            await AuthService.signOut();
          },
        },
      ]);
    } catch (error) {
      await AuthService.clearGoogleSignInCache();
      authStore.setIsLoading(false);
      Toast.error(error?.toString());
      logger.log('SignOut Error -> ', error);
    }
  };

  const onUserSignedIn = (
    authInfo,
    isSignedWithApple = false,
    isPhoneLogin = false,
  ) => {
    // call firestore to check if user exists
    navigation.navigate({
      name: 'CommonWebview',
      params: {
        credentials: authInfo.credentials,
      },
    });
    // if (navigation && !isNewUser && isPhoneLogin) {
    //   authStore.setIsLoading(false);
    //   navigation.pop(2);
    // }
  };

  const onHUDTestPress = (event) => {
    navigation.navigate('HUDTest');
  };

  const renderUnsignedUserData = () => (
    <CreateAccount
      onSignedIn={onUserSignedIn}
      width={Platform.OS === 'ios' ? '80%' : '60%'}
    />
  );

  const renderUserProfileData = (currUserId, userInfo) => (
    <UserProfileData
      navigation={navigation}
      userId={currUserId}
      currUserInfo={userInfo}
    />
  );

  const currUserId = route.params?.userId || authStore.userInfo?.uid;

  const renderScreen = () => (
    <>
      <StatusBar barStyle="dark-content" />

      <View style={styles.safeArea}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          vertical={true}
          nestedScrollEnabled={true}
          directionalLockEnabled={true}>
          <View style={styles.body}>
            <CreateAccount
              onSignedIn={onUserSignedIn}
              width={Platform.OS === 'ios' ? '80%' : '60%'}
            />
          </View>
          {!route.params?.userId ||
          route.params.userId === authStore.userInfo?.uid ? (
            <>
              <View style={layout.marginTopL}>
                {/* <AccordionBtn onPress={() => Linking.openURL('https://common.io/faq')} title="FAQ" /> */}

                {authStore.userInfo && (
                  <React.Fragment>
                    <AccordionBtn
                      title="Billing"
                      onPress={() => {
                        navigation.navigate(NAVIGATION_SCREENS.BILLING);
                      }}
                    />
                  </React.Fragment>
                )}

                <AccordionBtn
                  onPress={() => navigation.navigate('Onboarding')}
                  title="About Common"
                />
                <AccordionBtn
                  onPress={() => navigation.navigate('ReceiveFunds')}
                  title="Receive funds"
                />
                <AccordionBtn
                  onPress={() => Linking.openURL(LINKS.CONTACT_US)}
                  title="Contact us"
                />
                <AccordionBtn
                  onPress={() => Linking.openURL(LINKS.HELP)}
                  title="Help and support"
                />
                <AccordionBtn
                  onPress={() => Linking.openURL(LINKS.PRIVACY)}
                  title="Privacy Policy"
                />
                <AccordionBtn
                  onPress={() => Linking.openURL(LINKS.TERMS)}
                  title="Terms of use"
                />

                {authStore.userInfo && (
                  <AccordionBtn
                    lightStyle={true}
                    title="Log out"
                    onPress={_logout}
                  />
                )}
              </View>
              {Config.ENV !== 'production' && (
                <View
                  style={{
                    ...layout.content,
                    paddingHorizontal: 0,
                    backgroundColor: colors.grey4,
                  }}>
                  <Text style={text.h4Black}>Temporary menu</Text>
                  <AccordionBtn title="HUD test" onPress={onHUDTestPress} />
                </View>
              )}
              <Text style={styles.version}>
                Common{isProduction ? '' : '-stg'} v{getVersion()} (
                {getBuildNumber()}
                {codePushVersion ? `-${codePushVersion}` : ''})
              </Text>
            </>
          ) : null}
        </ScrollView>
      </View>
    </>
  );

  const renderScreenLoader = () => (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Placeholder Animation={Fade}>
        <PlaceholderMedia
          size={100}
          isRound={true}
          style={{alignSelf: 'center', marginTop: 80, marginBottom: 20}}
        />
        <PlaceholderLine width={30} style={{alignSelf: 'center'}} />
        <PlaceholderLine width={50} style={{alignSelf: 'center'}} />
        <PlaceholderMedia
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: 20,
            height: 100,
            width: '100%',
          }}
        />
        <PlaceholderLine width={30} />
        <PlaceholderLine width={50} />
        <PlaceholderLine width={80} />
        <PlaceholderMedia
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: 20,
            height: 150,
            width: '100%',
          }}
        />
        <PlaceholderLine width={50} />
        <PlaceholderLine width={80} />
        <PlaceholderMedia
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: 20,
            height: 150,
            width: '100%',
          }}
        />
      </Placeholder>
    </ScrollView>
  );
  // return authStore.isLoading ? renderScreenLoader() : renderScreen();
  return (
    <WebView source={{uri: 'https://common.io'}} style={{marginTop: 20}} />
  );
};

UserProfile.propTypes = {
  route: shape({
    params: shape({
      userId: string,
      userInfo: object,
    }),
  }),
  navigation: object,
  authStore: authStorePropTypes.isRequired,
};

const styles = StyleSheet.create({
  screenNav: {
    paddingBottom: sizeL,
    paddingHorizontal: sizeL,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
  },
  version: {
    ...font.primary.regular,
    ...font.fontSize(2),
    textAlign: 'center',
    paddingVertical: 10,
    color: colors.grey2,
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
    backgroundColor: colors.grey4,
  },
  body: {
    paddingVertical: 10,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
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
    elevation: 6,
  },
  wrapper: {
    height: 240,
  },
  swiperContentWrapper: {
    paddingHorizontal: 20,
    flex: 1,
  },
  swiperContent: {
    backgroundColor: colors.grey4,
    borderRadius: 14,
    flex: 1,
  },
});

export default inject('authStore')(observer(UserProfile));
