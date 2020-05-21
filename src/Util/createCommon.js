// import {Addressr from '../../node_modules/@daostack/arc.js/src'
const {
  getForgeOrgData,
  getSetSchemesData,
} = require('@daostack/common-factory');
const {ARC_VERSION, OVERRIDES} = require('./arc');

// import DAOFactory from '../Contracts/ABIs/DAOFactory';

// this function is called like this:
//

// const commonAddress = await createCommon(arc, {
//   name: formData.name,
//   founderAddresses: [address],
//   tokenDist: [0],
//   repDist: [100],
//   minFeeToJoin: 100, // TDB: get from formData
//   fundingGoal: 1000, // TBD: get from formdata
//   // TBD: get form data for deadline; these are in "secondSinceEpoch"
//   fundingGoalDeadline: (await provider.getBlock('latest')).timestamp + 3000,
//   ipfsHash,
// });

export const createCommon = async (arc, data = {}, navigation, daoStore) => {
  navigation.navigate('CommonCreationLoading');
  daoStore.setCreationStatus(1);

  try {
    const defaultOptions = {
      fundingToken: '0x0000000000000000000000000000000000000000',
      memberReputation: 1000,
    };
    const opts = {...defaultOptions, ...data};

    let tx;
    let receipt;

    console.log('opts: ', opts);
    console.log('fetching contractinfo from graphql...');
    const daoFactoryInfo = arc.getContractInfoByName(
      'DAOFactoryInstance',
      ARC_VERSION,
    );
    console.log('arc: ', arc);
    console.log('daofactoryInfo: ', daoFactoryInfo);
    console.log('daofactoryInfo: ', arc.getABI);
    //TODO: get abi manually
    const contractABI = arc.getABI({
      address: daoFactoryInfo.address,
      abiName: 'DAOFactory',
      version: ARC_VERSION,
    });
    // const contractABI = DAOFactory;
    const daoFactoryContract = await arc.getContract(
      daoFactoryInfo.address,
      contractABI,
    );
    const votingMachineInfo = arc.getContractInfoByName(
      'GenesisProtocol',
      '0.1.1-rc.13',
      // Ideally, we would find the GeneisProtocol at ARC_VERSION
      // instead, we need to use this custom version until https://github.com/daostack/subgraph/issues/542  is resolved
    );
    console.log('Calling DAOFactory.forgeOrg(...)', {
      DAOFactoryInstance: daoFactoryInfo.address,
      orgName: opts.name,
      founderAddresses: [opts.founderAddresses],
      repDist: [opts.memberReputation],
    });
    const forgeOrgData = getForgeOrgData({
      DAOFactoryInstance: daoFactoryInfo.address,
      orgName: opts.name,
      founderAddresses: [opts.founderAddresses],
      repDist: [opts.memberReputation],
    });

    tx = await daoFactoryContract.forgeOrg(...forgeOrgData, OVERRIDES);
    console.log(`waiting for tx with hash ${tx.hash}to be mined`);
    receipt = await tx.wait();
    if (receipt) {
      daoStore.setCreationStatus(2);
    }
    console.log('done!');
    // get the new avatar address of the thing that was just created..
    const newOrgEvent = receipt.events.filter(e => e.event === 'NewOrg')[0];
    const newOrgAddress = newOrgEvent.args._avatar;
    if (!newOrgAddress) {
      throw Error(`Something went wrong, check tx ${tx.hash}`);
    }

    const schemePreData = {
      DAOFactoryInstance: daoFactoryInfo.address,
      avatar: newOrgAddress,
      votingMachine: votingMachineInfo.address,
      fundingToken: opts.fundingToken,
      minFeeToJoin: opts.minFeeToJoin,
      memberReputation: opts.memberReputation,
      goal: parseInt(opts.fundingGoal, 10),
      deadline: opts.fundingGoalDeadline,
      metaData: opts.ipfsHash,
    };
    const schemeData = getSetSchemesData(schemePreData);
    // console.log(schemeData);

    console.log('Calling DAOFactory.setSchemes(...)', opts);
    tx = await daoFactoryContract.setSchemes(...schemeData, OVERRIDES);
    console.log('waiting for tx to be mined');
    daoStore.setCreationStatus(4);
    receipt = await tx.wait();
    console.log(`Created a DAO at ${newOrgAddress} with name "${opts.name}"`);
    daoStore.setCreationStatus(5);
    return receipt;
  } catch (e) {
    console.log('[Create Common error]: ', e);
    daoStore.creationError(e);
    throw `[Create Common error] ${e}`;
  }
};
