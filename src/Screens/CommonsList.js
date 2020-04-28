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
import {db, firebase} from '../Firebase';

const {width} = Dimensions.get('window');

import {Arc} from '@daostack/client';

const graphHttpLink =
  'https://api.thegraph.com/subgraphs/name/daostack/v7_2_exp_rinkeby';
const graphwsLink =
  'wss://api.thegraph.com/subgraphs/name/daostack/v7_2_exp_rinkeby';
//
// create an Arc instance
const arc = new Arc({
  graphqlHttpProvider: graphHttpLink,
  graphqlWsProvider: graphwsLink,
  web3Provider: `https://mainnet.infura.io/ws/v3/${'4406c3acf862426c83991f1752c46dd8'}`,
  ipfsProvider: {
    host: 'subgraph.daostack.io',
    port: '443',
    protocol: 'https',
    'api-path': '/ipfs/api/v0/',
  },
});

const CommonsList = ({navigation}) => {
  const [hasError, setErrors] = useState(false);
  const [daos, setDaos] = useState([]);

  useEffect(() => {
    db.collection('daos')
      .get()
      .then(snapshot => {
        console.log('SNAPSHOT: ', snapshot.data);
        setDaos(snapshot);
      });
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
                  common={dao.coreState}
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

export default CommonsList;
