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

const CommonsList = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <SafeAreaView />
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
                  Commons
                </Text>
              </View>

              <ScrollView>
                <TextInput
                  style={{
                    padding: 8,
                    width: '100%',
                    ...styles.input,
                    height: 40,
                    fontWeight: '600',
                    fontSize: 14,
                  }}
                  onChangeText={filter => this.setState({filter})}
                  autoCapitalize="none"
                  placeholder="Filter Commons"
                />
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
      <BottomRightButton
        onPress={() => navigation.navigate('CommonExplanation')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
