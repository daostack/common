import {StyleSheet, View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {layout, colors, text, sizeXS} from '../Theme';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from '../Assets/iconfont/Icon';
import MemberImage from './Commons/MemberImage';
import FirebaseService from '../Services/FirebaseService';

const
  MemberCard = ({
  approvePercent,
  memberSince,
  memberCustomText,
  isPending,
  date,
  member,
}) => {
  const [memberInfo, setMemberInfo] = useState('');
  useEffect(() => {
    getMemberInfo();
  }, []);

  const getMemberInfo = async () => {
    const memberInformation = await FirebaseService.getInstance().getUserByAddress(
      member.address,
    );

    setMemberInfo(memberInformation);
  };

  renderRightContainer = () => {
    if (isPending) {
      return (
        <>
          <TouchableOpacity style={styles.actionBtn}>
            <Icon name="close" size={15} color={colors.error} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Icon name="check" size={30} color={colors.lightishGreen} />
          </TouchableOpacity>
        </>
      );
    } else if (date) {
      return (
        <Text
          style={{
            ...text.smallGreyText,
            marginTop: 2,
          }}>
          {date}
        </Text>
      );
    }
  };
  return (
    <View style={{...styles.cardContainer, ...styles.noBottomBorder}}>
      <View style={styles.memberInfoContainer}>
        <MemberImage
          member={member}
        />
        <View
          style={{
            ...layout.content,
            ...layout.flexStart,
          }}>
          <Text style={{...text.h4Black}}>{memberInfo.displayName}</Text>
          <Text
            style={{
              ...text.smallGreyText,
              marginTop: 2,
            }}>
            {memberCustomText
              ? memberCustomText
              : memberSince
              ? `Member since by ${memberSince}`
              : `Approved by ${approvePercent}%`}
          </Text>
        </View>
      </View>
      <View style={styles.rightContainer}>{renderRightContainer()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    ...layout.content,
    ...layout.flexRow,

    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.grey4,
    padding: 0,
  },
  noBottomBorder: {
    borderBottomWidth: 0,
  },
  memberInfoContainer: {
    ...layout.flexRow,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  rightContainer: {
    ...layout.content,
    ...layout.flexRow,
  },
  actionBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.grey4,
    marginHorizontal: sizeXS,
  },
  memberImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.white,
  },
});

export default MemberCard;
