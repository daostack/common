import {observer} from 'mobx-react';
import moment from 'moment';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CountDown from 'react-native-countdown-component';
import {COUNTDOWN_STATES, LAUNCHED_STATES} from '~/Services/ProposalService';
import {colors, font, text} from '~/Theme';
import {PERMISSIONS} from '~/Util/constants/permissions.enum';
import {monthShortNames} from '~/Util/DateUtil';
import {useStore} from '~/Util/hooks/useStore';
import {CurrencySymbols} from '~/Util/locale';
import MemberImage from './Commons/MemberImage';

interface CardProps {
  userInfo: {
    uid: string;
    createdAt: {};
    displayName: string;
    daos: [];
  };
  commonId: string;
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
  const {userInfo, proposalInfo = null, commonId} = props;
  const rootStore = useStore('rootStore');
  const viewerPermission = rootStore.authStore.getPermission(
    commonId,
    userInfo?.uid,
  );
  const isModerator = viewerPermission === PERMISSIONS.MODERATOR;

  const renderRightContainer = () => {
    if (proposalInfo) {
      const closingAt = proposalInfo?.countdown;
      const remainingSeconds = closingAt - moment().unix();

      return (
        <View style={styles.rightContainer}>
          <View style={styles.timeContainer}>
            {proposalInfo?.funding > 0 && (
              <View style={styles.priceContainer}>
                <Text style={text.h2Black}>
                  {`${CurrencySymbols.SHEKEL}${proposalInfo?.funding / 100}`}
                  {proposalInfo?.join?.fundingType === 'monthly' && '/mo'}
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
          <Text style={{...styles.rightDate, marginTop: 2}}>
            {memberCreatedDateInfo}
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={{...styles.cardContainer, ...styles.noBottomBorder}}>
      <MemberImage userInfo={userInfo} />
      <View style={styles.textContainer}>
        <View style={styles.cardTitlesContainer}>
          {isModerator && <Text style={styles.moderator}>Moderator</Text>}
          <Text style={styles.displayName}>
            {userInfo?.displayName || 'Unknown user'}
          </Text>
          {proposalInfo && (
            <Text style={styles.date}>
              {moment.unix(proposalInfo?.createdAt?.seconds).fromNow()}
            </Text>
          )}
        </View>
        {renderRightContainer()}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.grey4,
    flex: 1,
    paddingVertical: 22,
  },
  textContainer: {
    paddingLeft: 11,
    width: '88%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitlesContainer: {},
  noBottomBorder: {
    borderBottomWidth: 0,
  },
  moderator: {
    ...font.primary.regular,
    fontSize: 12,
    color: colors.mainBlue,
  },
  displayName: {
    ...font.primary.bold,
    lineHeight: 20,
    fontSize: 14,
    color: colors.black,
    marginBottom: 3,
  },
  rightContainer: {},
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
  rightDate: {
    ...font.primary.regular,
    color: colors.greySubtitle,
    fontSize: 12,
  },
});
