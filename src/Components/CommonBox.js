import {StyleSheet, Platform, TouchableOpacity} from 'react-native';
import React from 'react';
import {numberFormatter} from '../Util';
import {CommonActions} from '@react-navigation/native';
import CommonCover from './Commons/CommonCover';
import CommonStageSummary from './Commons/CommonStageSummary';

const CommonBox = props => {
  return (
    <TouchableOpacity
      key={props.key}
      onPress={() => {
        props.onPress();
        const navigate = CommonActions.navigate({
          name: 'CommonProfile',
          params: {
            currCommon: props.common,
          },
        });
        props.navigation.dispatch(navigate);
      }}
      style={[styles.commonBox, {width: Platform.OS === 'ios' ? '100%' : props.width }]}
      onLayout={ event => {
        if (props.headerHeightLayouted) {
          props.headerHeightLayouted(event.nativeEvent.layout.height);
        }
      }}>
      <CommonCover
        isMember={false}
        commonInfo={{
          cover: props.common.coverPhoto,
          logo: props.common.logo,
          name: props.common.name,
          description: props.common.metadata?.byline,
        }}
      />

      <CommonStageSummary
        isCommonCard={true}
        commonProgressInfo={{
          time: props.common.fundingGoalDeadline,
          activeProposals:
            props.common.numberOfBoostedProposals +
            props.common.numberOfPreBoostedProposals +
            props.common.numberOfQueuedProposals,
          goal: props.common.fundingGoal,
          members: props.common.memberCount * 1,
          // TODO: get this value. Is it even tracked in the contract? need to check.
          raised: props.common.balance,
          currentBudget: numberFormatter(
            // TODO: get the actual balance of the DAO: https://daostack1.atlassian.net/browse/CM-331
            props.common.tokenTotalSupply,
          ).toLocaleString(),
        }}
      />
    </TouchableOpacity>
  );
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
