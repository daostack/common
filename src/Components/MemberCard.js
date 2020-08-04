import {StyleSheet, View, Text} from 'react-native';
import React from 'react';
import {layout, colors, text, font,sizeXS} from '../Theme';
import MemberImage from './Commons/MemberImage';
import CountDown from 'react-native-countdown-component';
import {monthShortNames} from '../Util/DateUtil';
import moment from 'moment';
import {PROPOSAL_TYPE} from '../Config';
import FirebaseService from '../Services/FirebaseService';

const MemberCard = ({
  // memberSince or commonsCount
  memberSince,
  commonsCount,
  showMemberCreatedDate,
  userInfo,
  proposalInfo,
  membershipRequest = false
}) => {
  const [daoInfo, setDaoInfo] = React.useState(null);

  React.useEffect(() => {
    console.log('ef', membershipRequest)

    if(membershipRequest) {
      const setDao = async () => {
        setDaoInfo((await FirebaseService.getInstance().getDaoById(proposalInfo.dao)).data());
      };

      setDao().then(() => console.log(daoInfo));
    }
  }, [proposalInfo])

  const renderRightContainer = () => {
    if (proposalInfo) {
      const proposalValue =
        proposalInfo.type === PROPOSAL_TYPE.JoinAndQuit
          ? proposalInfo.description.funding / 100
          : proposalInfo.fundingRequest.amount / 100;
      const remainingSeconds = proposalInfo.closingAt - moment().unix();
      return (
        <View style={styles.rightContainer}>
          <View
            style={{
              ...layout.content,
              ...{alignItems: 'flex-end'},
            }}>
            <Text style={text.h2Black}>{`$${proposalValue}`}</Text>
            {remainingSeconds > 0 && membershipRequest
              ? (
                <Text>
                  {/*{moment.unix(proposalInfo.closingAt).calendar( null, {*/}
                  {/*  lastDay:  '[Yesterday at ]h:mm',*/}
                  {/*  sameDay:  '[Today at ]h:mm',*/}
                  {/*  nextDay:  '[Tomorrow at ]h:mm',*/}
                  {/*  sameElse: () => "[" +  moment.unix(proposalInfo.createdAt).fromNow('dddd, h:mm') + "]"*/}
                  {/*})}*/}

                  {moment.unix(proposalInfo.createdAt).format('dddd, h:mm')}
                </Text>
              ) : (
                <CountDown
                  digitTxtStyle={text.smallGreyText}
                  separatorStyle={text.smallGreyText}
                  timeLabels={false}
                  showSeparator={true}
                  digitStyle={{
                    height: 'auto',
                    width: 'auto',
                  }}
                  until={remainingSeconds}
                />
              )
            }
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
        {membershipRequest ? (
          <React.Fragment>
            <MemberImage userInfo={userInfo} />
            <View
              style={{
                ...layout.content,
                ...layout.flexStart,
              }}>
              <Text
                style={styles.displayName}>
                {userInfo?.displayName || 'Unknown user'}
              </Text>
              <Text
                style={{
                  ...text.smallGreyText,
                  marginTop: 2,
                }}>
                {proposalInfo
                  ? moment.unix(proposalInfo.createdAt).fromNow()
                  : showMemberCreatedDate
                    ? `Member in ${userInfo?.daos?.length || 0} Common${
                      userInfo?.daos?.length > 1 ? 's' : ''
                    }`
                    : `Member since ${memberSince || 'unknown'}`}
              </Text>
            </View>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <MemberImage userInfo={userInfo} />
            <View
              style={{
                ...layout.content,
                ...layout.flexStart,
              }}>
              <Text
                style={styles.displayName}>
                {userInfo?.displayName || 'Unknown user'}
              </Text>
              <Text
                style={{
                  ...text.smallGreyText,
                  marginTop: 2,
                }}>
                {proposalInfo
                  ? moment.unix(proposalInfo.createdAt).fromNow()
                  : showMemberCreatedDate
                    ? `Member in ${userInfo?.daos?.length || 0} Common${
                      userInfo?.daos?.length > 1 ? 's' : ''
                    }`
                    : `Member since ${memberSince || 'unknown'}`}
              </Text>
            </View>
          </React.Fragment>
        )}
      </View>
      {renderRightContainer()}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    ...layout.content,
    ...layout.flexRow,
    flex: 1,
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'flex-start',
    flexGrow: 1,
    flexWrap: 'wrap',
  },
  displayName: {
    ...font.primary.regular,
    ...font.fontSize(2),
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
