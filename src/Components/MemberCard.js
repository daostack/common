import {StyleSheet, View, Text} from 'react-native';
import React, {useMemo} from 'react';
import {observer, inject} from 'mobx-react';
import {layout, colors, text, font} from '~/Theme';
import MemberImage from './Commons/MemberImage';
import CountDown from 'react-native-countdown-component';
import {monthShortNames} from '~/Util/DateUtil';
import moment from 'moment';
import {LAUNCHED_STATES} from '~/Services/ProposalService';
import {string, array, number, shape, object, oneOfType} from 'prop-types';
import {rootStorePropTypes} from '~/Types/propTypes';
import {PERMISSIONS} from '~/Util/constants/permissions.enum';

const MemberCard = ({
  userInfo,
  proposalInfo = null,
  moderatorId,
  commonId,
  rootStore,
}) => {
  const viewerPermission = rootStore.authStore.getPermission(
    commonId,
    userInfo.id,
  );

  const isModerator = useMemo(
    () =>
      viewerPermission === PERMISSIONS.FOUNDER ||
      viewerPermission === PERMISSIONS.MODERATOR,
    [moderatorId],
  );

  const renderRightContainer = () => {
    if (proposalInfo) {
      const closingAt =
        proposalInfo?.createdAt.seconds + proposalInfo?.countdownPeriod;
      const remainingSeconds = closingAt - moment().unix();

      return (
        <View style={styles.rightContainer}>
          <View style={{alignItems: 'flex-end'}}>
            {proposalInfo.funding > 0 && (
              <Text style={text.h2Black}>
                {`$${proposalInfo.funding / 100}`}
                {proposalInfo.join?.fundingType === 'monthly' && '/mo'}
              </Text>
            )}

            {/* Hide the time if the proposal is expired or new */}
            {remainingSeconds > 0 &&
              !LAUNCHED_STATES.includes(proposalInfo?.state) &&
              // If the remaining time is more than 1 day show the date,
              // if it is less show countdown till it
              (remainingSeconds > 24 * 60 * 60 ? (
                <Text style={{...text.runningblack, width: '100%'}}>
                  {moment.unix(closingAt).format('dddd, h:mm')}
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
              ))}
          </View>
        </View>
      );
    } else {
      let memberCreatedDateInfo = null;
      if (userInfo?.joinedAt) {
        const memberCreatedDate = new Date(userInfo.joinedAt.seconds * 1000);
        memberCreatedDateInfo = memberCreatedDate
          ? `${
              monthShortNames[memberCreatedDate.getMonth()]
            } ${memberCreatedDate.getDate()} `
          : '';
      }

      return (
        <View style={styles.rightContainer}>
          <Text style={{...text.smallGreyText, marginTop: 2}}>
            {memberCreatedDateInfo}
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={{...styles.cardContainer, ...styles.noBottomBorder}}>
      <MemberImage userInfo={userInfo} />
      <View
        style={{
          ...layout.content,
          ...layout.flexStart,
          alignContent: 'flex-start',
          flex: 1.9,
          flexWrap: 'wrap',
        }}>
        {isModerator && <Text style={text.moderatorText}>Moderator</Text>}
        <Text style={styles.displayName}>
          {userInfo?.displayName || 'Unknown user'}
        </Text>
        {proposalInfo && (
          <Text style={{...text.runninglightGray, width: '100%'}}>
            {moment.unix(proposalInfo.createdAt.seconds).fromNow()}
          </Text>
        )}
      </View>
      {renderRightContainer()}
    </View>
  );
};

MemberCard.propTypes = {
  rootStore: rootStorePropTypes,
  moderatorId: string,
  memberSince: string,
  commonsCount: number,
  userInfo: shape({
    createdAt: object,
    displayName: string,
    daos: array,
  }),
  proposalInfo: shape({
    type: string,
    closingAt: number,
    description: shape({
      funding: oneOfType([number, string]),
    }),
    fundingRequest: shape({
      amount: number,
    }),
    state: string,
  }),
  commonId: string,
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
  displayName: {
    ...font.primary.regular,
    ...font.fontSize(2),
    flexWrap: 'wrap',
    fontWeight: '500',
    fontSize: 16,
  },
  rightContainer: {
    flex: 1.1,
    alignItems: 'flex-end',
  },
});

export default inject('rootStore')(observer(MemberCard));
