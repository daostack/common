import React, {useState} from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
  FlatList,
  Dimensions,
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import { inject, observer } from 'mobx-react';
import CommonBox from '../../Components/CommonBox';
import {layout, colors, text, sizeS} from '../../Theme';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';

const getTabName = (objectName, count) => {
  return `${objectName} (${count ? count : 0})`;
};

const MyCommons = ({navigation, daoStore, userStore}) => {
  const [index, setIndex] = useState(0);
  const usersDaos = daoStore.daos.filter((dao) => userStore.isDaoMember(dao.members));
  const routes = [
    { key: 'all', title: getTabName('All', daoStore.daos.length) },
    { key: 'members', title: getTabName('Members', usersDaos.length) },
  ];

  const setDao = dao => {
    daoStore.setDao(dao);
  };

  const renderCommonCard = (dao, i) =>
    <CommonBox
      image={dao.coverPhoto}
      common={dao}
      key={i}
      navigation={navigation}
      onPress={() => setDao(dao)}
    />;

  const AllCommonsList = (daos) => (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={daos}
        renderItem={({ item, i }) => renderCommonCard(item, i, navigation)}
      />
    </View>
  );

  const MyCommonsList = () => {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <FlatList
          data={usersDaos}
          renderItem={({ item, i }) => renderCommonCard(item, i)}
        />
      </View>
    );
  };

  const initialLayout = {width: Dimensions.get('window').width};

  const renderScene = SceneMap({
    all: React.memo(() => AllCommonsList(daoStore.daos)),
    members: React.memo(() => MyCommonsList(usersDaos)),
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
              style={{}}
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


export default inject(
  'daoStore',
  'userStore',
)(observer(MyCommons));
