import React, {useEffect, useState} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  SectionList,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {CommonBox, BottomRightButton} from '../../Components';
import {inject, observer} from 'mobx-react';
import {BOTTOM_SHEET_TEMPLATES} from '../../Stores/BottomSheetStore';
import {font, colors} from '../../Theme';

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import DaoService from '../../Services/DaoService';
import { DAO_REGISTER_APPROVED } from '../../Firebase/Databasee';

const CommonsList = ({navigation, daoStore, bottomSheetStore, userStore}) => {
  const [daoGroup, setDaoGroup] = useState();

  const loadDaosList = (snapshot) => {
    if (snapshot?.empty || !snapshot) {
      setDaoGroup([{ title: '', data: [] }]);
      return [];
    }
    let daosSnapshot = snapshot.docs.map((doc, index) => {
      return {
        ...{ id: doc.id },
        ...doc.data(),
        ...{
          coverPhoto:
              doc.data().metadata?.image ||
              `https://picsum.photos/id/${index * 10}/500/100.jpg`,
        },
      };
    });

    divideDao(daosSnapshot);
    if (daoStore.isError) {
      console.log('daostore error', daoStore.isError);
      bottomSheetStore.showBottomSheet(
        BOTTOM_SHEET_TEMPLATES.TRANSACTION_ERROR,
      );
    }

  };

  useEffect(() => {
    let unsubscribe = null;
    const getDaos = async () => {
      unsubscribe = await DaoService.getInstance().subscribeToDaosList(loadDaosList);
    };

    getDaos();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [daoStore, bottomSheetStore, userStore.isLoading]);

  const setDao = dao => {
    daoStore.setDao(dao);
  };

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

  const divideDao = daoList => {
    if (!userStore.userInfo) {
      setDaoGroup([{title: '', data: daoList}]);
      return;
    }

    let myDaos = [];
    let otherDaos = [];
    for (let dao of daoList) {
      const isMember = userStore.isDaoMember(dao.members);
      if (isMember) {
        myDaos.push(dao);
      } else if (dao.register === DAO_REGISTER_APPROVED) {
        otherDaos.push(dao);
      }
    }

    if (myDaos.length === 0) {
      setDaoGroup([{title: '', data: daoList}]);
      return;
    }

    daoStore.setDaos([...myDaos, ...otherDaos]);
    setDaoGroup([
      {
        title: `My Commons (${myDaos.length})`,
        data: myDaos,
      },
      {
        title: `Discover more Commons (${otherDaos.length})`,
        data: otherDaos,
      },
    ]);
  };

  const header = () => {

    let daosLength = 0;
    daoGroup?.forEach(daoGroup => {
      daosLength = daosLength + daoGroup.data.length;
    });

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingVertical: 15,
        }}>
        <Text style={styles.lengthCommons}>{daosLength} Commons</Text>
      </View>
    );
  };

  const sectionHeader = title => {
    return title === '' ? null : (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.header}>{title}</Text>
      </View>
    );
  };

  const loadingPlaceholder = () => {
    return (
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
          {[...Array(3).keys()].map(i => {
            return (
              <View key={`common_loading_${i}`}>
                <PlaceholderMedia
                  style={{height: 200, width: '100%', marginBottom: 20}}
                />
                <PlaceholderLine width={80} />
                <PlaceholderLine />
                <PlaceholderLine width={30} />
              </View>
            );
          })}
        </Placeholder>
      </ScrollView>
    );
  };

  const listFooter = () => {
    return (
      <View style={styles.footerContainer}>
        <Image
          source={require('../../Assets/commonListFooter.png')}
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
  };

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#FBFCFC'}}>
        {daoGroup ? (
          <SectionList
            sections={daoGroup}
            ListHeaderComponent={header}
            contentContainerStyle={{paddingHorizontal: 20}}
            renderItem={x => (
              <CommonBox
                common={x.item}
                width="100%"
                navigation={navigation}
                // keyExtractor={x.item.id}
                onPress={() => setDao(x.item)}
              />
            )}
            keyExtractor={x => x.id}
            stickySectionHeadersEnabled={true}
            renderSectionHeader={({section: {title}}) => sectionHeader(title)}
            ListFooterComponent={listFooter}
          />
        ) : (
          loadingPlaceholder()
        )}

        <BottomRightButton onPress={onAddCommon} />
      </SafeAreaView>
    </>
  );
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
  'daoStore',
  'bottomSheetStore',
  'userStore',
)(observer(CommonsList));
