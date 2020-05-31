import React, {useEffect, useState} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  FlatList,
} from 'react-native';
import {CommonBox, BottomRightButton} from '../Components';
import {db} from '../Firebase';
import {inject, observer} from 'mobx-react';
import {BOTTOM_SHEET_TEMPLATES} from '../Stores/BottomSheetStore';


const CommonsList = ({navigation, daoStore, bottomSheetStore, userStore}) => {
  // const [hasError, setErrors] = useState(false);
  const [daos, setDaos] = useState([]);

  useEffect(() => {
    let unsubscribe;
    const getDaos = async () => {
      try {
        unsubscribe = db.collection('daos').onSnapshot(snapshot => {
          if (snapshot.empty) {
            return [];
          }
          let daosSnapshot = snapshot.docs.map((doc, index) => {
            return {
              ...{id: doc.id},
              ...doc.data(),
              ...{
                coverPhoto: `https://i.picsum.photos/id/${index *
                  10}/500/100.jpg`,
              },
            };
          });
          setDaos(daosSnapshot);
          daoStore.setDaos(daosSnapshot);

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
  }, [daoStore, bottomSheetStore]);

  const setDao = dao => {
    daoStore.setDao(dao);
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView />
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: 15,
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

        {daos && (
          <FlatList
            contentContainerStyle={{paddingHorizontal: 20}}
            data={daos}
            renderItem={({item}) => (
              <CommonBox
                common={item}
                navigation={navigation}
                keyExtractor={daos.id}
                onPress={() => setDao(item)}
              />
            )}
          />
        )}
      </>
      {userStore.userInfo && <BottomRightButton
        onPress={() => navigation.navigate('CommonExplanation')}
      />}
    </View>
  );
};

export default inject('daoStore', 'bottomSheetStore', 'userStore')(observer(CommonsList));
