import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import gql from 'graphql-tag';
import {ApolloClientConfig as client} from '../Config';
const {cache} = client;

const CommonProfile = () => {
  const [dao, setDao] = useState(false);

  useEffect(() => {
    // noinspection JSAnnotator
    const getDao = async () => {
      // noinspection JSAnnotator
      try {
        console.log('CACHE: ', cache.data.data);
        const res = await cache.readQuery({
          query: gql`
            query readDao($id: String!) {
              daos(id: $id) {
                id
              }
            }
          `,
          variables: {
            id: '0x6bee9b81e434f7afce72a43a4016719315069539',
            __typename: 'DAO',
          },
        });
        console.log('HELLO!: ', res);
      } catch (error) {
        console.log('error: ', error);
      }
    };

    getDao();
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Hello {dao}</Text>
    </View>
  );
};

export default CommonProfile;
