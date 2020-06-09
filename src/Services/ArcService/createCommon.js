import {IpfsClient} from '../../Config';

const {
  getForgeOrgData,
  getSetSchemesData,
} = require('@daostack/common-factory');
const {
  ARC_VERSION,
  COMMONTOKENADDRESS,
  MEMBER_REPUTATION,
} = require('../../Config');


// USAGE:
// const commonAddress = await createCommon({
//   name: formData.name,
//   founderAddresses: [address],
//   tokenDist: [0],
//   repDist: [100],
//   minFeeToJoin: 100, //
//   fundingGoal: 1000, // T
//   fundingGoalDeadline: (await provider.getBlock('latest')).timestamp + 3000,
//       byline: formData.byline,
//       description: formData.description,
//       courseOfAction: formData.action,
//       // TODO: actuall add the values here (as an arry probably)
//       rules: formData.rules,
//       links: formData.links,
/// });


export const createCommon = async (
  arc,
  givenOpts = {},
  navigation,
  daoStore,
) => {
  // TODO: save the data on ipfs and get the hash as a part of this functions
  navigation.navigate('CommonCreationLoading');
  daoStore.setCreationStatus(1);

  // need these keys:
  const MANDATORY_ARGS = [
    'name', 'minFeeToJoin', 'fundingGoal', 'fundingGoalDeadline',
  ];

  for (const key of MANDATORY_ARGS) {
    if (Object.keys(givenOpts).indexOf(key) === -1) {
      console.log(givenOpts);
      throw Error(`${key} is a mandatary option for the createCommon function`);
    }
  }

  try {
    const defaultOptions = {
      tokenDist: [0],
      repDist: [MEMBER_REPUTATION],
      memberReputation: MEMBER_REPUTATION,
      fundingToken: COMMONTOKENADDRESS,
      VERSION: '000001', // just some alphanumberic marker  that is useful for understanding what our data is shaped like
    };
    const opts = {...defaultOptions, ...givenOpts};

    console.log('saving data on ipfs: ', opts);
    ipfsHash = await IpfsClient.addAndPinString(JSON.stringify(opts));
    console.log('ipfsHash ->', ipfsHash);

    let receipt;

    console.log('opts: ', opts);
    console.log('fetching contractinfo from graphql...');
    const daoFactoryInfo = arc.getContractInfoByName(
      'DAOFactoryInstance',
      ARC_VERSION,
    );
    const contractABI = arc.getABI({
      abiName: 'DAOFactory',
      version: ARC_VERSION,
    });
    const daoFactoryContract = await arc.getContract(
      daoFactoryInfo.address,
      contractABI,
    );
    const votingMachineInfo = arc.getContractInfoByName(
      'GenesisProtocol',
      ARC_VERSION,
    );
    console.log('Calling DAOFactory.forgeOrg(...)', {
      DAOFactoryInstance: daoFactoryInfo.address,
      orgName: opts.name,
      founderAddresses: [opts.founderAddresses],
      repDist: opts.repDist,
    });

    const forgeOrgData = getForgeOrgData({
      DAOFactoryInstance: daoFactoryInfo.address,
      orgName: opts.name,
      founderAddresses: [opts.founderAddresses],
      repDist: opts.repDist,
    });

    console.log('waiting for tx to be mined');
    receipt = await daoFactoryContract.sendToRelayerWithReceipt('forgeOrg', forgeOrgData);
    console.log('forgeOrg receipt ->', receipt);
    if (receipt) {
      daoStore.setCreationStatus(2);
    }
    console.log('done!');
    // get the new avatar address of the thing that was just created..
    const newOrgEvent = receipt.events.NewOrg;
    console.log('newOrgEvent', newOrgEvent);
    const newOrgAddress = newOrgEvent._avatar;
    console.log('newOrgAddress', newOrgAddress);

    console.log('Calling DAOFactory.setSchemes(...)', opts);
    console.log('variables sending to Contract', schemeDataToEncode);

    const schemeDataToEncode = {
      DAOFactoryInstance: daoFactoryInfo.address,
      avatar: newOrgAddress,
      votingMachine: votingMachineInfo.address,
      fundingToken: opts.fundingToken,
      minFeeToJoin: opts.minFeeToJoin,
      memberReputation: opts.memberReputation,
      // we set the OFFICIAL funding gaol to 0 - in the frontend we show the fundingGaol from ipfs data
      // goal: parseInt(opts.fundingGoal, 10),
      goal: 0,
      deadline: opts.fundingGoalDeadline,
      metaData: ipfsHash,
    };
    const schemeData = getSetSchemesData(schemeDataToEncode);

    daoStore.setCreationStatus(4);
    console.log('waiting for tx to be mined');
    receipt = await daoFactoryContract.sendToRelayerWithReceipt('setSchemes', schemeData);
    console.log(`Created a DAO at ${newOrgAddress} with name "${opts.name}"`);
    daoStore.setCreationStatus(5);
    return receipt;
  } catch (e) {
    throw e;
  }
};
