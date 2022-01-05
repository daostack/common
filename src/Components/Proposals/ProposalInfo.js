import React from 'react';
import {observer, inject} from 'mobx-react';
import {Text, StyleSheet, View} from 'react-native';
import {text, layout, colors, font} from '~/Theme';
import ProposalCardHeader from './ProposalCardHeader';
import {FLAGS} from '../Moderation/constants';
import {CurrencySymbols} from '~/Util/locale';

const ProposalInfo = ({proposalInfo}) => (
  <View style={[styles.proposalCard, {width: '100%', borderRadius: 20}]}>
    <ProposalCardHeader
      state={proposalInfo?.state}
      paymentStatus={proposalInfo?.paymentState}
      closingAt={
        (proposalInfo?.moderation?.updatedAt.seconds ||
          proposalInfo?.createdAt.seconds) + proposalInfo?.countdownPeriod
      }
      isReported={proposalInfo.moderation?.flag !== FLAGS.visible}
      moderation={proposalInfo.moderation && {...proposalInfo.moderation}}
    />

    <View style={styles.containerView}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{proposalInfo?.description?.title}</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {`${CurrencySymbols.SHEKEL}${
            proposalInfo?.fundingRequest?.amount / 100
          }`}
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  containerView: {
    alignContent: 'center',
    paddingTop: 0,
    paddingHorizontal: 7,
    ...layout.flexStart,
  },
  proposalCard: {
    ...layout.marginBottomL,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.grey4,
    shadowColor: 'rgba(0, 0, 0, 0.22)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    elevation: 4,
  },
  title: {
    ...text.h3Black,
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 16,
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
  },
});

export default inject('rootStore')(observer(ProposalInfo));
