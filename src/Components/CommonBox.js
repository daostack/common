import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {numberFormatter} from '~/Util';
import {CommonActions} from '@react-navigation/native';
import CommonCover from './Commons/CommonCover';
import CommonStageSummary from './Commons/CommonStageSummary';
import {string, object, number, func, shape} from 'prop-types';

const CommonBox = ({common, onPress, width = '100%', navigation, headerHeightLayouted}) => (
  <TouchableOpacity
    onPress={() => {
      onPress();
      const navigate = CommonActions.navigate({
        name: 'CommonProfile',
        params: {
          currCommon: common,
        },
      });
      navigation.dispatch(navigate);
    }}
    style={[styles.commonBox, {width}]}
    onLayout={(event) => {
      if (headerHeightLayouted) {
        headerHeightLayouted(event.nativeEvent.layout.height);
      }
    }}>
    <CommonCover
      isMember={false}
      commonInfo={{
        cover: common.coverPhoto,
        logo: common.logo,
        name: common.name,
        description: common.metadata?.byline,
      }}
      common={common}
    />

    <CommonStageSummary
      isCommonCard={true}
      commonProgressInfo={{
        time: common.fundingGoalDeadline,
        activeProposals:
          common.numberOfBoostedProposals +
          common.numberOfPreBoostedProposals +
          common.numberOfQueuedProposals,
        goal: common.fundingGoal,
        members: common.memberCount * 1,
        // TODO: get this value. Is it even tracked in the contract? need to check.
        raised: common.metadata?.totalRaised || common.balance,
        currentBudget: numberFormatter(
          // TODO: get the actual balance of the DAO: https://daostack1.atlassian.net/browse/CM-331
          common.tokenTotalSupply,
        ),
      }}
    />
  </TouchableOpacity>
);

CommonBox.propTypes = {
  common: shape({
    coverPhoto: string,
    logo: string,
    name: string,
    metadata: object,
    fundingGoalDeadline: number,
    numberOfBoostedProposals: number,
    numberOfPreBoostedProposals: number,
    numberOfQueuedProposals: number,
    fundingGoal: number,
    memberCount: number,
    balance: string,
    tokenTotalSupply: string,
  }).isRequired,
  onPress: func.isRequired,
  width: string,
  navigation: object.isRequired,
  headerHeightLayouted: func,
};

const styles = StyleSheet.create({
  commonBox: {
    marginBottom: 20,
    borderRadius: 26,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 26, 54, 0.08)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 4,
  },
});

export default CommonBox;
