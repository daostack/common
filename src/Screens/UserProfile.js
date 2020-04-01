import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {layout, text} from '../Theme';
import Swiper from 'react-native-swiper';
import ImageField from '../Components/FormFields/ImageField';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import FirebaseService from '../Services/FirebaseService';
const firebaseService = new FirebaseService();

const UserProfile = () => {
  const FIELD_PROFILE_IMAGE = 'profileImage';
  const [user, setUser] = useState(false);
  const [userInfo, setUserInfo] = useState(false);

  useEffect(() => {
    loadUser = async () => {
      console.log('LOAD USER');
      try {
        const userInfo = await GoogleSignin.signInSilently();
        const appUser = firebaseService.getUserById(userInfo.user.id);
        console.log('useEffect userInfo -> ', userInfo);
        console.log('useEffect appUser -> ', appUser);
        setUser(appUser);
        setUserInfo(appUserInfo);
      } catch (error) {
        console.log('ERRROR', error);
      }
    };

    console.log('USE EFFECT');

    loadUser();
  });

  renderUserProfilePicture = () => {
    let imageOptions = {};

    console.log('user -> ', user);
    console.log('userInfo -> ', userInfo);

    if (user.profilePicture) {
      imageOptions = {value: user.profileImage};
    } else {
      imageOptions = {placeholderUrl: userInfo.image};
    }

    console.log('imageOptions -> ', imageOptions);

    return <ImageField {...imageOptions} />;
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          vertical={true}
          nestedScrollEnabled={true}
          directionalLockEnabled={true}
          {...this.props}>
          <View style={styles.body}>
            {renderUserProfilePicture()}
            <Text style={styles.sectionTitle}>Yogarasa Gandhi</Text>
            <Text style={text.ashleyjquimbacom}>{user.email}</Text>

            <View style={styles.separateLine} />
            <Text style={styles.title}>DAOs</Text>
            <Swiper
              style={styles.wrapper}
              loop={false}
              // dot={<View style={{backgroundColor: 'rgba(255,255,255,.0)', width: 0, height: 0, borderRadius: 0, marginLeft: 0, marginRight: 0}} />}
              // activeDot={<View style={{backgroundColor: '#fff', width: 0, height: 0, borderRadius: 0, marginLeft: 0, marginRight: 0}} />}
            >
              <View style={styles.image3} />
              <View style={{...styles.image3, backgroundColor: '#3cc7e1'}} />
            </Swiper>
            <View style={{...styles.separateLine, marginTop: 25}} />

            <Text style={styles.title}>Proposals</Text>
            <Swiper
              style={styles.wrapper}
              loop={false}
              nestedScrollEnabled={true}
              showsButtons={false}>
              <View style={styles.image3} />
            </Swiper>
            <View
              style={{...styles.separateLine, marginTop: 25, marginBottom: 25}}
            />
            <TouchableOpacity style={{flex: 1}}>
              <View style={styles.linkButton}>
                <Text style={styles.linkText}>FAQ</Text>
                <Text style={{flex: 0.2, fontSize: 21}}>➤</Text>
              </View>
              <View style={styles.lightSeparateLine} />
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1}}>
              <View style={styles.linkButton}>
                <Text style={styles.linkText}>Terms of use</Text>
                <Text style={{flex: 0.2, fontSize: 21}}>➤</Text>
              </View>
              <View style={styles.lightSeparateLine} />
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1}}>
              <View style={styles.linkButton}>
                <Text style={styles.linkText}>Privacy Policy</Text>
                <Text style={{flex: 0.2, fontSize: 21}}>➤</Text>
              </View>
              <View style={styles.lightSeparateLine} />
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1}}>
              <View style={styles.linkButton}>
                <Text style={styles.linkText}>Help</Text>
                <Text style={{flex: 0.2, fontSize: 21}}>➤</Text>
              </View>
              <View style={styles.lightSeparateLine} />
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1}}>
              <View style={styles.linkButton}>
                <Text style={styles.linkText}>Contact us</Text>
                <Text style={{flex: 0.2, fontSize: 21}}>➤</Text>
              </View>
              <View style={styles.lightSeparateLine} />
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1, marginBottom: 30}}>
              <View style={styles.linkButton}>
                <Text style={{...styles.linkText, color: '#ff1700'}}>
                  Logout
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  body: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  sectionContainer: {
    marginTop: 13,
    marginBottom: 3,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    //   fontFamily: 'Roboto',
    fontWeight: '600',
    color: Colors.black,
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  avatarImage: {
    // width: '40%',
    // paddingTop: '100%',
    minHeight: 104,
    minWidth: 104,
    maxWidth: '40%',
    borderRadius: 52,
    backgroundColor: '#efefef',
  },
  socialContainer: {
    // paddingVertical: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialImage: {
    minHeight: 30,
    minWidth: 30,
    borderRadius: 15,
    // paddingHorizontal: 15,
    marginHorizontal: 12,
    backgroundColor: '#efefef',
  },
  descriptionText: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.black,
    paddingHorizontal: 38,
    marginBottom: 20,
  },
  separateLine: {
    marginTop: 15,
    height: 0.5,
    // paddingHorizontal:30,
    marginHorizontal: 30,
    backgroundColor: Colors.black,
  },
  lightSeparateLine: {
    height: 0.5,
    // paddingHorizontal:30,
    marginHorizontal: 0,
    backgroundColor: '#bfbfbf',
  },
  title: {
    marginTop: 24,
    marginLeft: 30,
    marginBottom: 24,
    fontSize: 24,
    //   fontFamily: 'Roboto',
    fontWeight: '600',
    color: Colors.black,
    textAlign: 'left',
  },
  wrapper: {
    // flex: 1,
    height: 200,
  },
  image: {
    backgroundColor: '#3cc7e1',
    // height: '100%',
    width: '80%',
    borderRadius: 14,
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  image2: {
    backgroundColor: '#001a36',
    // height: '100%',
    // width: '100%',
    borderRadius: 30,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image3: {
    backgroundColor: '#efefef',
    borderRadius: 14,
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginHorizontal: 30,
    // marginBottom: 30,
  },
  linkButton: {
    paddingVertical: 18,
    marginHorizontal: 15,
    flexDirection: 'row',
    width: '100%',
    // backgroundColor: "#3cc7e1",
  },
  linkText: {
    left: 15,
    fontSize: 16,
    //   fontFamily: 'Roboto',
    fontWeight: '700',
    justifyContent: 'center',
    color: Colors.black,
    textAlign: 'left',
    flex: 0.8,
  },
});

export default UserProfile;
