import React from 'react';
import {
  Text,
  SafeAreaView,
  View,
  SectionList,
  StyleSheet,
  ScrollView,
  Image,
  RefreshControl,
} from 'react-native';
import {CommonBox, BottomRightButton} from '~/Components';
import {inject, observer} from 'mobx-react';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import {font, colors} from '~/Theme';
import {object} from 'prop-types';

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import {CommonActions} from '@react-navigation/native';

const groupTitle = (title, arrLength) =>
  arrLength > 0 ? `${title} (${arrLength})` : '';

const CommonsList = ({
  navigation,
  bottomSheetStore,
  userStore,
  commonStore,
}) => {
  const myDaosGroup = {
    title: groupTitle('My Commons', commonStore.myCommons.length),
    data: commonStore.myCommons,
  };
  const pendingDaosGroup = {
    title: groupTitle('Pending', commonStore.pendingCommons.length),
    data: commonStore.pendingCommons,
  };
  const featuredDaosGroup = {
    title: 'Featured',
    data: commonStore.featuredCommons,
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: refresh
    // DaoService.getInstance().getDaoList(loadDaosList);
  }, [refreshing]);

  const onAddCommon = () => {
    if (userStore.signedInUser) {
      navigation.navigate('CommonExplanation');
    } else {
      bottomSheetStore.showBottomSheet(
        BOTTOM_SHEET_TEMPLATES.LOGIN_SHEET_SCREEN,
        {
          message: 'Connect your account to join this Common',
        },
      );
    }
  };

  const header = () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 15,
      }}>
      <Text style={styles.lengthCommons}>Explore Commons</Text>
    </View>
  );

  const sectionHeader = (title) =>
    title === '' ? null : (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.header}>{title}</Text>
      </View>
    );

  const loadingPlaceholder = () => (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Placeholder Animation={Fade}>
        <PlaceholderLine width={30} />
      </Placeholder>

      <Placeholder Animation={Fade}>
        {[...Array(3).keys()].map((i) => (
          <View key={`common_loading_${i}`}>
            <PlaceholderMedia
              style={{height: 200, width: '100%', marginBottom: 20}}
            />
            <PlaceholderLine width={80} />
            <PlaceholderLine />
            <PlaceholderLine width={30} />
          </View>
        ))}
      </Placeholder>
    </ScrollView>
  );

  const listFooter = () => (
    <View style={styles.footerContainer}>
      <Image
        source={require('~/Assets/commonListFooter.png')}
        style={{
          resizeMode: 'contain',
          width: 84,
          height: 84,
        }}
      />
      <Text style={styles.createACommon}>Create a common</Text>
      <Text
        style={{
          fontFamily: 'NunitoSans-Regular',
          fontSize: 16,
          textAlign: 'center',
          marginVertical: 10,
        }}>
        Anyone can create a Common, invite their friends, and work together to
        achieve common goals. Start now!
      </Text>
    </View>
  );

  const refreshFeed = () => {
    console.log('TODO: implement refreshFeed with commonStore');
    // TODO
    // filterCommons();
  };

  const navigateToCommon = (common) => {
    const navigate = CommonActions.navigate({
      name: 'CommonProfile',
      params: {
        currCommon: common,
        refreshFeed,
      },
    });

    navigation.dispatch(navigate);
  };

  const getInitialNumoRender = () =>
    userStore.signedInUser
      ? myDaosGroup.data.length +
        pendingDaosGroup.data.length +
        featuredDaosGroup.data.length
      : featuredDaosGroup.data.length;

  console.log(
    'featuredDaosGroup.data.length > 0 , ',
    featuredDaosGroup.data.length > 0,
  );

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#FBFCFC'}}>
        {featuredDaosGroup.data.length > 0 || !commonStore.isLoading ? (
          <SectionList
            sections={
              userStore.signedInUser
                ? [myDaosGroup, pendingDaosGroup, featuredDaosGroup]
                : [featuredDaosGroup]
            }
            ListHeaderComponent={header}
            contentContainerStyle={{paddingHorizontal: 20}}
            renderItem={(x) => (
              <CommonBox
                common={x.item}
                width="100%"
                key={x.item.id}
                navigation={navigation}
                // keyExtractor={x.item.id}
                onPress={() => navigateToCommon(x.item)}
              />
            )}
            keyExtractor={(x) => x.id}
            stickySectionHeadersEnabled={true}
            renderSectionHeader={({section: {title}}) => sectionHeader(title)}
            ListFooterComponent={listFooter}
            initialNumToRender={getInitialNumoRender()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          loadingPlaceholder()
        )}

        <BottomRightButton onPress={onAddCommon} />
      </SafeAreaView>
    </>
  );
};

CommonsList.propTypes = {
  navigation: object.isRequired,
  bottomSheetStore: object.isRequired,
  userStore: object.isRequired,
  daoStore: object.isRequired,
  commonStore: object.isRequired,
};

const styles = StyleSheet.create({
  createACommon: {
    ...font.heading.bold,
    fontSize: 20,
    textAlign: 'center',
  },
  header: {
    fontSize: 18,
    ...font.primary.bold,
    lineHeight: 22,
    letterSpacing: 0,
    color: colors.grey3,
    padding: 20,
  },
  lengthCommons: {
    ...font.fontSize(5),
    ...font.heading.bold,
  },
  sectionHeaderContainer: {
    marginHorizontal: -20,
    backgroundColor: '#FBFCFC',
  },
  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 47,
    marginTop: 60,
    marginBottom: 100,
  },
});

export default inject(
  'bottomSheetStore',
  'userStore',
  'commonStore',
  'daoStore',
)(observer(CommonsList));
