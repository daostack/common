import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useLinkTo, useNavigation} from '@react-navigation/native';
import {MemberCard} from '~/Components';
import {layout, sizeS, colors} from '~/Theme';
import {MemberImage} from '~/Components/Commons';
import {observer, inject} from 'mobx-react';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';

import {Common} from '~/Stores/Models';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';

const CommonMembersList = ({
  common,
  limit,
  horizontal,
}: {
  common: Common;
  limit: number;
  horizontal: boolean;
}) => {
  const navigation = useNavigation();

  const link = useLinkTo();
  const showUserProfile = React.useCallback((userId: string) => {
    navigation.navigate(NAVIGATION_SCREENS.PROFILE, {userId});
  }, []);

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

  const limitedMembers = React.useMemo(
    () =>
      common.members?.length > limit
        ? common.members.slice(0, limit)
        : common.members || [],
    [],
  );

  return (
    <View
      style={
        horizontal && {
          ...layout.flexRow,
          paddingLeft: (limitedMembers.length - 1) * 15,
        }
      }>
      {limitedMembers.length ? (
        limitedMembers.map((member, i) =>
          horizontal ? (
            <TouchableOpacity
              style={{position: 'relative', left: i * -15}}
              onPress={() => showUserProfile(member)}
              key={`touch_${i}`}>
              <MemberImage
                user={member}
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

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: sizeS,
    borderBottomColor: colors.grey4,
    borderBottomWidth: 1,
  },
});

export default inject('rootStore')(observer(CommonMembersList));
