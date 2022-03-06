import React from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {layout, colors, text, font, sizeS} from '~/Theme';
import {TabView} from 'react-native-tab-view';
import ProposalsList from '~/Screens/Proposals/ProposalsList';
import {inject, observer} from 'mobx-react';
import CommonTabBar from '../CommonTabBar';
import {bool, object, shape} from 'prop-types';
import {PROPOSAL_STAGE} from '~/Config';
import {isTypeFilterJoin} from '~/Stores/DataStores/ProposalStore';
import {rootStorePropTypes} from '~/Types/propTypes';

const MyProposals = ({
  navigation,
  route: {
    params: {proposalTypeFilter},
  },
  rootStore,
}) => {
  const authStore = rootStore.authStore;
  const proposalStore = rootStore.proposalStore;

  const [index, setIndex] = React.useState(0);

  const activeProposalsCount = proposalStore.getUserProposals(
    authStore.userInfo.uid,
    {
      stage: PROPOSAL_STAGE.Active,
      type: proposalTypeFilter,
    },
  ).length;

  const historyProposalsCount = proposalStore.getUserProposals(
    authStore.userInfo.uid,
    {
      stage: PROPOSAL_STAGE.History,
      type: proposalTypeFilter,
    },
  ).length;

  const routes = [
    {
      key: 'all',
      title: `All (${activeProposalsCount + historyProposalsCount})`,
    },
    {
      key: 'active',
      title: `Active (${activeProposalsCount})`,
    },
    {
      key: 'history',
      title: `History (${historyProposalsCount})`,
    },
  ];

  const SceneRenderer = (sceneIndex) => (
    <ProposalsList
      flatListStyle={styles.proposalsList}
      navigation={navigation}
      userInfo={{
        id: authStore.userInfo.uid,
      }}
      proposalFilter={
        sceneIndex === 0
          ? {
              stage: [PROPOSAL_STAGE.History, PROPOSAL_STAGE.Active],
              type: proposalTypeFilter,
            }
          : {
              stage:
                sceneIndex === 2
                  ? PROPOSAL_STAGE.History
                  : PROPOSAL_STAGE.Active,
              type: proposalTypeFilter,
            }
      }
      isMember
    />
  );

  const initialLayout = {width: Dimensions.get('window').width};

  const renderScene = React.useCallback(({route}) => {
    switch (route.key) {
      case 'all':
        return SceneRenderer(0);
      case 'active':
        return SceneRenderer(1);
      case 'history':
        return SceneRenderer(2);
    }
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>
            My{' '}
            {isTypeFilterJoin(proposalTypeFilter)
              ? 'membership requests'
              : 'proposals'}
          </Text>
        </View>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={CommonTabBar}
        />
      </SafeAreaView>
    </>
  );
};

MyProposals.propTypes = {
  route: shape({
    params: shape({
      onlyMembershipRequests: bool,
      onlyFundingRequests: bool,
    }),
  }),
  navigation: object,
  rootStore: rootStorePropTypes.isRequired,
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  proposalsList: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    ...font.heading.bold,
    ...font.fontSize(4),
  },
  sectionTabView: {},
  sectionContainer: {
    ...layout.content,
    marginVertical: sizeS,
    alignItems: 'center',
  },

  tabStyleActive: {
    ...text.ashleyjquimbacom2,
    fontWeight: 'bold',
    color: colors.black,
  },
  tabStyle: {
    ...text.ashleyjquimbacom2,
    fontWeight: 'bold',
  },
});

export default inject('rootStore')(observer(MyProposals));
