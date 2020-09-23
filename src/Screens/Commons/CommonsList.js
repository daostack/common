import React, {useEffect, useState} from 'react';
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
import {BOTTOM_SHEET_TEMPLATES} from '~/Stores/BottomSheetStore';
import {font, colors} from '~/Theme';
import {object} from 'prop-types';
import Cache, {CacheKey} from '../../Util/Cache';

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import DaoService from '~/Services/DaoService';
import {DAO_REGISTERED} from '~/Firebase/Databasee';
import ProposalService from '~/Services/ProposalService';
import {CommonActions} from '@react-navigation/native';

const CommonsList = ({navigation, bottomSheetStore, userStore, daoStore}) => {
  const [myDaosGroup, setMyDaosGroup] = useState({title: '', data: []});
  const [pendingDaosGroup, setPendingDaosGroup] = useState({title: '', data: []});
  const [featuredDaosGroup, setFeaturedDaosGroup] = useState({title: '', data: []});
  const [allDaosGroup, setAllDaosGroup] = useState(null);
  const [isSplited, setIsSplited] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const {userInfo} = userStore;

  const getPendingDAOList = async () => {
    if (userStore.userInfo === null ) {
      return [];
    }

    const proposalList = await ProposalService.getInstance().getUserPendingProposals(userStore.userInfo.uid);
    const daoList = proposalList.map((proposal) => proposal.data().dao);

    return daoList;
  };

  const splitDaoList = async (daoList) => {
    if (userInfo) {
      try {
        if (daoList.length === 0) {
          setMyDaosGroup({title: '', data: []});
          return [];
        }

        const myDao = daoList.filter((dao) => userStore.isDaoMember(dao.members));

        const pendingList = await getPendingDAOList();
        const pendingDao = daoList.filter((dao) => pendingList.includes(dao.id));

        const featuredList = daoList.filter((dao) =>
          !pendingDao.includes(dao) &&
          !myDao.includes(dao) &&
          dao.register === DAO_REGISTERED
        );

        if (myDao.length > 0) {
          setMyDaosGroup({
            title: `My Commons (${myDao?.length})`,
            data: myDao,
          });
        }

        if (pendingDao.length > 0) {
          setPendingDaosGroup({
            title: `Pending (${pendingDao?.length})`,
            data: pendingDao,
          });
        }

        if (featuredList.length > 0) {
          setFeaturedDaosGroup({
            title: 'Featured',
            data: featuredList,
          });
        }
      } catch (err) {
        bottomSheetStore.showBottomSheet(
          BOTTOM_SHEET_TEMPLATES.TRANSACTION_ERROR,
        );
      }
    } else {
      setFeaturedDaosGroup({
        title: 'Featured',
        data: daoList.filter((dao) =>
          dao.register === DAO_REGISTERED
        ),
      });
    }
  };

  const loadDaosList = (snapshot) => {
    try {
      if (snapshot?.empty || !snapshot) {
        setAllDaosGroup({title: '', data: []});
        return [];
      }
      let docs = snapshot.docs.map((doc, index) => ({
        ...{id: doc.id},
        ...doc.data(),
        ...{
          coverPhoto:
              doc.data().metadata?.image ||
              `https://picsum.photos/id/${index * 10}/500/100.jpg`,
        },
      }));
      daoStore.setDaos(docs);
      Cache.set(CacheKey.AllDaoCache, docs);
      setAllDaosGroup({
        title: '',
        data: docs,
      });
      splitDaoList(docs).then(() => {
        setIsSplited(true);
      });
      setRefreshing(false);
    } catch (err) {
      bottomSheetStore.showBottomSheet(
        BOTTOM_SHEET_TEMPLATES.TRANSACTION_ERROR,
      );
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    DaoService.getInstance().getDaoList(loadDaosList);
  }, [refreshing]);

  useEffect(() => {
    Cache.getAsync(CacheKey.AllDaoCache).then((jsonValue) => {
      if (jsonValue === null) {
        return;
      }
      const docs = JSON.parse(jsonValue);
      daoStore.setDaos(docs);
      setAllDaosGroup({
        title: '',
        data: docs,
      });
      splitDaoList(docs);
    });
    DaoService.getInstance().subscribeToDaosList(loadDaosList);
  }, [daoStore, bottomSheetStore, userInfo]);

  const onAddCommon = () => {
    if (userStore.userInfo) {
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
      <Text style={styles.lengthCommons}>{`${(allDaosGroup?.data.length)} Commons`}</Text>
    </View>
  );

  const sectionHeader = (title) => title === '' ? null : (
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

  const navigateToCommon = (common) => {
    const navigate = CommonActions.navigate({
      name: 'CommonProfile',
      params: {
        currCommon: common,
      },
    });
    navigation.dispatch(navigate);
  };

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#FBFCFC'}}>
        { allDaosGroup ? (
          <SectionList
            sections={isSplited
              ? userInfo
                ? [myDaosGroup, pendingDaosGroup, featuredDaosGroup]
                : [featuredDaosGroup]
              : [allDaosGroup]}
            ListHeaderComponent={header}
            contentContainerStyle={{paddingHorizontal: 20}}
            renderItem={(x) => (
              <CommonBox
                common={x.item}
                width="100%"
                key={x.item.id}
                navigation={navigation}
                // keyExtractor={x.item.id}
                onPress={() => navigateToCommon(x.item) }
              />
            )}
            keyExtractor={(x) => x.id}
            stickySectionHeadersEnabled={true}
            renderSectionHeader={({section: {title}}) => sectionHeader(title)}
            ListFooterComponent={listFooter}
            initialNumToRender={ allDaosGroup.length }
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
  'daoStore'
)(observer(CommonsList));
