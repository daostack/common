// import {Address} from '../../node_modules/@daostack/arc.js/src'
const {
  getForgeOrgData,
  getSetSchemesData,
} = require('@daostack/common-factory');
const {ARC_VERSION, OVERRIDES} = require('../../Config');

// import DAOFactory from '../Contracts/ABIs/DAOFactory';

// this function is called like this:
//

// const commonAddress = await createCommon({
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

export const createCommon = async (
  arc,
  givenOpts = {},
  navigation,
  daoStore,
) => {
  //   navigation.navigate('CommonCreationLoading');
  // }
  // export const createCommon1 = async (arc, givenOpts = {}, navigation, daoStore) => {
  navigation.navigate('CommonCreationLoading');
  daoStore.setCreationStatus(1);

  try {
    const defaultOptions = {
      fundingToken: '0x0000000000000000000000000000000000000000',
      memberReputation: 1000,
    };
    const opts = {...defaultOptions, ...givenOpts};
    let tx;
    let receipt;

    console.log('opts: ', opts);
    console.log('fetching contractinfo from graphql...');
    const daoFactoryInfo = arc.getContractInfoByName(
      'DAOFactoryInstance',
      ARC_VERSION,
    );
    //TODO: get abi manually
    const contractABI = arc.getABI({
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
      ARC_VERSION,
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
    console.log('waiting for tx to be mined');
    console.log(tx);
    receipt = await tx.wait();
    if (receipt) {
      daoStore.setCreationStatus(2);
    }
    console.log('done!');
    // get the new avatar address of the thing that was just created..
    const newOrgEvent = receipt.events.filter(e => e.event === 'NewOrg')[0];
    const newOrgAddress = newOrgEvent.args._avatar;

    console.log('Calling DAOFactory.setSchemes(...)', opts);
    console.log('variables sending to Contract', {
      DAOFactoryInstance: daoFactoryInfo.address,
      avatar: newOrgAddress,
      votingMachine: votingMachineInfo.address,
      fundingToken: opts.fundingToken,
      minFeeToJoin: opts.minFeeToJoin,
      memberReputation: opts.memberReputation,
      fundingGoal: [parseInt(opts.fundingGoal, 10)],
      deadline: opts.fundingGoalDeadline,
      metaData: opts.ipfsHash,
    });

    const schemeData = getSetSchemesData({
      DAOFactoryInstance: daoFactoryInfo.address,
      avatar: newOrgAddress,
      votingMachine: votingMachineInfo.address,
      fundingToken: opts.fundingToken,
      minFeeToJoin: opts.minFeeToJoin,
      memberReputation: opts.memberReputation,
      goal: parseInt(opts.fundingGoal, 10),
      deadline: opts.fundingGoalDeadline,
      metaData: opts.ipfsHash,
    });

    tx = await daoFactoryContract.setSchemes(...schemeData, OVERRIDES);
    console.log('waiting for tx to be mined');
    daoStore.setCreationStatus(4);
    receipt = await tx.wait();
    console.log(`Created a DAO at ${newOrgAddress} with name "${opts.name}"`);
    daoStore.setCreationStatus(5);
    return receipt;
  } catch (e) {
    throw e;
  }
};
