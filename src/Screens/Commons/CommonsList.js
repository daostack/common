import React, {useState} from 'react';
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
import {rootStorePropTypes} from '~/Types/propTypes';
import {useTimeoutFn} from '../../Util/hooks/useTimeoutFn';
import Loader from '~/Components/Loader';

const TIMEOUT = 1500;

const groupTitle = (title, arrLength) =>
  arrLength > 0 ? `${title} (${arrLength})` : '';

const CommonsList = ({navigation, rootStore}) => {
  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;
  const authStore = rootStore.authStore;
  const commonStore = rootStore.commonStore;
  const [isLoading, setLoading] = useState(true);
  const handleLoader = () => {
    setLoading(false);
  };
  const [page, setPage] = useState(0);

  useTimeoutFn(handleLoader, TIMEOUT);

  const initialLoad = async () => {
    commonStore.loadMyCommons();
    commonStore.loadPendingCommons();
    commonStore.loadFeaturedCommons();
    setPage(0);
  };

  const myCommonsGroup = {
    title: groupTitle('My Commons', commonStore.myCommons?.size),
    data: commonStore.myCommonsValues,
  };

  const pendingCommonsGroup = {
    title: groupTitle('Pending', commonStore.pendingCommons?.size),
    data: commonStore.pendingCommonsValues,
  };

  const featuredCommonsGroup = {
    title: 'Featured',
    data: commonStore.featuredCommonsValues,
  };

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      await initialLoad();
      setLoading(false);
    })();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await initialLoad();
    setRefreshing(false);
  }, [refreshing]);

  const onEndReached = async () => {
    if (myCommonsGroup.title && pendingCommonsGroup.title) {
      commonStore.loadFeaturedCommons(page + 1);
      setPage(page + 1);
    }
  };

  const onAddCommon = () => {
    if (authStore.signedInUser) {
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

  const LoadingPlaceholder = () => (
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
    initialLoad();
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

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#FBFCFC'}}>
        {featuredCommonsGroup.data.length > 0 || !commonStore.isLoading ? (
          <SectionList
            sections={
              authStore.signedInUser
                ? [myCommonsGroup, pendingCommonsGroup, featuredCommonsGroup]
                : [featuredCommonsGroup]
            }
            ListHeaderComponent={header}
            contentContainerStyle={{paddingHorizontal: 20}}
            renderItem={(x) => (
              <CommonBox
                common={x.item}
                width="100%"
                key={x.item.id}
                navigation={navigation}
                onPress={() => navigateToCommon(x.item)}
              />
            )}
            keyExtractor={(x) => x.id}
            stickySectionHeadersEnabled={true}
            renderSectionHeader={({section: {title}}) => sectionHeader(title)}
            ListFooterComponent={listFooter}
            initialNumToRender={4}
            onEndReachedThreshold={400}
            onEndReached={onEndReached}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <LoadingPlaceholder />
        )}

        <BottomRightButton onPress={onAddCommon} />
      </SafeAreaView>
      {isLoading && <Loader isBigger isFullScreen navigation={navigation} />}
    </>
  );
};

CommonsList.propTypes = {
  navigation: object.isRequired,
  rootStore: rootStorePropTypes.isRequired,
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

export default inject('rootStore')(observer(CommonsList));
