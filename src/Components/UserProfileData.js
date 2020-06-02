import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {layout, colors, text, sizeL, sizeXXL} from '../Theme';
import {observer, inject} from 'mobx-react';
import ImageField from '../Components/FormFields/ImageField';
import CountBox from '../Components/CountBox';
import Loader from '../Components/Loader';
import EditProfileForm from '../Components/Forms/EditProfileForm';
import FirebaseService from '../Services/FirebaseService';
import ProposalsList from '../Screens/Proposals/ProposalsList';

import {CommonActions} from '@react-navigation/native';

import Icon from '../Assets/iconfont/Icon';
import Swiper from 'react-native-swiper';

const UserProfileData = ({
  userId,
  navigation,
  userStore,
  editProfileFormStore,
}) => {
  const [user, setUser] = useState(null);
  const [proposalsCount, setProposalsCount] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        if (userId === userStore.userInfo?.id) {
          setUser(userStore.userInfo);
          setIsEditMode(true);
        } else {
          setUser(await FirebaseService.getInstance().getUserById(userId));
          setIsEditMode(false);
        }
      } catch (error) {
        console.log('error: ', error);
      }
    };

    setUser(null);
    setIsEditMode(false);
    getUser();
  }, [userId, userStore.userInfo]);

  const navigateToEditProfile = isFirstOpening => {
    const navigate = CommonActions.navigate({
      name: 'EditProfile',
      params: {
        isFirstOpening: isFirstOpening,
      },
    });
    navigation.dispatch(navigate);
  };

  const renderUserProfilePicture = () => {
    if (isEditMode) {
      return (
        <ImageField
          isAvatar={true}
          value={user?.photoURL}
          placeholderUrl={user?.photoURL}
          disableEdit={true}
          validation={{
            name: EditProfileForm.FIELD_PROFILE_IMAGE,
            formStore: editProfileFormStore,
            validateRule: 'string',
          }}
        />
      );
    } else {
      return (
        <View style={styles.imageFieldContainer}>
          <Image
            style={styles.imageFieldStyle}
            resizeMode="cover"
            source={{uri: user.photoURL}}
          />
          <View style={styles.imageFielFollowIcon}>
            <Icon name="follow" size={16} color={colors.white} />
          </View>
        </View>
      );
    }
  };

  if (!user) {
    return <Loader />;
  }

  const onProposalsCountChange = newCount => {
    setProposalsCount(newCount);
  };

  return (
    <>
      {isEditMode ? (
        <View style={styles.screenNav}>
          <TouchableOpacity onPress={() => navigateToEditProfile(false)}>
            <Icon name="edit" size={26} />
          </TouchableOpacity>
        </View>
      ) : null}
      {renderUserProfilePicture()}
      <Text style={{...text.h1Black, ...{paddingTop: 0, paddingBottom: 2}}}>
        {user.displayName}
      </Text>
      <Text style={text.ashleyjquimbacom2}>{user.email}</Text>

      <View style={styles.countBoxContainer}>
        <CountBox
          count={0}
          name="Commons"
          onPress={() => {
            console.log('Commons CardBox clicked');
          }}
        />
        <View style={styles.countBoxDivider} />
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
          {user.intro}
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

      <View style={styles.contentContainerWithoutPadding}>
        <Text
          style={{
            ...text.h3Black,
            ...layout.marginBottomL,
          }}>{`Proposals (${proposalsCount})`}</Text>

        <ProposalsList
          navigation={navigation}
          userId={userId}
          isSwiper={true}
          onCountChange={onProposalsCountChange}
        />

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

        <Swiper
          style={styles.wrapper}
          loop={false}
          nestedScrollEnabled={true}
          showsButtons={false}>
          <View style={styles.swiperContentWrapper}>
            <View style={styles.swiperContent}></View>
          </View>

          <View style={styles.swiperContentWrapper}>
            <View style={styles.swiperContent} />
          </View>
        </Swiper>
      </View>
    </>
  );
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
    paddingTop: 40,
  },

  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
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
    shadowColor: colors.white,
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
  imageFieldContainer: {
    position: 'relative',
    alignSelf: 'center',
    width: 100,
    height: 100,
  },
  imageFieldStyle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: 'rgba(0, 26, 54, 0.1)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 8,
    shadowOpacity: 1,
    alignSelf: 'center',
  },
  imageFielFollowIcon: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    padding: 2,
    backgroundColor: colors.mainBlue,
    borderWidth: 2,
    borderColor: colors.white,
  },
});

export default inject(
  'editProfileFormStore',
  'userStore',
)(observer(UserProfileData));
