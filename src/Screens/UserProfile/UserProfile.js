import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Linking,
  Alert,
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

            await AuthService.getInstance().signOut();
          },
        },
      ]);
    } catch (error) {
      await AuthService.getInstance().clearGoogleSignInCache();
      authStore.setIsLoading(false);
      Toast.error(error?.toString());
      logger.log('SignOut Error -> ', error);
    }
  };

  const onUserSignedIn = (isNewUser, isSignedWithApple = false) => {
    if (navigation && isNewUser) {
      const navigate = CommonActions.navigate({
        name: 'EditProfile',
        params: {
          isCompleteAccount: true,
          isSignedWithApple,
        },
      });
      navigation.dispatch(navigate);
    }
  };

  const onHUDTestPress = (event) => {
    navigation.navigate('HUDTest');
  };

  const renderUnsignedUserData = () => (
    <CreateAccount onSignedIn={onUserSignedIn} />
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
    <React.Fragment>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          vertical={true}
          nestedScrollEnabled={true}
          directionalLockEnabled={true}>
          <View style={styles.body}>
            {currUserId
              ? renderUserProfileData(currUserId, route.params?.userInfo)
              : renderUnsignedUserData()}
          </View>
          {!route.params?.userId ||
          route.params.userId === authStore.userInfo?.uid ? (
            <>
              <View style={layout.marginTopL}>
                {/* <AccordionBtn onPress={() => Linking.openURL('https://common.io/faq')} title="FAQ" /> */}
                <AccordionBtn
                  onPress={() => navigation.navigate('Onboarding')}
                  title="About Common"
                />
                <AccordionBtn
                  onPress={() => Linking.openURL('mailto:hi@common.io')}
                  title="Contact us"
                />
                <AccordionBtn
                  onPress={() => Linking.openURL('https://common.io/help')}
                  title="Help and support"
                />
                <AccordionBtn
                  onPress={() => Linking.openURL('https://common.io/privacy')}
                  title="Privacy Policy"
                />
                <AccordionBtn
                  onPress={() => Linking.openURL('https://common.io/tos')}
                  title="Terms of use"
                />
                {authStore.userInfo && (
                  <React.Fragment>
                    <AccordionBtn
                      title="Monthly Contributions"
                      onPress={() => {
                        navigation.navigate('MonthlyContributionsList');
                      }}
                    />

                    <AccordionBtn
                      lightStyle={true}
                      title="Log out"
                      onPress={_logout}
                    />
                  </React.Fragment>
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
      </SafeAreaView>
    </React.Fragment>
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
  return authStore.isLoading ? renderScreenLoader() : renderScreen();
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
