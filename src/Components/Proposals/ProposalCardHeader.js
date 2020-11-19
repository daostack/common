import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {text, layout, colors, sizeXS, sizeS, font} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import {PROPOSAL_STAGE} from '~/Services/ProposalService';
import CountDown from 'react-native-countdown-component';
import {string, number, bool} from 'prop-types';

const TITLES = {
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  NEW: 'New',
  COUNTDOWN: 'Countdown',
  PAYMENT_FAILED: 'Payment Failed',
};

const calcStatus = (state, isScreenHeader, paymentStatus) => {
  let status = {
    text: '',
    lightColor: '',
    darkColor: '',
    icon: '',
    opacity: 1,
  };

  if (paymentStatus === 'failed') {
    status.text = TITLES.PAYMENT_FAILED;
    status.lightColor = colors.redLightish;
    status.darkColor = colors.error;
    status.icon = 'declined';
    return status;
  }

  if (state === PROPOSAL_STAGE.passed) {
    status.text = TITLES.APPROVED;
    status.lightColor = colors.lightGreen;
    status.darkColor = colors.lightishGreen;
    status.icon = 'approved';
  }
  if (state === PROPOSAL_STAGE.failed){
    status.text = TITLES.REJECTED;
    status.lightColor = colors.redLightish;
    status.darkColor = colors.error;
    status.icon = 'declined';
  } else {
    status.text = TITLES.COUNTDOWN;
    status.lightColor = isScreenHeader ? colors.mango : colors.butterscotch;
    status.darkColor = colors.mango;
    status.icon = 'clcok';
    status.opacity = 0.2;
  }
  return status;
};

const renderCountDown = (closingAt) => {
  /*
  const isLessThanOneHour = remainingSeconds < 3600;

  let counterTextColor = styles.timerText;
  let timerBackground = colors.paleblue;

  if (isLessThanOneHour) {
    counterTextColor = {...styles.timerText, ...{color: colors.white}};
    timerBackground = colors.orangeDark;
  }
*/
  let counterTextColor = styles.timerText;

  const remainingSeconds = closingAt
    ? closingAt - Date.now() / 1000
    : null;

  return (
    <View style={styles.timerContainer}>
      <View
        style={{...styles.timer}}>
        <CountDown
          timeToShow={[ 'D', 'H', 'M', 'S' ]}
          digitTxtStyle={counterTextColor}
          timeLabels={false}
          showSeparator={true}
          separatorStyle={counterTextColor}
          digitStyle={{
            height: 'auto',
            width: 'auto',
          }}
          until={remainingSeconds}
        />
      </View>
    </View>
  );
};


const ProposalCardHeader = ({state, closingAt, isScreenHeader = false, paymentStatus}) => {
  const headerStatus = calcStatus(state, isScreenHeader, paymentStatus);

  return isScreenHeader
    ? (
      <View style={{...styles.stateCard, ...{
        backgroundColor: headerStatus.darkColor,
        paddingHorizontal: 50,
      }}}
      >
        <Icon
          style={styles.stateIcon}
          name={headerStatus.icon}
          color={colors.white}
        />

        <Text style={styles.stateText}>
          {headerStatus.text}
        </Text>

        {headerStatus.text === TITLES.COUNTDOWN && renderCountDown(closingAt)}
      </View>
    ) : (
      <View
        style={{
          ...styles.proposalCardHeader,
          backgroundColor: headerStatus.lightColor,
        }}
      >
        <Icon name={headerStatus.icon} color={headerStatus.darkColor} size={16}/>

        <Text
          style={{
            ...text.orangeSmallBold,
            marginHorizontal: 5,
            color: headerStatus.darkColor,
          }}
        >
          {headerStatus.text}
        </Text>
      </View>
    );
};

ProposalCardHeader.propTypes = {
  state: string,
  closingAt: number,
  isScreenHeader: bool,
  paymentStatus: string,
};

const styles = StyleSheet.create({
  // Proposal Card Header style
  proposalCardHeader: {
    ...layout.content,
    ...layout.flexRow,
    alignSelf: 'stretch',
    backgroundColor: colors.orangeLight,
    padding: sizeXS,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  launchedColor: {
    color: colors.mainBlue,
  },
  countdownColor: {
    color: colors.countdown,
  },
  // Proposal Screen Stage header style
  stateCard: {
    position: 'relative',
    ...layout.content,
    ...layout.flexRow,
    backgroundColor: colors.blue,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 100,
    ...layout.marginBottomL,
  },
  stateText: {
    ...text.smallBlackText,
    color: colors.white,
    ...font.fontSize(1),
    ...font.primary.bold,
  },
  stateIcon: {
    position: 'absolute',
    left: sizeS,
  },

  timerText: {
    ...text.smallBlackText,
    ...text.bold,
    color: colors.white,
    ...font.fontSize(0),
  },

  timer: {
    paddingHorizontal: 0,
    paddingVertical: 1,
    borderRadius: 12,
  },

  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
  },
});

export default ProposalCardHeader;
