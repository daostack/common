import React, {useEffect, useState} from 'react';
<<<<<<< HEAD
import {
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import CommonBox from '../Components/CommonBox';
import {Subscription} from 'react-apollo';
import gql from 'graphql-tag';
import {ApolloClientConfig as client} from '../Config';
const {cache} = client;
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';

const {width} = Dimensions.get('window');

const CommonProfile = () => {
  const [dao, setDao] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDao = async () => {
=======
import {Text, View} from 'react-native';
import gql from 'graphql-tag';
import {ApolloClientConfig as client} from '../Config';
const {cache} = client;

const CommonProfile = () => {
  const [dao, setDao] = useState(false);

  useEffect(() => {
    const getDao = async () => {
>>>>>>> master
      try {
        console.log('CACHE: ', cache);
        const res = await cache.readQuery({
          query: gql`
            query readDao {
              DAO(id: "0x6bee9b81e434f7afce72a43a4016719315069539") {
                name
              }
            }
          `,
        });
        console.log('HELLO!: ', client.readQuery());
        setDao(res);
      } catch (error) {
<<<<<<< HEAD
        console.log('error: ', error)
        const errorMessage =
          error.code === statusCodes.SIGN_IN_REQUIRED
            ? 'Please sign in'
            : error.message;
        setError(new Error(errorMessage));
=======
        console.log('error: ', error);
>>>>>>> master
      }
    };

    getDao();
<<<<<<< HEAD
  }, [1]);
=======
  }, []);
>>>>>>> master

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Hello {dao}</Text>
    </View>
  );
};

export default CommonProfile;
