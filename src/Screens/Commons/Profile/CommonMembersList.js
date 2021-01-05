import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import MemberCard from '~/Components/MemberCard';
import {layout, sizeS, colors} from '~/Theme';
import UserService from '~/Services/UserService';
import MemberImage from '~/Components/Commons/MemberImage';
import {observer, inject} from 'mobx-react';
import {object, array, bool, string, number} from 'prop-types';
import DaoService from '~/Services/DaoService';

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';

const CommonMembersList = ({navigation, members, commonId, limit, horizontal, bottomSheetStore}) => {

  const [membersInfo, setMembersInfo] = useState(null);

  const showUserProfile = (userInfo) => {
    navigation.navigate('Profile', {userId: userInfo.uid, userInfo});
  };

  const limitCommonMembers = (commonMembers) => commonMembers?.length > limit ? commonMembers.slice(0, limit) : commonMembers || [];

  const getAllCommonMembers = async (commonMembers) => {
    const size = 10;
    let allUserInfos = [];

    const currCommonMembers = limit ? limitCommonMembers(commonMembers) : commonMembers;

    await Promise.all(Array.from({length: Math.ceil(currCommonMembers.length / size)}, async (v, i) => {
      const currArrChunk = currCommonMembers.slice(i * size, i * size + size);
      const currChunkUserIds = currArrChunk.map((member) => member.userId);
      const currChunkUserInfos = await UserService.getInstance().getUsersByUpTo10Ids(currChunkUserIds);
      allUserInfos = allUserInfos.concat(currChunkUserInfos);
    }));
    return allUserInfos;
  };

  useEffect(() => {
    const loadCommonMembers = async (currCommonMembers) => {
      setMembersInfo(await getAllCommonMembers(currCommonMembers));
    };
    if (members) {
      loadCommonMembers(members);
    }
  }, []);

  useEffect(() => {
    let unsubscribeCommon = null;
    const subscribeToCommon = async (currCommonId) => {
      unsubscribeCommon = await DaoService.getInstance().subscribeToDaoById(currCommonId, async (snapshot) => {
        const updatedCommon = snapshot.data();
        setMembersInfo(await getAllCommonMembers(updatedCommon?.members));
      });
    };
    if (commonId) {
      subscribeToCommon(commonId);
    }

    return () => {
      unsubscribeCommon && unsubscribeCommon();
    };

  }, [commonId]);

  const limitedMembers = limit ? limitCommonMembers(members) : members;

  return (
    <View style={horizontal && {...layout.flexRow, paddingLeft: (limitedMembers.length - 1) * 15}}>
      {membersInfo ? (
        membersInfo.map((member, i) => (
          horizontal
            ? (
              <TouchableOpacity style={{position: 'relative', left: i * -15}} onPress={() => showUserProfile(member) } key={`touch_${i}`}>
                <MemberImage
                  id={i}
                  userInfo={member}
                  style={{marginLeft: i > 0 ? -15 : 0}}
                />
              </TouchableOpacity>
            )
            : (
              <TouchableOpacity style={styles.item} onPress={ () => showUserProfile(member) } key={`touch_${i}`}>
                <MemberCard
                  key={i}
                  userInfo={member}
                />
              </TouchableOpacity>
            )
        ))
      ) : horizontal ? (
        limitedMembers.map((memberUserId, i) => (
          <View style={{position: 'relative', left: i * -15}}
            key={`${memberUserId.userId}-${i}`}>
            <PlaceholderMedia
              size={50}
              isRound={true}
              style={{width: 50,
                height: 50,
                borderRadius: 25,
                borderWidth: 2,
                borderColor: colors.white}}
            />
          </View>
        ))
      ) :
        <Placeholder Animation={Fade}>
          {
            limitedMembers.map((memberUserId, i) => (
              <View style={{...layout.flexRow, justifyContent: 'space-between', paddingVertical: 10}} key={i}>
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
            ))
          }
        </Placeholder>
      }
    </View>
  );
};

CommonMembersList.propTypes = {
  navigation: object,
  members: array,
  commonId: string,
  limit: number,
  horizontal: bool,
  bottomSheetStore: object,
};

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: sizeS,
    borderBottomColor: colors.grey4,
    borderBottomWidth: 1,
  },
});

export default inject('bottomSheetStore')(observer(CommonMembersList));
