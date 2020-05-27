import {Image, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../../Theme';
import FirebaseService from '../../Services/FirebaseService';


const MemberImage = ({member, key}) => {
  const [memberInfo, setMemberInfo] = useState('');
  useEffect(() => {
    getMemberInfo();
  }, []);

  const getMemberInfo = async () => {
    const memberInformation = await FirebaseService.getInstance().getUserById(
      member.userId,
    );
    console.log('memberInfo: ', memberInformation);

    setMemberInfo(memberInformation);
  };
  console.log('member: ', member);

  return (
    <Image
      key={key}
      style={styles.memberImage}
      source={{
        uri: memberInfo.photoURL,
      }}
    />
  );
};

const styles = StyleSheet.create({
  memberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.white,
  },
});

export default MemberImage;
