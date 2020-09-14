import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {text, layout, colors, sizeXS, sizeS, font} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import {LAUNCHED_STATES, COUNTDOWN_STATES, PROPOSAL_STAGE} from '~/Services/ProposalService';
import CountDown from 'react-native-countdown-component';
import {string, number, bool} from 'prop-types';

const TITLES = {
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  NEW: 'New',
  COUNTDOWN: 'Countdown',
};

const calcStatus = (stage, winningOutcome, hasPassedExpiryDate) => {
  let status = {
    text: '',
    lightColor: '',
    darkColor: '',
    icon: '',
  };

  if (stage === PROPOSAL_STAGE.Executed) {
    if (winningOutcome === 1) {
      status.text = TITLES.APPROVED;
      status.lightColor = colors.lightGreen;
      status.darkColor = colors.lightishGreen;
      status.icon = 'approved';
    } else {
      status.title = TITLES.REJECTED;
      status.lightColor = colors.redLightish;
      status.darkColor = colors.error;
      status.icon = 'declined';
    }
    return status;
  }
  if (hasPassedExpiryDate || stage === PROPOSAL_STAGE.ExpiredInQueue) {
    status.text = TITLES.REJECTED;
    status.lightColor = colors.redLightish;
    status.darkColor = colors.error;
    status.icon = 'declined';
    return status;
  }
  if (LAUNCHED_STATES.includes(stage)) {
    status.text = TITLES.NEW;
    status.lightColor = colors.lightBlue;
    status.darkColor = colors.blue;
    status.icon = 'boosted';
    return status;
  }
  if (COUNTDOWN_STATES.includes(stage)) {
    status.text = TITLES.COUNTDOWN;
    status.lightColor = colors.lightishOrange;
    status.darkColor = colors.orange;
    status.icon = 'clcok';
    return status;
  }

  return 'test'; // this causes Icon name prop to be undefined -> violating proptypes definition
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


const ProposalCardHeader = ({stage, winningOutcome, hasPassedExpiryDate, closingAt, isScreenHeader = false}) => {

  const headerStatus = calcStatus(stage, winningOutcome, hasPassedExpiryDate);
  return isScreenHeader
    ? (
      <View style={{...styles.stateCard, ...{backgroundColor: headerStatus.darkColor, paddingHorizontal: 50}}}>
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
  stage: string,
  winningOutcome: number,
  hasPassedExpiryDate: bool,
  closingAt: number,
  isScreenHeader: bool,
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
