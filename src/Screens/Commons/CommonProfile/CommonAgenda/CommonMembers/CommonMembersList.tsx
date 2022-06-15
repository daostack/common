import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  Fade,
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
} from 'rn-placeholder';
import MemberImage from '~/Components/Commons/MemberImage';
import {MemberCard} from '~/Components/MemberCard';
import {colors, layout, sizeS} from '~/Theme';
import {useStore} from '~/Util/hooks/useStore';

interface MembersListProps {
  commonId: string;
  limit: number;
  horizontal: boolean;
}

export const CommonMembersList = observer(
  ({commonId, limit, horizontal}: MembersListProps) => {
    const userStore = useStore('userStore');
    const commonStore = useStore('commonStore');
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

    const limitedMembers = limit
      ? limitCommonMembers(membersInfo)
      : membersInfo;

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
  },
);

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: sizeS,
    borderBottomColor: colors.grey4,
    borderBottomWidth: 1,
  },
});
