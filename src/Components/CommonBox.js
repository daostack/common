import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
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
            commonId: props.common.id,
          },
        });
        props.navigation.dispatch(navigate);
      }}
      style={styles.commonBox}>
      <CommonCover
        isMember={false}
        commonInfo={{
          cover: props.image,
          logo:
            'https://yf8pn4fsld-flywheel.netdna-ssl.com/wp-content/uploads/2017/11/logo-Placeholder.png',
          name: props.common.name,
          description: props.common.name,
        }}
      />

      <CommonStageSummary
        isFundingStage={true}
        commonProgressInfo={{
          time: 55,
          activeProposals: 55,
          goal: 55,
          members: props.common.reputationHoldersCount * 1.5,
          raised: 55,
          currentBudget: 55,
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
