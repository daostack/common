import React,  {useEffect} from 'react';

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
import {layout, colors, text, font,sizeS} from '../../Theme';
import {TabView, SceneMap} from 'react-native-tab-view';
import ProposalsList from '../../Screens/Proposals/ProposalsList';
import { inject, observer } from 'mobx-react';
import  ProposalService  from '../../Services/ProposalService';
import CommonTabBar from '../CommonTabBar';

const MyProposals = ({navigation, userStore}) => {
  const [index, setIndex] = React.useState(0);
  const [stats, setStats] = React.useState({ all: 0, active: 0, history: 0 });

  useEffect(() => {
    const getStats = async () => {
      const userProposalsStats = await ProposalService.getInstance().getUserProposalsCounts(userStore.userInfo.uid);
      setStats({ ...userProposalsStats });
    };
    getStats();
  }, [userStore.userInfo.uid]);

  const routes = [{key: 'all', title: `All (${stats.all})`},
    { key: 'active', title: `Active (${stats.active})`},
    { key: 'history', title: `History (${stats.history})`}];

  const AllProposals = () => {
    return SceneRenderer(0);
  };

  const ActiveProposals = () => {
    return SceneRenderer(1);
  };

  const HistoryProposals = () => {
    return SceneRenderer(2);
  };

  const SceneRenderer = sceneIndex => {
    return (
      <View style={{ flex: 1, marginTop: 40, paddingHorizontal: 20}}>
        <ProposalsList
          navigation={navigation}
          safeAddress={userStore.userInfo.safeAddress}
          showAll={sceneIndex === 0 ? true : false}
          isHistory={sceneIndex === 2 ? true : false}
        />
      </View>
    );

  };

  const initialLayout = {width: Dimensions.get('window').width};

  const renderScene = SceneMap({
    all: AllProposals,
    active: ActiveProposals,
    history: HistoryProposals,
  });

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          vertical={true}
          nestedScrollEnabled={true}
          directionalLockEnabled={true}>
          <View style={styles.sectionContainer}>
            <Text style={styles.title}>My proposals</Text>
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
    backgroundColor: Colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
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

export default inject(
  'userStore',
)(observer(MyProposals));
