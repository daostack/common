import {observer} from 'mobx-react';
import moment from 'moment';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CountDown from 'react-native-countdown-component';
import {COUNTDOWN_STATES, LAUNCHED_STATES} from '~/Services/ProposalService';
import {colors, font, text} from '~/Theme';
import {monthShortNames} from '~/Util/DateUtil';
import {CurrencySymbols} from '~/Util/locale';
import MemberImage from './Commons/MemberImage';

interface CardProps {
  userInfo: {
    uid: string;
    createdAt: {};
    displayName: string;
    daos: [];
  };
  proposalInfo: {
    type: string;
    closingAt: number;
    description: {
      funding: number | string;
    };
    fundingRequest: {
      amount: number;
    };
    state: string;
  } | null;
}

export const MemberCard = observer((props: CardProps) => {
  const {userInfo, proposalInfo = null} = props;

  const renderRightContainer = () => {
    if (proposalInfo) {
      const closingAt = proposalInfo?.countdown;
      const remainingSeconds = closingAt - moment().unix();

      return (
        <View style={styles.rightContainer}>
          <View style={styles.timeContainer}>
            {proposalInfo.funding > 0 && (
              <View style={styles.priceContainer}>
                <Text style={text.h2Black}>
                  {`${CurrencySymbols.SHEKEL}${proposalInfo.funding / 100}`}
                  {proposalInfo.join?.fundingType === 'monthly' && '/mo'}
                </Text>
              </View>
            )}

            {/* Hide the time if the proposal is expired or new */}
            {remainingSeconds > 0 &&
              !LAUNCHED_STATES.includes(proposalInfo?.state) &&
              !COUNTDOWN_STATES.includes(proposalInfo?.state) &&
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
      <View style={{paddingLeft: 8}}>
        <Text style={styles.displayName}>
          {userInfo?.displayName || 'Unknown user'}
        </Text>
        {proposalInfo && (
          <Text style={styles.date}>
            {moment.unix(proposalInfo.createdAt.seconds).fromNow()}
          </Text>
        )}
      </View>
      {renderRightContainer()}
    </View>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.grey4,
    paddingVertical: 16,
  },
  noBottomBorder: {
    borderBottomWidth: 0,
  },
  displayName: {
    ...font.primary.regular,
    lineHeight: 19,
    fontSize: 16,
    color: colors.black,
    marginBottom: 3,
  },
  rightContainer: {
    position: 'absolute',
    right: 0,
    top: 16,
  },
  priceContainer: {},
  timeContainer: {
    alignItems: 'flex-end',
    flexDirection: 'column',
    marginRight: 5,
  },
  date: {
    ...font.primary.regular,
    color: colors.greySubtitle,
  },
});
