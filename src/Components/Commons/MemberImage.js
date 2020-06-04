import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../../Theme';
import FirebaseService from '../../Services/FirebaseService';

const MemberImage = ({member, memberInfo, key}) => {
  const [memberInformation, setMemberInformation] = useState('');
  useEffect(() => {
    if (member) {
      getMemberInfo();
    } else {
      setMemberInformation(memberInfo);
    }
  }, []);

  const getMemberInfo = async () => {
    const currMemberInformation = await FirebaseService.getInstance().getUserByAddress(
      member.address,
    );
    setMemberInformation(currMemberInformation);
  };
  return memberInformation ? (
    memberInformation.photoURL ? (
      <Image
        key={key}
        style={styles.memberImage}
        source={{
          uri: memberInformation.photoURL,
        }}
      />
    ) : (
      <View
        style={{
          ...styles.memberImage,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#6e7d82',
        }}>
        <Text style={{width: 17, height: 17, color: 'white'}}>
          {memberInformation.displayName}
        </Text>
      </View>
    )
  ) : (
    <View
      style={{
        ...styles.memberImage,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6e7d82',
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
