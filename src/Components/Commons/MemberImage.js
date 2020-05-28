import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../../Theme';
import FirebaseService from '../../Services/FirebaseService';


const MemberImage = ({member, key}) => {
  const [memberInfo, setMemberInfo] = useState('');
  useEffect(() => {
    getMemberInfo();
  }, []);

  const getMemberInfo = async () => {
    const memberInformation = await FirebaseService.getInstance().getUserByAddress(
      member.address,
    );
    console.log('memberInfo: ', memberInformation);

    setMemberInfo(memberInformation);
  };
  console.log('member: ', member);
  return memberInfo ? memberInfo.photoURL ? <Image
      key={key}
      style={styles.memberImage}
      source={{
        uri: memberInfo.photoURL,
      }}
    /> :
    <View style={{...styles.memberImage, alignItems: 'center', justifyContent: 'center', backgroundColor: '#6e7d82'}}>
      <Text style={{width: 17, height: 17, color: 'white' }}>{memberInfo.displayName}</Text>
    </View>
    :
    <View style={{...styles.memberImage, alignItems: 'center', justifyContent: 'center', backgroundColor: '#6e7d82'}}/>
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
