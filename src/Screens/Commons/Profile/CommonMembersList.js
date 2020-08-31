import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MemberCard from '~/Components/MemberCard';
import { layout, sizeS, colors } from '~/Theme';
import UserService from '~/Services/UserService';
import DaoService from '~/Services/DaoService';
import Loader from '~/Components/Loader';
import MemberImage from '~/Components/Commons/MemberImage';
import Toast from '~/Util/Toast';
import { observer, inject } from 'mobx-react';

const CommonMembersList = ({ navigation, members, horizontal, bottomSheetStore }) => {
  const [membersInfo, setMembersInfo] = useState([]);

  const showUserProfile = uid => {
    navigation.navigate('Profile', { userId: uid });
  };

  useEffect(() => {
    setMembersInfo([]);
    const loadMemberUser = async userId => {
      try {
        let currUserInfo = await UserService.getInstance().getUserById(
          userId,
        );

        currUserInfo = {
          ...currUserInfo,
          daos: (await DaoService.getInstance().getUserDaos(currUserInfo.uid, currUserInfo.safeAddress)).docs?.map(dao => dao.data()),
        };

        setMembersInfo(prevMembers => [...prevMembers, currUserInfo]);
      } catch (e) {
        Toast.error(e.toString());
        console.log(e);
      }
    };

    members.forEach(async daoMember => {
      let currUserInfo = null;

      if (daoMember.userId) {
        currUserInfo = loadMemberUser(daoMember.userId);
      } else {
        // TODO: Think about what data to put in the userInfo object in case there is no userId in the daoMember.
        currUserInfo = { displayName: daoMember.address };
        setMembersInfo(prevMembers => [...prevMembers, currUserInfo]);
      }
    });
  }, [members]);

  let containerStyle = {};

  if (horizontal) {
    containerStyle = { ...layout.flexRow, ...{ paddingLeft: (membersInfo.length - 1) * 15 } };
  }

  return (
    <View style={containerStyle}>
      {membersInfo ? (
        membersInfo.map((member, i) => {
          if (horizontal) {

            let itemStyle = styles.horizontalItem;

            if (i > 0) {
              itemStyle = { ...itemStyle, ...{ position: 'relative', left: i * -15 } };
            }

            return (
              <TouchableOpacity style={itemStyle} onPress={() => showUserProfile(member.uid)} key={`touch_${i}`}>
                <MemberImage
                  id={i}
                  userInfo={member}
                  style={{ marginLeft: i > 0 ? -15 : 0 }}
                />
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity style={styles.item} onPress={() => showUserProfile(member.uid)} key={`touch_${i}`}>
                <MemberCard
                  key={i}
                  //name={member.displayName}
                  //approvePercent={member.approvalPercentage}
                  //imageUrl={member.photoURL}
                  //TODO: change pending status
                  //isPending={sceneIndex === 1}
                  showMemberCreatedDate={true}
                  userInfo={member}
                />
              </TouchableOpacity>
            );
          }
        })
      ) : (
          <Loader />
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
  horizontalItem: {
    paddingHorizontal: 0,
  },

});

export default inject('bottomSheetStore')(observer(CommonMembersList));
