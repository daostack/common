import React, {useEffect} from 'react';
import {
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import {CommonBox, BottomRightButton} from '../Components';
import {Subscription, Query} from 'react-apollo';
import gql from 'graphql-tag';
import {ApolloClientConfig as client} from '../Config';
import {layout, colors, text, sizeL, sizeXXL} from '../Theme';

const {width} = Dimensions.get('window');

const DAOS_SUBSCRIPTION = gql`
  query {
    daos(orderBy: reputationHoldersCount, orderDirection: desc) {
      id
      name
      reputationHoldersCount
      schemes(first: 1000) {
        id
        address
        name
        paramsHash
      }
      proposals(first: 1000) {
        id
        stage
      }
    }
  }
`;

const mockDaos = [
  {
    type: 'id',
    generated: false,
    id: 'DAO:0x6bee9b81e434f7afce72a43a4016719315069539',
    typename: 'DAO',
  },
  {
    type: 'id',
    generated: false,
    id: 'DAO:0x519b70055af55a007110b4ff99b0ea33071c720a',
    typename: 'DAO',
  },
  {
    type: 'id',
    generated: false,
    id: 'DAO:0x294f999356ed03347c7a23bcbcf8d33fa41dc830',
    typename: 'DAO',
  },
  {
    type: 'id',
    generated: false,
    id: 'DAO:0x0c88aa3c4fe9f9f8da766e9b8bfbbaa1235928cc',
    typename: 'DAO',
  },
  {
    type: 'id',
    generated: false,
    id: 'DAO:0xe56b4d8d42b1c9ea7dda8a6950e3699755943de7',
    typename: 'DAO',
  },
  {
    type: 'id',
    generated: false,
    id: 'DAO:0x440583455bcd85ab2bd429c015d3aabcae135f0a',
    typename: 'DAO',
  },
  {
    type: 'id',
    generated: false,
    id: 'DAO:0x0ed985925bb42c6719d10dcd1cc02d8cf596c15b',
    typename: 'DAO',
  },
  {
    type: 'id',
    generated: false,
    id: 'DAO:0x2b8c70fffda7f3d7667f7cfede1429313886329c',
    typename: 'DAO',
  },
  {
    type: 'id',
    generated: false,
    id: 'DAO:0x9aa89db8556f93220ed38687b12bfb3a292ffbfc',
    typename: 'DAO',
  },
  {
    type: 'id',
    generated: false,
    id: 'DAO:0x0b93ba560283350d4216f29dc57e15df38d0eace',
    typename: 'DAO',
  },
  {
    type: 'id',
    generated: false,
    id: 'DAO:0x917e94d812364f8a4c9b8d906a0e9668023c8e38',
    typename: 'DAO',
  },
  {
    type: 'id',
    generated: false,
    id: 'DAO:0x84c2276acaf67b65bca212c8634688b5b2dc903e',
    typename: 'DAO',
  },
];

const mockData = {
  daos: mockDaos,
};

const CommonsList = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <SafeAreaView />
      {/**
      <Query query={DAOS_SUBSCRIPTION}>
        {({loading, error, data}) => {
          console.log('Query Commons -> ', loading, error, data);

          if (error) {
            console.error(error);
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                }}>
                <Text>Can't fetch DAOs</Text>
              </View>
            );
          }
          if (loading) {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    fontStyle: 'normal',
                    letterSpacing: 0,
                  }}>
                  Commons
                </Text>
              </View>
            );
          }
          return (
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
                  {data.daos.length} Commons
                </Text>
              </View>

              <ScrollView>
                <View style={styles.container}>
                  {data.daos.map((dao, i) => {
                    if (
                      ''.length > 0 &&
                      !dao.name.toLowerCase().includes(''.toLowerCase())
                    ) {
                      return;
                    }
                    return (
                      <CommonBox
                        image={`https://i.picsum.photos/id/${i *
                          10}/500/100.jpg`}
                        common={dao}
                        key={i}
                        navigation={navigation}
                      />
                    );
                  })}
                </View>
              </ScrollView>
            </>
          );
        }}
      </Query>
      */}

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
            {mockData.daos.length} Commons
          </Text>
        </View>

        <ScrollView>
          <View style={styles.container}>
            {mockData.daos.map((dao, i) => {
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

export default CommonsList;
