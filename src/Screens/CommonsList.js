import React, { useEffect, useState } from 'react';
import {
  Text,
  SafeAreaView,
  View,
  SectionList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { CommonBox, BottomRightButton } from '../Components';
import { db } from '../Firebase';
import { inject, observer } from 'mobx-react';
import { BOTTOM_SHEET_TEMPLATES } from '../Stores/BottomSheetStore';
import colors from '../Theme/colors';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';

const CommonsList = ({ navigation, daoStore, bottomSheetStore, userStore }) => {
  // const [hasError, setErrors] = useState(false);
  const [daos, setDaos] = useState([]);
  const [daoGroup, setDaoGroup] = useState();

  useEffect(() => {
    let unsubscribe;
    const getDaos = async () => {
      try {
        unsubscribe = db.collection('daos').onSnapshot(snapshot => {
          if (snapshot.empty) {
            setDaos([]);
            setDaoGroup([{ title: '', data: [] }]);
            return [];
          }
          let daosSnapshot = snapshot.docs.map((doc, index) => {
            return {
              ...{ id: doc.id },
              ...doc.data(),
              ...{
                coverPhoto: `https://i.picsum.photos/id/${index *
                  10}/500/100.jpg`,
              },
            };
          });
          setDaos(daosSnapshot);
          daoStore.setDaos(daosSnapshot);

          divideDao(daosSnapshot);
          if (daoStore.isError) {
            console.log('daostore error', daoStore.isError);
            bottomSheetStore.showBottomSheet(
              BOTTOM_SHEET_TEMPLATES.TRANSACTION_ERROR,
            );
          }
        });
        // setDaos(daosRes);
      } catch (error) {
        console.log('errror: ', error);
      }
    };
    getDaos();
    return unsubscribe;
  }, [daoStore, bottomSheetStore, userStore.isLoading]);

  const setDao = dao => {
    daoStore.setDao(dao);
  };

  divideDao = daoList => {

    if (!userStore.userInfo) {
      setDaoGroup([{ title: '', data: daoList }]);
      return;
    }

    let myDaos = [];
    let otherDaos = [];
    for (let dao of daoList) {
      const isMember = dao.members.some(
        member => member.address === userStore.userInfo.safeAddress.toLowerCase() || member.address === userStore.userInfo.ethereumAddress.toLowerCase(),
      );
      if (isMember) {
        myDaos.push(dao);
      } else {
        otherDaos.push(dao);
      }
    }

    if (myDaos.length === 0) {
      setDaoGroup([{ title: '', data: daoList }]);
      return;
    }

    setDaoGroup(
      [
        {
          title: `My Daos (${myDaos.length})`,
          data: myDaos,
        },
        {
          title: `Discover more Commons (${otherDaos.length})`,
          data: otherDaos,
        },
      ]
    );
  };

  const header = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingVertical: 15,
        }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            fontStyle: 'normal',
            letterSpacing: 0,
          }}>
          {daos.length} Commons
      </Text>
      </View>
    );
  };

  const sectionHeader = title => {
    return (title === '' ? null :
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.header}>
          {title}
        </Text>
      </View>
    );
  };

  const loadingPlaceholder = () => {
    return (
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}>
        <Placeholder
          Animation={Fade}>
          <PlaceholderLine width={30} />
        </Placeholder>

        <Placeholder
          Animation={Fade}>
          {[...Array(3).keys()].map(i => {
            return (
              <View key={`common_loading_${i}`}>
                <PlaceholderMedia style={{ height: 200, width: '100%', marginBottom: 20 }} />
                <PlaceholderLine width={80} />
                <PlaceholderLine />
                <PlaceholderLine width={30} />
              </View>
            );
          }
          )}
        </Placeholder>
      </ScrollView>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView />
      <>
        {daoGroup ? (
          <SectionList
            sections={daoGroup}
            ListHeaderComponent={header}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            renderItem={x =>
              <CommonBox
                common={x.item}
                navigation={navigation}
                // keyExtractor={x.item.id}
                onPress={() => setDao(x.item)}
              />}
            keyExtractor={x => x.id}
            stickySectionHeadersEnabled={true}
            renderSectionHeader={({ section: { title } }) => (
              sectionHeader(title)
            )}
          />
        ) : loadingPlaceholder()}
      </>
      {userStore.userInfo && <BottomRightButton
        onPress={() => navigation.navigate('CommonExplanation')}
      />}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontFamily: 'Roboto',
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    color: colors.grey3,
    padding: 20,
    // paddingTop: 10,
  },
  sectionHeaderContainer: {
    marginHorizontal: -20,
    backgroundColor: '#f2f2f2',
  },
});

export default inject('daoStore', 'bottomSheetStore', 'userStore')(observer(CommonsList));
