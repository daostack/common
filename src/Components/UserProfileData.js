import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {layout, font, colors, text, sizeL, sizeXXL} from '~/Theme';
import {observer, inject} from 'mobx-react';
import ImageField from '~/Components/FormFields/ImageField';
import CountBox from '~/Components/CountBox';
import UserService from '~/Services/UserService';
import ProposalsList from '~/Screens/Proposals/ProposalsList';
import CommonsSwiper from '~/Screens/Commons/CommonsSwiper';
import {UserAvatar} from '~/Components';
import {CommonActions} from '@react-navigation/native';
import Icon from '~/Assets/iconfont/Icon';
import logger from '~/Services/Logger';
import {string, object, shape, func} from 'prop-types';

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';

const UserProfileData = ({
  userId,
  currUserInfo,
  navigation,
  userStore: {userInfo},
  userListStore,
}) => {
  const providedUserId = userId || currUserInfo.uid;
  const isOwnProfile = providedUserId === userInfo?.uid;
  const user = isOwnProfile
    ? userInfo
    : userListStore.getUserById(providedUserId);

  navigation.setOptions({
    title: user.displayNameFormatted,
  });

  const [proposalsCount, setProposalsCount] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);
  const [commonsCount, setCommonsCount] = useState(0);

  const navigateToEditProfile = (isFirstOpening) => {
    const navigate = CommonActions.navigate({
      name: 'EditProfile',
      params: {
        isFirstOpening: isFirstOpening,
      },
    });
    navigation.dispatch(navigate);
  };

  const renderUserProfilePicture = () =>
    !isOwnProfile ? (
      <UserAvatar image={user.photoURL} iconName={'follow'} />
    ) : (
      <ImageField
        isAvatar={true}
        value={user?.photoURL}
        placeholderUrl={user?.photoURL}
        disableEdit={true}
      />
    );

  if (!user) {
    return (
      <Placeholder Animation={Fade}>
        <PlaceholderMedia
          size={100}
          isRound={true}
          style={{alignSelf: 'center', marginBottom: 10}}
        />
        <PlaceholderLine width={30} style={{alignSelf: 'center'}} />
        {isOwnProfile && (
          <PlaceholderLine width={50} style={{alignSelf: 'center'}} />
        )}
        <PlaceholderMedia
          style={{
            alignSelf: 'center',
            marginTop: 50,
            marginBottom: 50,
            height: 100,
            width: '100%',
          }}
        />
        <PlaceholderLine width={30} style={{marginBottom: 15}} />
        <PlaceholderLine width={50} style={{marginBottom: 15}} />
        <PlaceholderLine width={80} style={{marginBottom: 15}} />
        <PlaceholderLine width={60} style={{marginBottom: 15, marginTop: 50}} />
        <PlaceholderMedia
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: 50,
            height: 150,
            width: '100%',
          }}
        />
        <PlaceholderLine width={60} style={{marginBottom: 15, marginTop: 50}} />
        <PlaceholderMedia
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: 50,
            height: 150,
            width: '100%',
          }}
        />
      </Placeholder>
    );
  }

  const onProposalsCountChange = (newCount) => {
    setProposalsCount(newCount);
  };

  const onCommonsCountChange = (newCount) => {
    setCommonsCount(newCount);
  };

  /**
   * @param newCount {number} - the new count of the requests
   */
  const onRequestsCountChange = (newCount) => {
    setRequestsCount(newCount);
  };

  const showMaxData = user.uid === userInfo?.uid ? 5 : null;

  return (
    <React.Fragment>
      {isOwnProfile && (
        <View style={styles.screenNav}>
          <TouchableOpacity onPress={() => navigateToEditProfile(false)}>
            <Icon name="edit" size={26} />
          </TouchableOpacity>
        </View>
      )}
      {renderUserProfilePicture()}
      <Text style={styles.name}>{user.displayName}</Text>
      {isOwnProfile && <Text style={text.ashleyjquimbacom2}>{user.email}</Text>}
      <View style={styles.countBoxContainer}>
        <CountBox
          count={commonsCount}
          name="Commons"
          onPress={() => {
            logger.log('Commons CardBox clicked');
          }}
        />
        <View style={styles.countBoxDivider} />
        <CountBox
          count={proposalsCount}
          name="Proposals"
          onPress={() => {
            logger.log('Proposals CardBox clicked');
          }}
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={text.h2Black}>Intro</Text>
        <Text style={styles.userIntro}>{user.intro}</Text>
      </View>

      <View style={styles.contentContainerWithoutPadding}>
        <View style={styles.viewStyle}>
          <Text
            style={{
              ...text.againstTextBlack,
              ...layout.marginBottomL,
              ...layout.paddingHorizontalL,
            }}>{`Commons (${commonsCount})`}</Text>
          {showMaxData && commonsCount > 0 && (
            <TouchableOpacity
              onPress={() => navigation.navigate('MyCommons')}
              style={{flexDirection: 'row', ...layout.paddingHorizontalL}}>
              <Text
                style={{
                  ...text.h3Black,
                  ...layout.marginBottomL,
                }}>
                {'View all'}
              </Text>
              <Icon name="right-arrow" size={20} />
            </TouchableOpacity>
          )}
        </View>

        <CommonsSwiper
          navigation={navigation}
          userId={user.uid}
          onCountChange={onCommonsCountChange}
          showMax={showMaxData}
        />
      </View>

      <View style={styles.contentContainerWithoutPadding}>
        <View style={styles.viewStyle}>
          <Text
            style={{
              ...text.againstTextBlack,
              ...layout.marginBottomL,
              ...layout.paddingHorizontalL,
            }}>{`Proposals (${proposalsCount})`}</Text>
          {showMaxData && proposalsCount > 0 && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('MyProposals', {onlyFundingRequests: true})
              }
              style={{flexDirection: 'row', ...layout.paddingHorizontalL}}>
              <Text
                style={{
                  ...text.h3Black,
                  ...layout.marginBottomL,
                }}>
                {'View all'}
              </Text>
              <Icon name="right-arrow" size={20} />
            </TouchableOpacity>
          )}
        </View>

        <ProposalsList
          onlyFundingRequests
          navigation={navigation}
          userId={user.uid}
          showAll={true}
          isSwiper={true}
          showMax={showMaxData}
          onCountChange={onProposalsCountChange}
        />
      </View>

      <View style={styles.contentContainerWithoutPadding}>
        <View style={styles.viewStyle}>
          <Text
            style={{
              ...text.againstTextBlack,
              ...layout.marginBottomL,
              ...layout.paddingHorizontalL,
            }}>
            Membership requests ({requestsCount})
          </Text>

          {showMaxData && requestsCount > 0 && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('MyProposals', {
                  onlyMembershipRequests: true,
                })
              }
              style={{
                flexDirection: 'row',
                ...layout.paddingHorizontalL,
              }}>
              <Text
                style={{
                  ...text.h3Black,
                  ...layout.marginBottomL,
                }}>
                {'View all'}
              </Text>
              <Icon name="right-arrow" size={20} />
            </TouchableOpacity>
          )}
        </View>

        <ProposalsList
          membershipRequests
          navigation={navigation}
          userId={user.uid}
          showAll={true}
          isSwiper={true}
          showMax={showMaxData}
          onCountChange={onRequestsCountChange}
        />
      </View>
    </React.Fragment>
  );
};

UserProfileData.propTypes = {
  userId: string,
  currUserInfo: object,
  navigation: object,
  userStore: shape({
    userInfo: shape({
      uid: string,
    }),
  }),
  userListStore: shape({
    getUserById: func,
  }),
};

const styles = StyleSheet.create({
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
  viewStyle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
  },
});

export default inject('userStore', 'userListStore')(observer(UserProfileData));
