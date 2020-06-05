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

import CommonBox from '../../Components/CommonBox';
import Loader from '../../Components/Loader';
import {layout, colors, text, sizeS} from '../../Theme';

import {TabView, TabBar, SceneMap} from 'react-native-tab-view';

import {Query} from 'react-apollo';

import {ALL_DAOS_SUBSCRIPTION} from '../../GrapthSubscriptions';

const getTabName = (objectName, count) => {
  return `${objectName} (${count ? count : 0})`;
};

const MyProposals = ({navigation}) => {
  const [index, setIndex] = React.useState(0);
  const [routes, setRoutes] = React.useState([
    {key: 'all', title: 'All (0)'},
    {key: 'active', title: 'Active (0)'},
    {key: 'history', title: 'History (0) '},
  ]);

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
      <Query query={ALL_DAOS_SUBSCRIPTION()}>
        {({loading, error, data}) => {
          if (error) {
            return <Text>ERROR! ${error}</Text>;
          }

          if (loading) {
            return <Loader />;
          }

          let tmpRoutes = routes;
          tmpRoutes[sceneIndex].title = getTabName('All', data.daos.length);

          setRoutes(tmpRoutes);

          return (
            <View style={layout.marginTopL}>
              {data.daos.map((dao, i) => {
                return (
                  <CommonBox
                    image={`https://i.picsum.photos/id/${i * 10}/500/100.jpg`}
                    common={dao}
                    key={i}
                    navigation={navigation}
                  />
                );
              })}
            </View>
          );
        }}
      </Query>
    );
  };

  const initialLayout = {width: Dimensions.get('window').width};

  const renderScene = SceneMap({
    all: AllProposals,
    active: ActiveProposals,
    history: HistoryProposals,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: colors.black,
      }}
      renderLabel={({route, focused, color}) => {
        return (
          <Text style={focused ? styles.tabStyleActive : styles.tabStyle}>
            {route.title}
          </Text>
        );
      }}
      style={{backgroundColor: colors.white}}
      tabStyle={{width: 'auto'}}
    />
  );
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
            <Text style={text.h2Black}>My proposals</Text>
          </View>

          <View style={styles.sectionTabView}>
            <TabView
              navigationState={{index, routes}}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={initialLayout}
              renderTabBar={renderTabBar}
              style={{paddingHorizontal: 20}}
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
  sectionTabView: {},
  sectionContainer: {
    ...layout.content,
    marginVertical: sizeS,
    alignItems: 'flex-start',
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

export default MyProposals;
