import React, {useEffect, useState} from 'react';
import {
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import {CommonBox, BottomRightButton} from '../Components';
import {layout} from '../Theme';
import FirebaseService from '../Services/FirebaseService';
import {db} from '../Firebase';
import {inject, observer} from 'mobx-react';

const {width} = Dimensions.get('window');

const CommonsList = ({navigation}) => {
  // const [hasError, setErrors] = useState(false);
  const [daos, setDaos] = useState([]);

  useEffect(() => {
    let unsubscribe;
    const getDaos = async () => {
      try {
        const appUsers = await FirebaseService.getInstance().getUsers();
        console.log('users: ', appUsers);
        unsubscribe = db.collection('daos').onSnapshot(snapshot => {
          if (snapshot.empty) {
            return [];
          }
          let daosSnapshot = snapshot.docs.map(doc => {
            return {...{id: doc.id}, ...doc.data()};
          });
          console.log('daos: ', daosSnapshot);
          setDaos(daosSnapshot);
        });
        // console.log('DAOS: ', daosRes);
        // setDaos(daosRes);
      } catch (error) {
        console.log('errror: ', error);
      }
    };
    getDaos();
    return function cleanup() {
      unsubscribe();
    };
  }, [0]);

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

        <ScrollView>
          <View style={styles.container}>
            {daos.map((dao, i) => {
              if (
                ''.length > 0 &&
                !dao.name.toLowerCase().includes(''.toLowerCase())
              ) {
                return;
              }
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
        </ScrollView>
      </>
      <BottomRightButton
        onPress={() => navigation.navigate('CommonExplanation')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...layout.content,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  roundedProfileImage: {
    width: 100,
    height: 100,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 50,
  },
  input: {
    backgroundColor: '#E6E6E6',
    width: width - 20,
    height: 70,
    fontSize: 14,
    margin: 10,
    borderRadius: 10,
    borderWidth: 0,
    borderColor: 'white',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  commonBox: {
    width: width - 36,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.09)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 13,
    shadowOpacity: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#eeeeee',
    marginBottom: 10,
  },
  cheezeDaoBox: {
    width: width - 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  sharpShadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowRadius: 0,
    shadowOpacity: 1,
  },
});

export default inject('createCommonFormStore')(observer(CommonsList));
