import React, {useState} from 'react';

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
import {
  MY_DAOS_SUBSCRIPTION,
  ALL_DAOS_SUBSCRIPTION,
} from '../GrapthSubscriptions';
import {Query} from 'react-apollo';

const getTabName = (objectName, count) => {
  return `${objectName} (${count ? count : 0})`;
};

const MyCommons = ({navigation}) => {
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    {key: 'all', title: getTabName('All')},
    {key: 'members', title: getTabName('Members')},
  ]);

  const AllCommonsList = () => {
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
          tmpRoutes[0].title = getTabName('All', data.daos.length);

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

  const MyCommonsList = () => {
    return (
      <Query
        query={MY_DAOS_SUBSCRIPTION()}
        variables={{address: '0xbe5cf9a0408d22cdd61f8990b33dd00a5272f65b'}}>
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

          let tmpRoutes = routes;
          tmpRoutes[1].title = getTabName(
            'Members',
            data.reputationHolders.length,
          );
          setRoutes(tmpRoutes);

          return (
            <View style={layout.marginTopL}>
              {data.reputationHolders.map((currHolder, i) => {
                return (
                  <CommonBox
                    image={`https://i.picsum.photos/id/${i * 10}/500/100.jpg`}
                    common={currHolder.dao}
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
    all: AllCommonsList,
    members: MyCommonsList,
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
            <Text style={text.h2Black}>My Commons</Text>
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
    color: colors.black,
  },
  tabStyle: {
    ...text.ashleyjquimbacom2,
    fontWeight: 'bold',
  },
});

export default MyCommons;
