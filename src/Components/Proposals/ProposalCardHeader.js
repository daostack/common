import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {text, layout, colors, sizeXS, sizeS, font, sizeM} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import {string, number, bool, func, object} from 'prop-types';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {observer, inject} from 'mobx-react';
import {Reported} from '~/Components/Moderation/Reported';
import {FLAGS} from '~/Components/Moderation/constants';
import {rootStorePropTypes} from '~/Types/propTypes';
import {PERMISSIONS} from '~/Util/constants/permissions.enum';
import ProposalCountDown from '~/Components/Proposals/ProposalCountDown';

import {ProposalState} from '~/Graphql/Proposal';


const TITLES = {
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  COUNTDOWN: 'Countdown',
  PAYMENT_FAILED: 'Payment Failed',
  PAYMENT_PENDING: 'Pending Payment',
  INSUFFICIENT_BALANCE: 'Insufficient Balance',
};

const calcStatus = (state, isScreenHeader, paymentStatus) => {
  let status = {
    opacity: 1,
  };

  if (state === ProposalState.ACCEPTED) {
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
  } else if (state === ProposalState.REJECTED) {
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

const ProposalCardHeader = ({
  state,
  closingAt,
  isScreenHeader = false,
  paymentStatus,
  onPress,
  isReported,
  moderation,
  reporter,
  hasPermission,
  rootStore,
  viewerPermission,
}) => {
  const authStore = rootStore.authStore;
  const headerStatus = calcStatus(state, isScreenHeader, paymentStatus);
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
          currentUID={authStore?.userInfo?.uid}
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
};

ProposalCardHeader.propTypes = {
  state: string,
  closingAt: number,
  isScreenHeader: bool,
  paymentStatus: string,
  onPress: func,
  isReported: bool,
  moderation: object,
  reporter: object,
  hasPermission: string,
  rootStore: rootStorePropTypes.isRequired,
  viewerPermission: string,
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

export default inject('rootStore')(observer(ProposalCardHeader));
