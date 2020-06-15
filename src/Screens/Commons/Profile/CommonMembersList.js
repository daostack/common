import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import MemberCard from '../../../Components/MemberCard';
import {layout} from '../../../Theme';
import FirebaseService from '../../../Services/FirebaseService';
import Loader from '../../../Components/Loader';
import MemberImage from '../../../Components/Commons/MemberImage';
import Toast from '../../../Util/Toast';

const CommonMembersList = ({members, horizontal}) => {
  const [membersInfo, setMembersInfo] = useState([]);

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
              <MemberImage
                key={i}
                userInfo={member}
                style={{marginLeft: i > 0 ? -15 : 0}}
              />
            );
          } else {
            return (
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
            );
          }
        })
      ) : (
        <Loader />
      )}
    </View>
  );
};

export default CommonMembersList;
