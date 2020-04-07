import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, Clipboard} from 'react-native';
import gql from 'graphql-tag';
import {ApolloClientConfig as client} from '../Config';
import {Ipfs as IpfsClient} from '../Config';
const {cache} = client;

const CommonProfile = () => {
  const [dao, setDao] = useState(false);
  const [ipfsHash, setIpfsHash] = useState('');

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

  const ipfsUpload = async () => {
    const descriptionHash = await IpfsClient.addAndPinString(
      JSON.stringify({
        name: 'Amazon Network',
        byline: 'byLine',
        description: 'Save Amazon',
        courseOfAction: 'Save the rainforest from deforestation',
        mainValue1: 'value 1',
        mainValue2: 'value 2',
        mainValue3: 'value 3',
      }),
    );
    setIpfsHash(descriptionHash);
    console.log(descriptionHash);
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity onPress={ipfsUpload}>
        <Text>IPFS Upload</Text>
      </TouchableOpacity>
      <Text>IPFS Hash: {ipfsHash}</Text>
    </View>
  );
};

export default CommonProfile;
