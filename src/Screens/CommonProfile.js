import React, {useEffect, useState} from 'react';
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
        console.log('error: ', error);
        const errorMessage =
          error.code === statusCodes.SIGN_IN_REQUIRED
            ? 'Please sign in'
            : error.message;
        setError(new Error(errorMessage));
      }
    };

    getDao();
  }, [1]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Hello {dao}</Text>
    </View>
  );
};

export default CommonProfile;
