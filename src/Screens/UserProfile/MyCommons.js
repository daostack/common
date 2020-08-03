import React, { useEffect, useState } from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
  FlatList,
  Dimensions, Animated
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import { inject, observer } from 'mobx-react';
import CommonBox from '../../Components/CommonBox';
import {layout, colors, text, font, sizeS} from '../../Theme';
import {TabView, SceneMap} from 'react-native-tab-view';

import CommonTabBar from '../CommonTabBar';

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

  const onScreenScroll = (event) => {
    navigation.setOptions({
      title: event.nativeEvent.contentOffset.y > 75 ? "My Commons" : "My Profile"
    });
  };

  const setDao = dao => {
    daoStore.setDao(dao);
  };

  const renderCommonCard = (dao, i) =>
    <CommonBox
      image={dao.coverPhoto}
      common={dao}
      key={i}
      width="100%"
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
          scrollEventThrottle={16}
        >
          <View style={styles.sectionContainer}>
            <Text style={styles.title}>My Commons</Text>
          </View>
          <View style={styles.sectionTabView}>
            <TabView
              navigationState={{index, routes}}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={initialLayout}
              renderTabBar={CommonTabBar}
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
    alignItems: 'center',
  },
  title: {
    ...font.heading.bold,
    ...font.fontSize(5),
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
