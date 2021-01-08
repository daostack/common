import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {CommonActions} from '@react-navigation/native';
import CommonCover from './Commons/CommonCover';
import CommonStageSummary from './Commons/CommonStageSummary';
import {string, object, number, func, shape, array} from 'prop-types';

const CommonBox = ({
  common,
  onPress,
  width = '100%',
  navigation,
  headerHeightLayouted,
}) => (
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
        cover: common.image,
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
        members: common?.members?.length,
        // TODO: get this value. Is it even tracked in the contract? need to check.
        raised: common.raised,
        currentBudget: common.balance,
      }}
    />
  </TouchableOpacity>
);

CommonBox.propTypes = {
  common: shape({
    image: string,
    logo: string,
    name: string,
    metadata: object,
    fundingGoalDeadline: number,
    numberOfBoostedProposals: number,
    numberOfPreBoostedProposals: number,
    numberOfQueuedProposals: number,
    fundingGoal: number,
    members: array,
    balance: number,
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
