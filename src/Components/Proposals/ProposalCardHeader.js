import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {text, layout, colors, sizeXS} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import { LAUNCHED_STATES, COUNTDOWN_STATES, PROPOSAL_STAGE } from '../../Services/ProposalService';

const calcIcon = (stage, winningOutcome) => {
  if (LAUNCHED_STATES.includes(stage)) {
    return 'boosted';
  }
  if (COUNTDOWN_STATES.includes(stage)) {
    return 'clcok-16';
  }
};

const calcText = (stage, winningOutcome) => {
  if (LAUNCHED_STATES.includes(stage)) {
    return 'Launched';
  }
  if (COUNTDOWN_STATES.includes(stage)) {
    return 'Countdown';
  }

  if (stage === PROPOSAL_STAGE.Executed) {
    return winningOutcome === 1 ?  'Passed' : 'Failed';
  }

  if (stage === PROPOSAL_STAGE.ExpiredInQueue) {
    return 'Failed';
  }
};


const ProposalCardHeader = ({isBoosted, openBoostedInfo, stage, winningOutcome}) => {


  let iconColor = colors.mainBlue;

  return (
    <View style={styles.proposalCardHeader}>
      <Icon name={calcIcon(stage, winningOutcome)} color={iconColor} size={16} />
      <Text style={{...text.orangeSmallBold, ...{marginHorizontal: 5}}}>
        {calcText(stage, winningOutcome)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  proposalCardHeader: {
    ...layout.content,
    ...layout.flexRow,
    alignSelf: 'stretch',
    backgroundColor: colors.orangeLight,
    padding: sizeXS,
  },
  launchedColor: {
    color: colors.mainBlue,
  },
  countdownColor: {
    color: colors.countdown,
  },
});

export default ProposalCardHeader;
