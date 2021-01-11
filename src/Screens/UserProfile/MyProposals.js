import React, {useEffect} from 'react';

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
import ProposalService from '~/Services/ProposalService';
import CommonTabBar from '../CommonTabBar';
import {bool, object, shape} from 'prop-types';

const MyProposals = ({
  navigation,
  userStore,
  route: {
    params: {onlyMembershipRequests, onlyFundingRequests},
  },
}) => {
  const [index, setIndex] = React.useState(0);
  const [stats, setStats] = React.useState({all: 0, active: 0, history: 0});

  useEffect(() => {
    const getStats = async () => {
      const userProposalsStats = await ProposalService.getInstance().getUserProposalsCounts(
        userStore.userInfo.uid,
        onlyMembershipRequests,
        onlyFundingRequests,
      );
      setStats({...userProposalsStats});
    };
    getStats();
  }, [userStore.userInfo.uid]);

  const onScreenScroll = (event) => {
    navigation.setOptions({
      title:
        event.nativeEvent.contentOffset.y > 75
          ? onlyMembershipRequests
            ? 'My membership requests'
            : 'My Proposals'
          : 'My Profile',
    });
  };

  const routes = [
    {
      key: 'active',
      title: `Active (${stats.active})`,
    },
    {
      key: 'history',
      title: `History (${stats.history})`,
    },
  ];

  const ActiveProposals = () => SceneRenderer(1);

  const HistoryProposals = () => SceneRenderer(2);

  const SceneRenderer = (sceneIndex) => (
    <View style={{flex: 1, marginTop: 40, paddingHorizontal: 20}}>
      <ProposalsList
        userId={userStore.userInfo.uid}
        membershipRequests={onlyMembershipRequests}
        onlyFundingRequests={onlyFundingRequests}
        isHistory={sceneIndex === 2}
        navigation={navigation}
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
              My {onlyMembershipRequests ? 'membership requests' : 'proposals'}
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
  userStore: object,
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

export default inject('userStore')(observer(MyProposals));
