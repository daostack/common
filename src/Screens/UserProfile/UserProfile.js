import {useNavigation, useRoute} from '@react-navigation/native';
import {inject, observer} from 'mobx-react';
import {auth} from '~/Firebase';
import moment from 'moment';
import notifee from '@notifee/react-native';
import {object, shape, string} from 'prop-types';
import React, {useEffect, useState} from 'react';
import {
  //Alert,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CodePush from 'react-native-code-push';
// import Config from 'react-native-config';
import {getBuildNumber, getVersion} from 'react-native-device-info';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import AccordionBtn from '~/Components/AccordionBtn';
import {isProduction} from '~/Config';
//import AuthService from '~/Services/AuthService';
import {colors, font, layout, sizeL, text} from '~/Theme';
import {authStorePropTypes} from '~/Types/propTypes';
import {LINKS} from '~/Util/constants/links';
//import Toast from '~/Util/Toast';
//import logger from '../../Services/Logger';
import CreateAccount from './CreateAccount';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {db} from '~/Firebase';
import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import {ASYNC_STORAGE_KEYS} from '~/Util/constants/asyncStorage';
import {firebase} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Toast from '~/Util/Toast';
import UserService from '~/Services/UserService';
import {AUTH_PROVIDER} from '~/Util/constants/provider';
import Logger from '~/Services/Logger';

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

  /*const _logout = async () => {
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
  };*/

  async function getUserData(value, isSignedWithApple) {
    const userSnapshot = await db
      .collection(DB_COLLECTIONS.users)
      .where(isSignedWithApple ? 'email' : 'uid', '==', value)
      .get();

    if (userSnapshot.docs.length) {
      const user = userSnapshot.docs[0].data();
      return user;
    }

    return null;
  }

  useEffect(() => {
    (async () => {
      try {
        const credentials = await AsyncStorage.getItem(
          ASYNC_STORAGE_KEYS.credentials,
        );
        const parsedCredentials = JSON.parse(credentials);

        if (
          credentials &&
          parsedCredentials?.providerId !== AUTH_PROVIDER.apple
        ) {
          const {accessToken, idToken} = await UserService.getAccessToken();
          navigation.navigate({
            name: 'CommonWebview',
            params: {
              credentials: {
                ...parsedCredentials,
                secret: accessToken,
                token: idToken,
              },
            },
          });
        }
      } catch (err) {
        AsyncStorage.setItem(ASYNC_STORAGE_KEYS.credentials, '');
        Toast.error(
          'Your session has expired. Please log in again to use the app.',
        );
      }
    })();
  }, []);

  // useEffect(() => {
  //   if (route.params?.authInfo) {
  //     onUserSignedIn(route.params?.authInfo, false);
  //   }
  // }, [route.params]);

  const onUserSignedIn = async (authInfo, isSignedWithApple) => {
    try {
      const authCode = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.authCode);
      const user = await getUserData(
        isSignedWithApple ? authInfo.userInfo.email : authInfo.userInfo.uid,
        isSignedWithApple,
      );

      if (user || authCode || authInfo.credentials) {
        AsyncStorage.setItem(ASYNC_STORAGE_KEYS.authCode, '');
        AsyncStorage.setItem(
          ASYNC_STORAGE_KEYS.credentials,
          JSON.stringify(authInfo.credentials),
        );
        navigation.navigate({
          name: 'CommonWebview',
          params: {
            credentials: authInfo.credentials,
          },
        });
      }
    } catch (err) {
      Logger.log(err);
    }
  };

  return (
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
              </View>
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
