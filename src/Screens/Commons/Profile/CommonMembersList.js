import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MemberCard from '~/Components/MemberCard';
import {layout, sizeS, colors} from '~/Theme';
import MemberImage from '~/Components/Commons/MemberImage';
import {observer, inject} from 'mobx-react';
import {object, array, bool, string, number} from 'prop-types';

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import {rootStorePropTypes} from '~/Types/propTypes';

const CommonMembersList = ({commonId, limit, horizontal, rootStore}) => {
  const userStore = rootStore.userStore;
  const commonStore = rootStore.commonStore;
  const navigation = useNavigation();

  const currCommon = commonStore.getCommonById(commonId);
  const membersInfo = userStore.getCommonUsersByMembersArray(
    currCommon?.members || [],
  );

  const showUserProfile = (userInfo) => {
    navigation.navigate('Profile', {userId: userInfo.uid, userInfo});
  };

  const limitCommonMembers = (commonMembers) =>
    commonMembers?.length > limit
      ? commonMembers.slice(0, limit)
      : commonMembers || [];

  // That's the old way of fatching commong members.
  // Let's keep it here as refference untill find better way of fetching it from DB at once.
  //
  // const size = 10;
  // let allUserInfos = [];

  // const currCommonMembers = limit
  //   ? limitCommonMembers(commonMembers)
  //   : commonMembers;

  // await Promise.all(
  //   Array.from(
  //     {length: Math.ceil(currCommonMembers.length / size)},
  //     async (v, i) => {
  //       const currArrChunk = currCommonMembers.slice(
  //         i * size,
  //         i * size + size,
  //       );
  //       const currChunkUserIds = currArrChunk.map((member) => member.userId);
  //       const currChunkUserInfos = await UserService.getInstance().getUsersByUpTo10Ids(
  //         currChunkUserIds,
  //       );
  //       allUserInfos = allUserInfos.concat(currChunkUserInfos)
  //       .map((userInfo, index) => ({joinedAt: members[index].joinedAt, ...userInfo}));;
  //     },
  //   ),
  // );
  // return allUserInfos;

  const limitedMembers = limit ? limitCommonMembers(membersInfo) : membersInfo;

  return (
    <View
      style={
        horizontal && {
          ...layout.flexRow,
          paddingLeft: (limitedMembers.length - 1) * 15,
        }
      }>
      {membersInfo ? (
        limitedMembers.map((member, i) =>
          horizontal ? (
            <TouchableOpacity
              style={{position: 'relative', left: i * -15}}
              onPress={() => showUserProfile(member)}
              key={`touch_${i}`}>
              <MemberImage
                id={i}
                userInfo={member}
                style={{marginLeft: i > 0 ? -15 : 0}}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.item}
              onPress={() => showUserProfile(member)}
              key={`touch_${i}`}>
              <MemberCard
                key={i}
                moderatorId={currCommon?.metadata?.founderId}
                commonId={currCommon.id}
                userInfo={member}
              />
            </TouchableOpacity>
          ),
        )
      ) : horizontal ? (
        limitedMembers.map((memberUserId, i) => (
          <View
            style={{position: 'relative', left: i * -15}}
            key={`${memberUserId.userId}-${i}`}>
            <PlaceholderMedia
              size={50}
              isRound={true}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                borderWidth: 2,
                borderColor: colors.white,
              }}
            />
          </View>
        ))
      ) : (
        <Placeholder Animation={Fade}>
          {limitedMembers.map((memberUserId, i) => (
            <View
              style={{
                ...layout.flexRow,
                justifyContent: 'space-between',
                paddingVertical: 10,
              }}
              key={i}>
              <View style={{padding: 10}}>
                <PlaceholderMedia
                  size={50}
                  isRound={true}
                  style={{borderWidth: 2, borderColor: colors.white}}
                />
              </View>
              <View style={{padding: 10, paddingVertical: 15, width: '100%'}}>
                <PlaceholderLine width={50} />
                <PlaceholderLine width={30} />
              </View>
            </View>
          ))}
        </Placeholder>
      )}
    </View>
  );
};

CommonMembersList.propTypes = {
  navigation: object,
  members: array,
  commonId: string,
  limit: number,
  horizontal: bool,
  rootStore: rootStorePropTypes,
};

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: sizeS,
    borderBottomColor: colors.grey4,
    borderBottomWidth: 1,
  },
});

export default inject('rootStore')(observer(CommonMembersList));
