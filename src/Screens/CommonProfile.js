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
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';

const {width} = Dimensions.get('window');

const CommonProfile = () => {
  const [dao, setDao] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDao = async () => {
      try {
        const dao = await client.readQuery({
          query: gql`
            query ReadDao {
              dao(id: 1) {
                name
              }
            }
          `,
        });
        setDao(dao);
      } catch (error) {
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
