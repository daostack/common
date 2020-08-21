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
import React, {useEffect, useState} from 'react';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {layout, colors, text, sizeL, font} from '../../Theme';
import {observer, inject} from 'mobx-react';
import AccordionBtn from '../../Components/AccordionBtn';
import CreateAccount from './CreateAccount';
import VersionNumber from 'react-native-version-number';
import {CommonActions} from '@react-navigation/native';
import UserProfileData from '../../Components/UserProfileData';
import AuthService from '../../Services/AuthService';
import Toast from '../../Util/Toast';
import CodePush from 'react-native-code-push';
import Config from 'react-native-config';
import { isProduction } from '../../Config';

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';

const UserProfile = ({userStore, navigation, route}) => {
  //const [editMode, setEditMode] = useState(false);

  const [codePushVersion, setCodePushVersion] = useState('');
  useEffect(() => {
    const getStatus = async () => {
      const status = await CodePush.getUpdateMetadata();
      console.log('getStatus -->', status);
      setCodePushVersion(status.label.replace('v', ''));
    };
    getStatus();
  }, []);

  const _signOut = async () => {
    try {
      Alert.alert(
        'Oops',
        'Do you want to sign out?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'OK', onPress: async () => {
            // That loading status will be changed to false in the onAuthStateChanged method in App.js
            userStore.setIsLoading(true);
            await AuthService.getInstance().signOut();
          },
          },
        ],
      );

    } catch (error) {
      userStore.setIsLoading(false);
      Toast.error(error?.toString());
      console.log('SignOut Error -> ', error);
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
  };

  const onHUDTestPress = event => {
    navigation.navigate('HUDTest');
  };

  const renderUnsignedUserData = () => {
    return <CreateAccount onSignedIn={onUserSignedIn} />;
  };

  const renderSignedInUserData = () => {
    return (
      <UserProfileData
        navigation={navigation}
        userId={route.params?.userId || userStore.userInfo.uid}
      />
    );
  };

  const renderScreen = () => {
    return (
      <>
        <StatusBar barStyle="dark-content" />

        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            vertical={true}
            nestedScrollEnabled={true}
            directionalLockEnabled={true}>
            <View style={styles.body}>
              {userStore.userInfo
                ? renderSignedInUserData()
                : renderUnsignedUserData()}

              <View style={layout.marginTopL}>
                {/* <AccordionBtn onPress={() => Linking.openURL('https://common.io/faq')} title="FAQ" /> */}
                <AccordionBtn onPress={() => Linking.openURL('https://common.io/tos')} title="Terms of use" />
                <AccordionBtn onPress={() => Linking.openURL('https://common.io/privacy')} title="Privacy Policy" />
                <AccordionBtn onPress={() => Linking.openURL('https://common.io/help')} title="Help" />
                <AccordionBtn onPress={() => Linking.openURL('mailto:hi@common.io')} title="Contact us" />
                {userStore.userInfo ? (
                  <AccordionBtn
                    lightStyle={true}
                    title="Log out"
                    onPress={_signOut}
                  />
                ) : null}
              </View>
              {Config.ENV !== 'production' && <View
                style={{
                  ...layout.content,
                  paddingHorizontal: 0,
                  backgroundColor: colors.grey4,
                }}>
                <Text style={text.h4Black}>Temporary menu</Text>
                <AccordionBtn title="Test Page" onPress={onTestPagePress} />
                <AccordionBtn title="HUD test" onPress={onHUDTestPress} />
              </View>}
              <Text style={styles.version}>Common{isProduction ? '' : '-stg'} v{VersionNumber.appVersion} ({VersionNumber.buildVersion}{codePushVersion ? `-${codePushVersion}` : '' })</Text>
              <Text style={styles.version}> code push is active 22 </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  };

  const renderScreenLoader = () => {
    return (
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
  };
  return userStore.isLoading ? renderScreenLoader() : renderScreen();
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

export default inject('userStore')(observer(UserProfile));
