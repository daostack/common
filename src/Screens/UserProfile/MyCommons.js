import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
  FlatList,
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {inject, observer} from 'mobx-react';
import CommonBox from '~/Components/CommonBox';
import {layout, colors, text, font, sizeS} from '~/Theme';
import {CommonActions} from '@react-navigation/native';
import {object, shape, func, array} from 'prop-types';

const MyCommons = ({navigation, daoStore, userStore}) => {
  const onScreenScroll = (event) => {
    navigation.setOptions({
      title:
        event.nativeEvent.contentOffset.y > 75 ? 'My Commons' : 'My Profile',
    });
  };

  const navigateToCommon = (common) => {
    const navigate = CommonActions.navigate({
      name: 'CommonProfile',
      params: {
        currCommon: common,
      },
    });
    navigation.dispatch(navigate);
  };

  const renderCommonCard = (dao, i) => (
    <CommonBox
      image={dao.image}
      common={dao}
      key={i}
      width="100%"
      navigation={navigation}
      onPress={() => navigateToCommon(dao)}
    />
  );

  const AllCommonsList = (daos) => (
    <View style={{flex: 1, padding: 20}}>
      <FlatList
        data={daos}
        renderItem={({item, i}) => renderCommonCard(item, i, navigation)}
      />
    </View>
  );

  const myDaos = (daoList) =>
    daoList.filter((dao) => userStore.isDaoMember(dao?.members));

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
            <Text style={styles.title}>My Commons</Text>
          </View>
          <View style={styles.sectionTabView}>
            {AllCommonsList(myDaos(daoStore.daos))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

MyCommons.propTypes = {
  navigation: object,
  daoStore: shape({
    setDao: func,
    daos: array,
  }),
  userStore: shape({
    isDaoMember: func,
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

export default inject('daoStore', 'userStore')(observer(MyCommons));
