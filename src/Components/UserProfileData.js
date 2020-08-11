import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {layout, font,colors, text, sizeL, sizeXXL} from '../Theme';
import {observer, inject} from 'mobx-react';
import ImageField from '../Components/FormFields/ImageField';
import CountBox from '../Components/CountBox';
import Loader from '../Components/Loader';
import EditProfileForm from '../Components/Forms/EditProfileForm';
import FirebaseService from '../Services/FirebaseService';
import ProposalsList from '../Screens/Proposals/ProposalsList';
import CommonsSwiper from '../Screens/Commons/CommonsSwiper';
import { UserAvatar } from '../Components';

import {CommonActions} from '@react-navigation/native';

import Icon from '../Assets/iconfont/Icon';

const UserProfileData = ({
  userId,
  navigation,
  userStore,
  editProfileFormStore,
}) => {
  const [user, setUser] = useState(null);
  const [proposalsCount, setProposalsCount] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);
  const [commonsCount, setCommonsCount] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        if (userId === userStore.userInfo?.uid) {
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
        <UserAvatar image={user.photoURL} iconName={'follow'}/>
      );
    }
  };

  if (!user) {
    return <Loader />;
  }

  const onProposalsCountChange = newCount => {
    setProposalsCount(newCount);
  };

  const onCommonsCountChange = newCount => {
    setCommonsCount(newCount);
  };

  /**
   * @param newCount {number} - the new count of the requests
   */
  const onRequestsCountChange = newCount => {
    setRequestsCount(newCount);
  };

  const showMaxData = user.uid === userStore.userInfo.uid ? 5 : null;

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
      <Text style={styles.name}>
        {user.displayName}
      </Text>
      <Text style={text.ashleyjquimbacom2}>{user.email}</Text>

      <View style={styles.countBoxContainer}>
        <CountBox
          count={commonsCount}
          name="Commons"
          onPress={() => {
            console.log('Commons CardBox clicked');
          }}
        />
        <View style={styles.countBoxDivider} />
        <CountBox
          count={proposalsCount}
          name="Proposals"
          onPress={() => {
            console.log('Proposals CardBox clicked');
          }}
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={text.h2Black}>Intro</Text>
        <Text style={styles.userIntro}>
          {user.intro}
        </Text>
      </View>

      <View style={styles.contentContainerWithoutPadding}>
        <View style={{justifyContent: 'space-between', flexDirection: 'row', width: '100%'}}>
          <Text
            style={{
              ...text.againstTextBlack,
              ...layout.marginBottomL,
              ...layout.paddingHorizontalL,
            }}>{`Commons (${commonsCount})`}</Text>
          {showMaxData && commonsCount > 0 && <TouchableOpacity onPress={() => navigation.navigate('MyCommons')} style={{ flexDirection: 'row', ...layout.paddingHorizontalL}}>
            <Text
              style={{
                ...text.h3Black,
                ...layout.marginBottomL,
              }}>{'View all'}</Text>
            <Icon name="right-arrow" size={20} />
          </TouchableOpacity>}
        </View>

        <CommonsSwiper
          navigation={navigation}
          safeAddress={user.safeAddress}
          onCountChange={onCommonsCountChange}
          showMax={showMaxData}
        />
      </View>

      <View style={styles.contentContainerWithoutPadding}>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}>
          <Text
            style={{
              ...text.againstTextBlack,
              ...layout.marginBottomL,
              ...layout.paddingHorizontalL,
            }}>{`Proposals (${proposalsCount})`}</Text>
          {showMaxData && proposalsCount > 0 && (
            <TouchableOpacity
              onPress={() => navigation.navigate('MyProposals', { onlyFundingRequests: true })}
              style={{ flexDirection: 'row', ...layout.paddingHorizontalL }}
            >
              <Text
                style={{
                  ...text.h3Black,
                  ...layout.marginBottomL,
                }}>{'View all'}</Text>
              <Icon name="right-arrow" size={20} />
            </TouchableOpacity>
          )}
        </View>

        <ProposalsList
          onlyFundingRequests
          navigation={navigation}
          safeAddress={user.safeAddress}
          showAll={true}
          isSwiper={true}
          showMax={showMaxData}
          onCountChange={onProposalsCountChange}
        />
      </View>

      <View style={styles.contentContainerWithoutPadding}>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}>
          <Text
            style={{
              ...text.againstTextBlack,
              ...layout.marginBottomL,
              ...layout.paddingHorizontalL,
            }}
          >
            Membership requests ({requestsCount})
          </Text>

          {showMaxData && (requestsCount > 0) && (
            <TouchableOpacity
              onPress={() => navigation.navigate('MyProposals', { onlyMembershipRequests: true })}
              style={{
                flexDirection: 'row',
                ...layout.paddingHorizontalL,
              }}
            >
              <Text
                style={{
                  ...text.h3Black,
                  ...layout.marginBottomL,
                }}
              >
                {'View all'}
              </Text>
              <Icon name="right-arrow" size={20} />
            </TouchableOpacity>
          )}
        </View>

        <ProposalsList
          membershipRequests
          navigation={navigation}
          safeAddress={user.safeAddress}
          showAll={true}
          isSwiper={true}
          showMax={showMaxData}
          onCountChange={onRequestsCountChange}
        />
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
  name: {
    ...font.heading.bold,
    ...font.fontSize(4),
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.black,
  },
  userIntro: {
    ...text.regularText,
    ...layout.marginTopM,
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
    paddingLeft: 0,
    paddingRight: 0,
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
    backgroundColor: '#efefef',
    borderRadius: 14,
    flex: 1,
  },
});

export default inject(
  'editProfileFormStore',
  'userStore',
)(observer(UserProfileData));
