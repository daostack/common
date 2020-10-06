import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import MemberCard from '~/Components/MemberCard';
import {layout, sizeS, colors} from '~/Theme';
import UserService from '~/Services/UserService';
import DaoService from '~/Services/DaoService';
import Loader from '~/Components/Loader';
import MemberImage from '~/Components/Commons/MemberImage';
import Toast from '~/Util/Toast';
import {observer, inject} from 'mobx-react';
import logger from '~/Services/Logger';
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
      const allUserInfos = await UserService.getInstance().getUsersByIds(members.map((member) => member.userId));
      setMembersInfo(allUserInfos);

      // try {
      //   let currUserInfo = await UserService.getInstance().getUserById(
      //     userId,
      //   );

      //   currUserInfo = {
      //     ...currUserInfo,
      //     daos: (await DaoService.getInstance().getUserDaos(currUserInfo.uid, currUserInfo.safeAddress)).docs?.map((dao) => dao.data()),
      //   };
      //   addMemberOnce(currUserInfo);
      // } catch (e) {
      //   Toast.error(e.toString());
      //   logger.log(e);
      // }
    };

    if (members) {
      loadMemberUsers();
    }

    // members.forEach(async (daoMember) => {
    //   let currUserInfo = null;

    //   if (daoMember.userId) {
    //     currUserInfo = loadMemberUser(daoMember.userId);
    //   } else {
    //     // TODO: Think about what data to put in the userInfo object in case there is no userId in the daoMember.
    //     currUserInfo = {displayName: daoMember.address};
    //     addMemberOnce(currUserInfo);
    //   }
    // });

  }, [members]);

  // const addMemberOnce = (currUserInfo) => {
  //   setMembersInfo((prevMembers) => (
  //     prevMembers.some((u)=> u.uid === currUserInfo.uid)
  //       ? [...prevMembers]
  //       : [...prevMembers, currUserInfo]
  //   ));
  // };

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
                  showMemberCreatedDate={true}
                  userInfo={member}
                />
              </TouchableOpacity>
            )
        ))
      ) : horizontal ? (
        <View style={{...layout.flexRow, paddingRight: 15}}>
          {
            members.map((memberUserId, i) => (
              <PlaceholderMedia
                size={50}
                isRound={true}
                style={{marginLeft: i > 0 ? -15 : 0, borderWidth: 2, borderColor: colors.white}}
              />
            ))
          }
        </View>
      ) :
        <Placeholder Animation={Fade}>
          {
            members.map((memberUserId, i) => (
              <View style={{...layout.flexRow, justifyContent: 'space-between', paddingVertical: 10}}>
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
