import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import MemberCard from '~/Components/MemberCard';
import {layout, sizeS, colors} from '~/Theme';
import UserService from '~/Services/UserService';
import MemberImage from '~/Components/Commons/MemberImage';
import {observer, inject} from 'mobx-react';
import {object, array, bool} from 'prop-types';

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';

const CommonMembersList = ({navigation, members, horizontal, bottomSheetStore}) => {
  const [membersInfo, setMembersInfo] = useState(null);

  const showUserProfile = (uid) => {
    navigation.navigate('Profile', {userId: uid});
  };

  useEffect(() => {
    setMembersInfo(null);
    const loadMemberUsers = async () => {

      const size = 10;
      let allUserInfos = [];

      await Promise.all(Array.from({length: Math.ceil(members.length / size)},  async (v, i) => {
        const currArrChunk = members.slice(i * size, i * size + size);
        const currChunkUserIds = currArrChunk.map((member) => member.userId);
        const currChunkUserInfos = await UserService.getInstance().getUsersByUpTo10Ids(currChunkUserIds);
        console.log('currChunkUserInfos -> ', currChunkUserInfos);
        allUserInfos = allUserInfos.concat(currChunkUserInfos);
      }));

      setMembersInfo(allUserInfos);
    };

    if (members) {
      loadMemberUsers();
    }

  }, [members]);

  return (
    <View style={horizontal && {...layout.flexRow, paddingLeft: (members.length - 1) * 15}}>
      {membersInfo ? (
        membersInfo.map((member, i) => (
          horizontal
            ? (
              <TouchableOpacity style={{position: 'relative', left: i * -15}} onPress={() => showUserProfile(member.uid) } key={`touch_${i}`}>
                <MemberImage
                  id={i}
                  userInfo={member}
                  style={{marginLeft: i > 0 ? -15 : 0}}
                />
              </TouchableOpacity>
            )
            : (
              <TouchableOpacity style={styles.item} onPress={ () => showUserProfile(member.uid) } key={`touch_${i}`}>
                <MemberCard
                  key={i}
                  userInfo={member}
                />
              </TouchableOpacity>
            )
        ))
      ) : horizontal ? (
        members.map((memberUserId, i) => (
          <View style={{position: 'relative', left: i * -15}}>
            <PlaceholderMedia
              key={`${memberUserId.userId}`}
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
            members.map((memberUserId, i) => (
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
