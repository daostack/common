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

import CommonBox from '../Components/CommonBox';
import Loader from '../Components/Loader';
import {layout, colors, text, sizeS} from '../Theme';

import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import {DAOS_SUBSCRIPTION} from '../GrapthSubscriptions';
import {Query} from 'react-apollo';

const MyProposals = ({navigation}) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'all', title: 'All (14)'},
    {key: 'active', title: 'Active (8)'},
    {key: 'history', title: 'History (2) '},
  ]);

  const SceneRenderer = () => {
    return (
      <Query query={DAOS_SUBSCRIPTION}>
        {({loading, error, data}) => {
          console.log('Query -> ', loading, error, data);

          if (error) {
            console.log('Error -> ', error);
            return <Text>ERROR!</Text>;
          }

          if (loading) {
            console.log('Loading... -> ');
            return <Loader />;
          }

          return (
            <View style={layout.marginTopL}>
              {data.daos.map((dao, i) => {
                if (
                  ''.length > 0 &&
                  !dao.name.toLowerCase().includes(''.toLowerCase())
                ) {
                  return;
                }
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
    all: SceneRenderer,
    active: SceneRenderer,
    history: SceneRenderer,
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
