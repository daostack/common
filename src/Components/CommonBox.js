import {StyleSheet, TouchableOpacity} from 'react-native';
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
        const navigate = CommonActions.navigate({
          name: 'CommonProfile',
          params: {
            currCommon: props.common,
          },
        });
        props.navigation.dispatch(navigate);
      }}
      style={styles.commonBox}>
      <CommonCover
        isMember={false}
        commonInfo={{
          cover: props.common.coverPhoto,
          logo: props.common.logo,
          name: props.common.name,
          description: props.common.name,
        }}
      />

      <CommonStageSummary
        isFundingStage={true}
        commonProgressInfo={{
          time: 55,
          activeProposals:
            props.common.numberOfBoostedProposals +
            props.common.numberOfPreBoostedProposals +
            props.common.numberOfQueuedProposals,
          goal: 55,
          members: props.common.memberCount * 1,
          raised: 55,
          currentBudget: numberFormatter(
            props.common.tokenTotalSupply,
          ).toLocaleString(),
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  commonBox: {
    width: '100%',
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
  },
});

export default CommonBox;
