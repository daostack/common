import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, Clipboard} from 'react-native';
import gql from 'graphql-tag';
import {ApolloClientConfig as client} from '../Config';
import {Ipfs as IpfsClient} from '../Config';
import WalletManager from '../Util/WalletManager';
const {getForgeOrgData, getSetSchemesData} = require('commonfactory');
const {cache} = client;
import DAOFactory from '../Contracts/ABIs/DAOFactory';
import MessageContract from '../Contracts/ABIs/MessageContract';
import {ethers} from 'ethers';
let provider = ethers.getDefaultProvider('rinkeby');

const CommonProfile = () => {
  const [dao, setDao] = useState(false);
  const [ipfsHash, setIpfsHash] = useState('');
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    // noinspection JSAnnotator
    const getDao = async () => {
      // noinspection JSAnnotator
      try {
        const manager = await WalletManager.getInstance();
        const address = await manager.getOwnerAccount();
        console.log('CACHE: ', address);

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
        console.log('apollo error: ');
      }
    };

    getDao();
  }, []);

  const forgeOrg = async () => {
    const manager = await WalletManager.getInstance();
    const address = await manager.getAddress();

    try {
      const forgeOrgData = [
        ...getForgeOrgData({
          DAOFactoryInstance: '0x565737926597B88da5B851cd2e3d7Ad7F68bAc7F',
          orgName: 'Amazon Network',
          founderAddresses: [address],
          tokenDist: [0],
          repDist: [100],
        }),
      ];
      console.log('FORGE ORG DATA: ', forgeOrgData);
      const {hash} = await manager.writeSmartContract(
        '0x2f21957c7147c3eE49235903D6471159a16c9ccd',
        DAOFactory,
        'forgeOrg',
        forgeOrgData,
      );
      setTxHash(hash);
    } catch (e) {
      throw 'Send transaction failed with error: ' + e;
    }
  };

  const ethWallet = async () => {
    try {
      const manager = await WalletManager.getInstance();
      const wallet = manager.ethWallet;

      console.log('ethwallet: ', manager.ethWallet);
      const address = await manager.getOwnerAccount();
      let contract = new ethers.Contract(
        '0x565737926597B88da5B851cd2e3d7Ad7F68bAc7F',
        DAOFactory,
        provider,
      );
      let daoFactory = contract.connect(wallet);
      let overrides = {
        gasLimit: 6000000,
      };
      const forgeOrgData = getForgeOrgData({
        DAOFactoryInstance: '0x565737926597B88da5B851cd2e3d7Ad7F68bAc7F',
        orgName: 'Amazon Network',
        founderAddresses: ['0x484B015162429F7e2a30670C46fb30d087b8628a'],
        tokenDist: [0],
        repDist: [100],
      });

      console.log('forgeOrgData: ', forgeOrgData);
      const forgeOrg = await daoFactory.forgeOrg(...forgeOrgData, overrides);

      // console.log('MESSAGE: ', sentMessage);
      console.log('forgeOrg: ', forgeOrg);
      const {hash} = forgeOrg;
      console.log('hash: ', hash);
      setTxHash(hash);
    } catch (e) {
      throw 'Send transaction failed with error: ' + e;
    }
  };

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

  // ...

  const setSchemesCF = async () => {
    const manager = await WalletManager.getInstance();

    try {
      const schemeData = [
        ...getSetSchemesData({
          DAOFactoryInstance: '0x565737926597B88da5B851cd2e3d7Ad7F68bAc7F',
          avatar: '0xbebd9f11b0517a209a2e154635f0dc3d61aa4011',
          votingMachine: '0x59EC3731Dca0512678A5F6507d79Cf631005cAd4',
          joinAndQuitVoteParams:
            '0x1000000000000000000000000000000000000000000000000000000000000000',
          fundingRequestVoteParams:
            '0x1100000000000000000000000000000000000000000000000000000000000000',
          schemeFactoryVoteParams:
            '0x1110000000000000000000000000000000000000000000000000000000000000',
          fundingToken: '0x0000000000000000000000000000000000000000',
          minFeeToJoin: 100,
          memberReputation: 100,
          goal: 1000,
          deadline: (await provider.getBlock('latest')).timestamp + 3000,
          metaData: ipfsHash,
        }),
      ];

      console.log('SCHEME DATA: ', schemeData);
      const {hash} = await manager.writeSmartContract(
        '0x565737926597B88da5B851cd2e3d7Ad7F68bAc7F',
        DAOFactory,
        'setSchemes',
        schemeData,
      );
      setTxHash(hash);
    } catch (e) {
      throw 'Send transaction failed with error: ' + e;
    }
  };

  const walletSetScheme = async () => {
    try {
      const manager = await WalletManager.getInstance();
      const wallet = manager.ethWallet;

      console.log('ethwallet: ', manager.ethWallet);
      const address = await manager.getAddress();
      let contract = new ethers.Contract(
        '0x565737926597B88da5B851cd2e3d7Ad7F68bAc7F',
        DAOFactory,
        provider,
      );
      let daoFactory = contract.connect(wallet);

      let message = `Hello ${Math.floor(Math.random() * Math.floor(50))}`;
      console.log(message);
      let overrides = {
        gasLimit: 6000000,
      };
      const setSchemeData = getSetSchemesData({
        DAOFactoryInstance: '0x565737926597B88da5B851cd2e3d7Ad7F68bAc7F',
        avatar: '0xbebd9f11b0517a209a2e154635f0dc3d61aa4011',
        votingMachine: '0x59EC3731Dca0512678A5F6507d79Cf631005cAd4',
        joinAndQuitVoteParams:
          '0x1000000000000000000000000000000000000000000000000000000000000000',
        fundingRequestVoteParams:
          '0x1100000000000000000000000000000000000000000000000000000000000000',
        schemeFactoryVoteParams:
          '0x1110000000000000000000000000000000000000000000000000000000000000',
        fundingToken: '0x0000000000000000000000000000000000000000',
        minFeeToJoin: 100,
        memberReputation: 100,
        goal: 1000,
        deadline: (await provider.getBlock('latest')).timestamp + 3000,
        metaData: ipfsHash,
      });

      console.log('setSchemeData: ', setSchemeData);
      const setSchemes = await daoFactory.setSchemes(
        ...setSchemeData,
        overrides,
      );

      // console.log('MESSAGE: ', sentMessage);
      console.log('setSchemes: ', setSchemes);
      const {hash} = setSchemes;
      console.log('hash: ', hash);
      setTxHash(hash);
    } catch (e) {
      throw 'Send transaction failed with error: ' + e;
    }
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity onPress={ipfsUpload}>
        <Text>IPFS Upload</Text>
      </TouchableOpacity>
      <Text>IPFS Hash: {ipfsHash}</Text>
      <TouchableOpacity onPress={forgeOrg}>
        <Text>Forge Org</Text>
      </TouchableOpacity>
      <Text>Tx Hash: {txHash}</Text>
      <TouchableOpacity onPress={setSchemesCF}>
        <Text>SetSchemes</Text>
      </TouchableOpacity>
      <Text>Tx Hash: {txHash}</Text>
      <TouchableOpacity onPress={ethWallet}>
        <Text>Wallet Forge</Text>
      </TouchableOpacity>
      <Text>Tx Hash: {txHash}</Text>
      <TouchableOpacity onPress={walletSetScheme}>
        <Text>Wallet SetScheme</Text>
      </TouchableOpacity>
      <Text>Tx Hash: {txHash}</Text>
    </View>
  );
};

export default CommonProfile;
