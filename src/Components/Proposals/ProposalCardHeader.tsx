import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {text, layout, colors, sizeXS, sizeS, font, sizeM} from '~/Theme';
import Icon, {IconNames} from '~/Assets/iconfont/Icon';
import {PROPOSAL_STAGE} from '~/Services/ProposalService';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {observer, inject} from 'mobx-react';
import {Reported} from '~/Components/Moderation/Reported';
import {FLAGS} from '~/Components/Moderation/constants';
import {PERMISSIONS} from '~/Types';
import ProposalCountDown from '~/Components/Proposals/ProposalCountDown';
import {PaymentStatus} from '~/Types/EntityTypes/IPaymentEntity';
import {ValueOf} from '~/Types';
import {Proposal} from '~/Stores/Models';

const TITLES = {
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  NEW: 'New',
  COUNTDOWN: 'Countdown',
  PAYMENT_FAILED: 'Payment Failed',
  PAYMENT_PENDING: 'Pending Payment',
  INSUFFICIENT_BALANCE: 'Insufficient Balance',
};

interface Status {
  opacity: number;
  text: ValueOf<typeof TITLES>;
  lightColor: string;
  darkColor: string;
  icon: IconNames;
}

export const ProposalCardHeader: React.FC<{
  proposal: Proposal;
  isScreenHeader: boolean;
}> = observer(({proposal, isScreenHeader = false}) => {
  // state={proposal?.state}
  // paymentStatus={proposal?.paymentState}
  // closingAt={
  //   (proposal?.moderation?.updatedAt.seconds ||
  //     proposal?.createdAt.seconds) + proposal?.countdownPeriod
  // }
  // isReported={proposal.moderation?.flag !== FLAGS.visible}
  // moderation={proposal.moderation}
  // reporter={getReporter()}
  // hasPermission={hasPermission}
  // viewerPermission={viewerPermission}

  const headerStatus = calcStatus(
    proposal.state,
    isScreenHeader,
    proposal.paymentState,
  );
  const showCountdown =
    !moderation?.flag ||
    moderation?.flag === FLAGS.visible ||
    (moderation?.flag !== FLAGS.hidden &&
      moderation?.flag === FLAGS.reported &&
      viewerPermission !== PERMISSIONS.MODERATOR);

  return isScreenHeader ? (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          ...styles.stateCard,
          ...{
            backgroundColor: headerStatus.darkColor,
            paddingHorizontal: 50,
          },
        }}>
        <Icon
          style={styles.stateIcon}
          name={headerStatus.icon}
          color={colors.white}
        />

        <Text style={{...styles.stateText}}>{headerStatus.text}</Text>

        {headerStatus.text === TITLES.COUNTDOWN && (
          <ProposalCountDown closingAt={closingAt} />
        )}

        {headerStatus.text === TITLES.INSUFFICIENT_BALANCE && (
          <Icon
            style={styles.rightIcon}
            name={'questionMark'}
            color={colors.white}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  ) : (
    <View
      style={
        showCountdown
          ? {
              ...styles.proposalCardHeader,
              backgroundColor: headerStatus.lightColor,
            }
          : {
              ...styles.hiddenCardHeader,
              justifyContent: !showCountdown ? 'space-between' : 'center',
              borderTopLeftRadius: hasPermission ? 20 : 5,
              borderTopRightRadius: hasPermission ? 20 : 5,
            }
      }>
      {showCountdown && (
        <View style={{flexDirection: 'row'}}>
          <Icon
            name={headerStatus.icon}
            color={headerStatus.darkColor}
            size={16}
          />
          <Text
            style={{
              ...text.orangeSmallBold,
              marginHorizontal: 5,
              color: headerStatus.darkColor,
            }}>
            {headerStatus.text}
          </Text>
        </View>
      )}
      {isReported && !!moderation && (
        <Reported
          moderation={moderation}
          reporter={reporter}
          viewerPermission={viewerPermission}
        />
      )}
      {!showCountdown && (
        <Icon
          name="questionMark"
          size={16}
          style={{padding: 10}}
          color={colors.blueGray1}
        />
      )}
    </View>
  );
});

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
  hiddenCardHeader: {
    ...layout.flexRow,
    alignItems: 'center',
    backgroundColor: colors.blueGray,
    paddingHorizontal: sizeM,
    height: 35,
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
  rightIcon: {
    position: 'absolute',
    right: sizeS,
  },
});

const calcStatus = (
  state: keyof typeof PROPOSAL_STAGE,
  isScreenHeader: boolean,
  paymentStatus: PaymentStatus,
): Status => {
  const status: Status = {
    opacity: 1,
  } as Status;

  if (state === PROPOSAL_STAGE.passed) {
    if (paymentStatus === 'confirmed') {
      status.text = TITLES.APPROVED;
      status.lightColor = colors.lightGreen;
      status.darkColor = colors.lightishGreen;
      status.icon = 'approved';
    } else if (
      paymentStatus === 'notAttempted' ||
      paymentStatus === 'pending'
    ) {
      status.text = TITLES.PAYMENT_PENDING;
      status.lightColor = colors.lightGreen;
      status.darkColor = colors.lightishGreen;
      status.icon = 'explanation1';
    } else if (paymentStatus === 'failed') {
      status.text = TITLES.PAYMENT_FAILED;
      status.lightColor = colors.redLightish;
      status.darkColor = colors.error;
      status.icon = 'declined';
    } else {
      // Here will land all proposals without payment statuses, that are approved

      status.text = TITLES.APPROVED;
      status.lightColor = colors.lightGreen;
      status.darkColor = colors.lightishGreen;
      status.icon = 'approved';
    }
  } else if (state === PROPOSAL_STAGE.failed) {
    status.text = TITLES.REJECTED;
    status.lightColor = colors.redLightish;
    status.darkColor = colors.error;
    status.icon = 'declined';
  } else if (state === PROPOSAL_STAGE.passedInsufficientBalance) {
    status.text = TITLES.INSUFFICIENT_BALANCE;
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
