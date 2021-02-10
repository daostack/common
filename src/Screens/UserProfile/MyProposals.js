import React from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Dimensions,
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {layout, colors, text, font, sizeS} from '~/Theme';
import {TabView} from 'react-native-tab-view';
import ProposalsList from '~/Screens/Proposals/ProposalsList';
import {inject, observer} from 'mobx-react';
import CommonTabBar from '../CommonTabBar';
import {bool, object, shape, func} from 'prop-types';
import {PROPOSAL_STAGE} from '~/Config';
import {isTypeFilterJoin} from '~/Stores/DataStores/ProposalStore';

const MyProposals = ({
  navigation,
  authStore,
  proposalStore,
  route: {
    params: {proposalTypeFilter},
  },
}) => {
  const [index, setIndex] = React.useState(0);
  const onScreenScroll = (event) => {
    navigation.setOptions({
      title:
        event.nativeEvent.contentOffset.y > 75
          ? isTypeFilterJoin(proposalTypeFilter)
            ? 'My membership requests'
            : 'My Proposals'
          : 'My Profile',
    });
  };

  const routes = [
    {
      key: 'active',
      title: `Active (${
        proposalStore.getUserProposals(authStore.userInfo.uid, {
          stage: PROPOSAL_STAGE.Active,
          type: proposalTypeFilter,
        }).length
      })`,
    },
    {
      key: 'history',
      title: `History (${
        proposalStore.getUserProposals(authStore.userInfo.uid, {
          stage: PROPOSAL_STAGE.History,
          type: proposalTypeFilter,
        }).length
      })`,
    },
  ];

  const ActiveProposals = () => SceneRenderer(1);

  const HistoryProposals = () => SceneRenderer(2);

  const SceneRenderer = (sceneIndex) => (
    <View style={{flex: 1, marginTop: 40, paddingHorizontal: 20}}>
      <ProposalsList
        navigation={navigation}
        userInfo={{
          id: authStore.userInfo.uid,
        }}
        proposalFilter={{
          stage:
            sceneIndex === 2 ? PROPOSAL_STAGE.History : PROPOSAL_STAGE.Active,
          type: proposalTypeFilter,
        }}
      />
    </View>
  );

  const initialLayout = {width: Dimensions.get('window').width};

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'active':
        return ActiveProposals();
      case 'history':
        return HistoryProposals();
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          vertical={true}
          nestedScrollEnabled={true}
          directionalLockEnabled={true}
          onScroll={onScreenScroll}
          scrollEventThrottle={16}>
          <View style={styles.sectionContainer}>
            <Text style={styles.title}>
              My{' '}
              {isTypeFilterJoin(proposalTypeFilter)
                ? 'membership requests'
                : 'proposals'}
            </Text>
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

MyProposals.propTypes = {
  route: shape({
    params: shape({
      onlyMembershipRequests: bool,
      onlyFundingRequests: bool,
    }),
  }),
  navigation: object,
  authStore: object,
  proposalStore: shape({
    getUserProposals: func,
  }),
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

export default inject('authStore', 'proposalStore')(observer(MyProposals));
