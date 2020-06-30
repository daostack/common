import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity} from 'react-native';
import MemberCard from '../../../Components/MemberCard';
import {layout} from '../../../Theme';
import FirebaseService from '../../../Services/FirebaseService';
import Loader from '../../../Components/Loader';
import MemberImage from '../../../Components/Commons/MemberImage';
import Toast from '../../../Util/Toast';
import {observer, inject} from 'mobx-react';
import { BOTTOM_SHEET_TEMPLATES } from '../../../Stores/BottomSheetStore';

const CommonMembersList = ({navigation, members, horizontal, bottomSheetStore}) => {
  const [membersInfo, setMembersInfo] = useState([]);

  const showUserProfile = uid => {
    bottomSheetStore.showBottomSheet(
      BOTTOM_SHEET_TEMPLATES.USER_PROFILE_SHEET_SCREEN,
      {
        navigation: navigation,
        userId: uid,
      }
    );
  };

  useEffect(() => {
    setMembersInfo([]);
    const loadMemberUser = async userId => {
      try {
        const currUserInfo = await FirebaseService.getInstance().getUserById(
          userId,
        );
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
        currUserInfo = {displayName: daoMember.address};
        setMembersInfo(prevMembers => [...prevMembers, currUserInfo]);
      }
    });
  }, [members]);

  let containerStyle = {};

  if (horizontal) {
    containerStyle = layout.flexRow;
  }

  const renderMembers = () => {};

  return (
    <View style={containerStyle}>
      {membersInfo ? (
        membersInfo.map((member, i) => {
          if (horizontal) {
            return (
              <TouchableOpacity onPress={ () => showUserProfile(member.uid) }>
                <MemberImage
                  key={i}
                  userInfo={member}
                  style={{marginLeft: i > 0 ? -15 : 0}}
                />
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity onPress={ () => showUserProfile(member.uid) }>
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

export default inject('bottomSheetStore')(observer(CommonMembersList));
