import {BN} from '@daostack/arc.js';
const {
  getForgeOrgData,
  getSetSchemesData,
} = require('@daostack/common-factory');
const {ARC_VERSION, OVERRIDES} = require('./arc');

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

export const createCommonWithLoader = async (
  arc,
  givenOpts = {},
  navigation,
) => {
  navigation.navigate('CommonCreationLoading');
};

export const createCommon = async (arc, givenOpts = {}) => {
  try {
    const defaultOptions = {
      fundingToken: '0x0000000000000000000000000000000000000000',
      memberReputation: 1000,
    };
    const opts = {...defaultOptions, ...givenOpts};
    let tx;

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
    console.log('waiting for tx to be mined');
    const receipt1 = await tx.wait();
    console.log('done!');
    // get the new avatar address of the thing that was just created..
    const newOrgEvent = receipt1.events.filter(e => e.event === 'NewOrg')[0];
    const newOrgAddress = newOrgEvent.args._avatar;

    console.log('Calling DAOFactory.setSchemes(...)', opts);
    console.log('variables sending to Contract', {
      DAOFactoryInstance: daoFactoryInfo.address,
      avatar: newOrgAddress,
      votingMachine: votingMachineInfo.address,
      fundingToken: opts.fundingToken,
      minFeeToJoin: [opts.minFeeToJoin],
      memberReputation: opts.memberReputation,
      fundingGoal: opts.fundingGoal,
      deadline: opts.fundingGoalDeadline,
      metaData: opts.ipfsHash,
    });

    const schemeData = getSetSchemesData({
      DAOFactoryInstance: daoFactoryInfo.address,
      avatar: newOrgAddress,
      votingMachine: votingMachineInfo.address,
      fundingToken: opts.fundingToken,
      minFeeToJoin: [opts.minFeeToJoin],
      memberReputation: opts.memberReputation,
      fundingGoal: new BN(opts.fundingGoal),
      fundingGoalDeadline: opts.fundingGoalDeadline,
      metaData: opts.ipfsHash,
    });

    tx = await daoFactoryContract.setSchemes(...schemeData, OVERRIDES);
    console.log('waiting for tx to be mined');
    const receipt2 = await tx.wait();
    console.log(`Created a DAO at ${newOrgAddress} with name "${opts.name}"`);
    return `Created common with name ${opts.name} in transactions ${receipt1.transactionHash} and ${receipt2.transactionHash}`;
  } catch (e) {
    const msg = `[Create Common error] ${e}`;
    // TODO: error should be handled as an Error, not as a return value..
    return msg;
  }
};

// const ipfsUpload = async formData => {
//   return await IpfsClient.addAndPinString(
//     JSON.stringify({
//       name: formData.name,
//       byline: formData.byline,
//       description: formData.description,
//       courseOfAction: formData.action,
//       mainValue1: formData.funding,
//       mainValue2: formData.minimum,
//       mainValue3: 'empty value',
//     }),
//   );
// };
