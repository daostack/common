import {StyleSheet, View, Text} from 'react-native';
import React from 'react';
import {layout, colors, text, sizeXS} from '../Theme';
import MemberImage from './Commons/MemberImage';
import {monthShortNames} from '../Util/DateUtil';

const MemberCard = ({
  memberCustomText,
  // memberSince or commonsCount
  memberSince,
  commonsCount,
  showMemberCreatedDate,

  //-------------
  userInfo,
  proposalInfo,
}) => {
  const renderRightContainer = () => {
    if (proposalInfo) {
      return (
        <View style={styles.rightContainer}>
          <View
            style={{
              ...layout.content,
              ...{alignItems: 'flex-end'},
            }}>
            <Text style={text.h2Black}>{`$${proposalInfo?.joinAndQuit
              ?.funding || proposalInfo?.fundingRequest?.funding}`}</Text>
            <Text style={text.smallGreyText}>02:02:02:02</Text>
          </View>
        </View>
      );
    } else if (showMemberCreatedDate) {
      let memberCreatedDateInfo = null;
      if (userInfo?.createdAt) {
        const memberCreatedDate = new Date(userInfo.createdAt.seconds * 1000);
        memberCreatedDateInfo = memberCreatedDate
          ? `${
              monthShortNames[memberCreatedDate.getMonth()]
            } ${memberCreatedDate.getDay()} `
          : '';
      } else {
        memberCreatedDateInfo = 'NOT app user';
      }

      return (
        <View style={styles.rightContainer}>
          <Text
            style={{
              ...text.smallGreyText,
              marginTop: 2,
            }}>
            {memberCreatedDateInfo}
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={{...styles.cardContainer, ...styles.noBottomBorder}}>
      <View style={styles.memberInfoContainer}>
        <MemberImage userInfo={userInfo} />
        <View
          style={{
            ...layout.content,
            ...layout.flexStart,
          }}>
          <Text
            style={{
              ...text.h4Black,
              ...{flexWrap: 'wrap'},
            }}>
            {userInfo.displayName}
          </Text>
          <Text
            style={{
              ...text.smallGreyText,
              marginTop: 2,
            }}>
            {memberCustomText
              ? memberCustomText
              : showMemberCreatedDate
              ? `Member in ${userInfo.daos.length} Common${
                  userInfo.daos.length > 1 ? 's' : ''
                }`
              : `Member since by ${memberSince}`}
          </Text>
        </View>
      </View>
      {renderRightContainer()}
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
    flex: 0.8,
  },
  noBottomBorder: {
    borderBottomWidth: 0,
  },
  memberInfoContainer: {
    ...layout.flexRow,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'flex-start',
    flexGrow: 1,
    flexWrap: 'wrap',
  },
  rightContainer: {
    ...layout.content,
    ...layout.flexRow,
    alignItems: 'center',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
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
