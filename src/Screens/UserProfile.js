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
import {
  layout,
  colors,
  text,
  sizeS,
  sizeM,
  sizeL,
  sizeXL,
  sizeXXL,
} from '../Theme';
import {observer, inject} from 'mobx-react';
import Swiper from 'react-native-swiper';
import ImageField from '../Components/FormFields/ImageField';
import CountBox from '../Components/CountBox';
import AccordionBtn from '../Components/AccordionBtn';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import EditProfileForm from '../Components/Forms/EditProfileForm';
import FirebaseService from '../Services/FirebaseService';
import {GOOGLE_SIGNIN_PERMISSIONS} from '../Util';
import Icon from '../Assets/iconfont/Icon';
const firebaseService = new FirebaseService();

const UserProfile = ({editProfileFormStore}) => {
  const FIELD_PROFILE_IMAGE = 'profileImage';
  const [userId, setUserId] = useState(false);
  const [user, setUser] = useState(false);
  const [userInfo, setUserInfo] = useState(false);

  useEffect(() => {
    loadUser = async () => {
      console.log('LOAD USER');
      try {
        if (userId) {
          const appUser = firebaseService.getUserById(userId);
          setUser(appUser);
        } else {
          GoogleSignin.configure({
            scopes: [GOOGLE_SIGNIN_PERMISSIONS.APP_DATA_RW],
          });
          const userInfo = await GoogleSignin.signInSilently();
          setUserInfo(userInfo);
          setUserId(userInfo.user.id);
        }
      } catch (error) {
        console.log('ERRROR', error);
      }
    };

    console.log('USE EFFECT');

    loadUser();
  }, [userId]);

  renderUserProfilePicture = () => {
    let imageOptions = {};

    //console.log('user -> ', user);
    console.log('userInfo -> ', userInfo);
    /*
    const userProfileImageValue =
      editProfileFormStore.form.fields[EditProfileForm.FIELD_PROFILE_IMAGE]
        .value;

    if (userProfileImageValue) {
      imageOptions = {
        value: userProfileImageValue,
      };
    } else {
      imageOptions = {placeholderUrl: userInfo.image};
    }
*/
    imageOptions = {placeholderUrl: userInfo?.user?.photo};

    console.log('imageOptions -> ', imageOptions);

    return (
      <ImageField
        {...imageOptions}
        validation={{
          name: EditProfileForm.FIELD_PROFILE_IMAGE,
          formStore: editProfileFormStore,
          validateRule: 'string',
        }}
      />
    );
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
          directionalLockEnabled={true}>
          <View style={styles.body}>
            {renderUserProfilePicture()}
            <Text
              style={{...text.h1Black, ...{paddingTop: 0, paddingBottom: 2}}}>
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
                I work on a DAO project at iteratec and am interested in DAOs,
                coops as well as crypto and blockchain in general.
              </Text>
            </View>

            {/*
            <Swiper
                style={styles.wrapper}
                loop={false}
                // dot={<View style={{backgroundColor: 'rgba(255,255,255,.0)', width: 0, height: 0, borderRadius: 0, marginLeft: 0, marginRight: 0}} />}
                // activeDot={<View style={{backgroundColor: '#fff', width: 0, height: 0, borderRadius: 0, marginLeft: 0, marginRight: 0}} />}
              >
                <View style={styles.image3} />
                <View style={{...styles.image3, backgroundColor: '#3cc7e1'}} />
              </Swiper>
              */}

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

            <View style={layout.marginTopL}>
              <AccordionBtn
                title="My wallet"
                subtitle="1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2"
              />
              <AccordionBtn title="FAQ" />
              <AccordionBtn title="Terms of use" />
              <AccordionBtn title="Privacy Policy" />
              <AccordionBtn title="Help" />
              <AccordionBtn title="Contact us" />
              <AccordionBtn lightStyle={true} title="Logout" />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  // My Style
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
  // Hao's style
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  /*
  

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
  */
});

export default inject('editProfileFormStore')(observer(UserProfile));
