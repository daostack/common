import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import gql from 'graphql-tag';
import {ApolloClientConfig as client} from '../Config';
const {cache} = client;

const CommonProfile = () => {
  const [dao, setDao] = useState(false);

  useEffect(() => {
    const getDao = async () => {
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
