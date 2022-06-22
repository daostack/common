import {observer} from 'mobx-react';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Icon from '~/Assets/iconfont/Icon';
import {FLAGS} from '~/Components/Moderation/constants';
import {Reported} from '~/Components/Moderation/Reported';
import ProposalCountDown from '~/Components/Proposals/ProposalCountDown';
import {PROPOSAL_STAGE} from '~/Services/ProposalService';
import {colors, font, layout, sizeM, sizeS, sizeXS, text} from '~/Theme';
import {useStore} from '~/Util/hooks/useStore';

const TITLES = {
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  NEW: 'New',
  COUNTDOWN: 'Countdown',
  PAYMENT_FAILED: 'Payment Failed',
  PAYMENT_PENDING: 'Pending Payment',
  INSUFFICIENT_BALANCE: 'Insufficient Balance',
};

const calcStatus = (state, isScreenHeader, paymentStatus) => {
  let status = {
    opacity: 1,
  };

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
    status.icon = 'clock';
    status.opacity = 0.2;
  }
  return status;
};

interface HeaderProps {
  state: string;
  closingAt: number;
  isScreenHeader: boolean;
  paymentStatus: string;
  onPress: () => void;
  isReported: boolean;
  moderation: object;
  reporter: object;
  hasPermission: string;
  viewerPermission: string;
  showCard: boolean;
}

export const ProposalCardHeader = observer(
  ({
    state,
    closingAt,
    isScreenHeader = false,
    paymentStatus,
    onPress,
    isReported,
    moderation,
    reporter,
    hasPermission,
    viewerPermission,
    showCard,
  }: HeaderProps) => {
    const rootStore = useStore('rootStore');
    const authStore = rootStore.authStore;
    const headerStatus = calcStatus(state, isScreenHeader, paymentStatus);
    const showCountdown =
      !moderation?.flag ||
      moderation?.flag === FLAGS.visible ||
      (moderation?.flag !== FLAGS.hidden &&
        moderation?.flag === FLAGS.reported);

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
            style={[
              styles.stateIcon,
              {left: headerStatus.text === TITLES.COUNTDOWN ? 30 : sizeS},
            ]}
            name={headerStatus.icon}
            color={colors.white}
          />

          {headerStatus.text !== TITLES.COUNTDOWN && (
            <Text style={{...styles.stateText}}>{headerStatus.text}</Text>
          )}

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
                flexDirection:
                  moderation?.flag === FLAGS.reported ? 'column' : 'row',
              }
            : {
                ...styles.hiddenCardHeader,
                justifyContent: !showCountdown ? 'space-between' : 'center',
                borderRadius: hasPermission ? 20 : 5,
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
            currentUID={authStore?.userInfo?.uid}
            viewerPermission={viewerPermission}
            showCard={showCard}
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
  },
);

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
    minHeight: 42,
  },
  hiddenCardHeader: {
    ...layout.flexRow,
    alignItems: 'center',
    backgroundColor: colors.blueGray,
    paddingHorizontal: sizeM,
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
  },
  rightIcon: {
    position: 'absolute',
    right: sizeS,
  },
});
