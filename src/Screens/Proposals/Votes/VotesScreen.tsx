import {useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React, {useEffect, useCallback, useMemo, ReactElement} from 'react';
import {Dimensions, SafeAreaView, StatusBar, Text, View} from 'react-native';
import {TabView, Route} from 'react-native-tab-view';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import {VotesScreenRouteProps} from '~/Types/navigation';
import {VOTE_STATUSES, VOTE_TABS} from '~/Util/constants/votes';
import {useStore} from '~/Util/hooks/useStore';
import {styles} from './styles';
import {VotesList} from './VotesList';
import {VoteTabBar} from './VoteTabBar';

const initialLayout = {width: Dimensions.get('window').width};

const getTabName = (objectName: string, count: number): string => {
  return ` ${objectName} (${count ? count : 0}) `;
};
const VotesScreen = (): ReactElement => {
  const navigation = useNavigation();
  const navigationRoute = useRoute<VotesScreenRouteProps>();
  const proposalStore = useStore('proposalStore');
  const voteStore = useStore('voteStore');
  const {proposalId, commonName} = navigationRoute.params;
  const proposalInfo = proposalStore.getProposalById(proposalId);

  useEffect(() => {
    let unsubscribe: FirestoreUnsubscribeFn;
    if (proposalInfo?.id) {
      unsubscribe = voteStore.subscribeToProposalVotes(proposalInfo.id);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [proposalInfo]);

  useEffect(() => {
    navigation.setParams({
      title: commonName,
    });
  }, [commonName]);

  const routes = useMemo(
    () => [
      {
        index: 0,
        key: 'all',
        title: getTabName(VOTE_TABS.ALL, proposalInfo?.votes.total),
      },
      {
        index: 1,
        key: 'approved',
        title: getTabName(VOTE_TABS.APPROVED, proposalInfo?.votes.approved),
      },
      {
        index: 2,
        key: 'abstained',
        title: getTabName(VOTE_TABS.ABSTAINED, proposalInfo?.votes.abstained),
      },
      {
        index: 3,
        key: 'rejected',
        title: getTabName(VOTE_TABS.REJECTED, proposalInfo?.votes.rejected),
      },
    ],
    [proposalInfo?.votes],
  );

  const renderScene = useCallback(({route}: {route: Route}) => {
    switch (route.key) {
      case 'all':
        return <VotesList proposalId={proposalId} voteType="all" />;
      case 'approved':
        return (
          <VotesList
            proposalId={proposalId}
            voteType={VOTE_STATUSES.APPROVED}
          />
        );
      case 'abstained':
        return (
          <VotesList
            proposalId={proposalId}
            voteType={VOTE_STATUSES.ABSTAINED}
          />
        );
      case 'rejected':
        return (
          <VotesList
            proposalId={proposalId}
            voteType={VOTE_STATUSES.REJECTED}
          />
        );
    }
  }, []);

  const [index, setIndex] = React.useState(0);

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Votes</Text>
        </View>

        <View style={styles.sectionTabView}>
          <TabView
            lazy
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            renderTabBar={VoteTabBar}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default observer(VotesScreen);
