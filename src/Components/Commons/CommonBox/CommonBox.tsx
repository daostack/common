import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {CommonActions, useNavigation} from '@react-navigation/native';
import CommonBoxImage from './CommonBoxImage';
import CommonBoxSummary from './CommonBoxSummary';
import {colors, font} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import {useStore} from '~/Util/hooks/useStore';
import {PROPOSAL_STAGE, PROPOSAL_TYPE} from '~/Config';
import {firebase} from '~/Firebase';

interface CommonBoxProps {
  common: {
    id: string;
    image: string;
    name: string;
    metadata: {
      byline: string;
    };
    fundingGoalDeadline: number;
    numberOfBoostedProposals: number;
    numberOfPreBoostedProposals: number;
    numberOfQueuedProposals: number;
    fundingGoal: number;
    members: [];
    balance: number;
    tokenTotalSupply: string;
    raised: number;
    reservedBalance: number;
    updatedAt: firebase.firestore.Timestamp;
  };
  onPress: () => void;
  width: string;
  headerHeightLayouted: (height: number) => void;
}

const CommonBox = ({
  common,
  onPress,
  width = '100%',
  headerHeightLayouted,
}: CommonBoxProps) => {
  const rootStore = useStore('rootStore');
  const navigation = useNavigation();
  const proposalFilter = {
    stage: PROPOSAL_STAGE.Active,
    type: PROPOSAL_TYPE.FundingRequest,
  };
  const proposalsCount = rootStore.proposalStore.getCommonProposals(
    common.id,
    proposalFilter,
  )?.length;
  const discussionsCount = rootStore.discussionStore.getCommonDiscussions(
    common.id,
  )?.length;

  return (
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
      <CommonBoxImage
        cover={common.image}
        name={common.name}
        description={common.metadata?.byline}
        updatedAt={common.updatedAt}
      />

      <CommonBoxSummary
        members={common?.members?.length}
        raised={common.raised}
        balance={common.balance}
      />

      <View style={styles.bottomBar}>
        <View style={styles.bottomBarItem}>
          <Icon name={'proposal'} size={25} />
          <Text style={styles.bottomBarText}>{proposalsCount}</Text>
        </View>
        <View style={styles.bottomBarItem}>
          <Icon name={'discussion'} size={25} />
          <Text style={styles.bottomBarText}>{discussionsCount}</Text>
        </View>
        <View style={styles.bottomBarItem}>
          <Image
            style={styles.messageImage}
            source={require('~/Assets/message.png')}
          />
          <Text style={styles.bottomBarText}>{proposalsCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  messageImage: {
    height: 16,
    width: 16,
  },
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
  bottomBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    width: '100%',
    height: 48,
    borderTopWidth: 1,
    borderTopColor: colors.grey4,
    paddingHorizontal: 10,
  },
  bottomBarItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomBarText: {
    ...font.primary.bold,
    color: colors.greySubtitle,
    marginLeft: 15,
    fontSize: 16,
  },
});

export default CommonBox;
