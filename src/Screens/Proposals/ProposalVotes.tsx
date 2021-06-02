import React, {FC, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Dimensions,
} from 'react-native';
import {layout, font, colors, text, sizeS} from '~/Theme';
import {TabView, SceneRendererProps} from 'react-native-tab-view';
import {observer, inject} from 'mobx-react';
import CommonTabBar from '~/Screens/CommonTabBar';
import ProposalsVotesList from '~/Components/Proposals/Votes/ProposalVotesList';
import {NavigationProps} from '~/Types/navigation';
import RootStore from '~/Stores/RootStore';
import {IProposalVote} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';

const initialLayout = {width: Dimensions.get('window').width};
const getTabName = (objectName: string, count: number) =>
  `${objectName} (${count ? count : 0})`;

type Props = {
  navigation: NavigationProps;
  route: {
    params: {
      proposalId: string;
      commonId: string;
    };
  };
  rootStore: RootStore;
};

type TabRoute = {
  key: string;
  title: string;
};

type RenderSceneProps = SceneRendererProps & {
  route: TabRoute;
};

const ProposalVotes: FC<Props> = ({navigation, route: router, rootStore}) => {
  const [index, setIndex] = useState(0);
  const [voteItems, setVoteItems] = useState<{
    all: IProposalVote[];
    approved: IProposalVote[];
    rejected: IProposalVote[];
  }>({
    all: [],
    approved: [],
    rejected: [],
  });

  const proposalStore = rootStore.proposalStore;
  const {proposalId, commonId} = router.params;
  const proposalInfo = proposalStore.getProposalById(proposalId);

  useEffect(() => {
    if (proposalInfo && proposalInfo.votes) {
      const votesItems = proposalInfo.votes.reverse();

      setVoteItems({
        all: votesItems,
        approved: votesItems.filter((v) => v.voteOutcome === 'approved'),
        rejected: votesItems.filter((v) => v.voteOutcome === 'rejected'),
      });
    }
  }, [proposalInfo]);

  const routes: TabRoute[] = [
    {
      key: 'all',
      title: getTabName('All', voteItems.all.length),
    },
    {key: 'approved', title: getTabName('Approved', voteItems.approved.length)},
    {key: 'rejected', title: getTabName('Rejected', voteItems.rejected.length)},
  ];

  const renderScene = ({route}: RenderSceneProps) => {
    switch (route.key) {
      case 'all':
        return (
          <ProposalsVotesList
            navigation={navigation}
            commonId={commonId}
            list={voteItems.all}
          />
        );
      case 'approved':
        return (
          <ProposalsVotesList
            navigation={navigation}
            commonId={commonId}
            list={voteItems.approved}
          />
        );
      case 'rejected':
        return (
          <ProposalsVotesList
            navigation={navigation}
            commonId={commonId}
            list={voteItems.rejected}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          nestedScrollEnabled={true}
          directionalLockEnabled={true}>
          <View style={styles.sectionContainer}>
            <Text style={styles.title}>Votes</Text>
          </View>

          <View style={styles.sectionTabView}>
            <TabView
              navigationState={{index, routes}}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={initialLayout}
              renderTabBar={CommonTabBar}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  sectionTabView: {},
  sectionContainer: {
    ...layout.content,
    marginVertical: sizeS,
    alignItems: 'center',
  },
  title: {
    ...font.heading.bold,
    ...font.fontSize(5),
  },
  tabStyleActive: {
    ...text.ashleyjquimbacom2,
    color: colors.black,
    fontWeight: 'bold',
  },
  tabStyle: {
    ...text.ashleyjquimbacom2,
    fontWeight: 'bold',
  },
});

export default inject('rootStore')(observer(ProposalVotes));
