import {IpfsClient} from '../../Config';
import WalletManager from '../../Util/WalletManager';

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
  navigation
) => {
  // need these keys:
    console.log('step 1');
    navigation.navigate({
      name: 'FullScreenCreationLoader',
      params: {
        title: 'Creating your Common',
        message: 'This might take a couple of minutes.',
      },
    });
    //daoStore.setCreationStatus(1);
    const MANDATORY_ARGS = [
      'name',
      'minFeeToJoin',
      /* 'fundingGoal', */
      'fundingGoalDeadline',
    ];

    for (const key of MANDATORY_ARGS) {
      if (Object.keys(givenOpts).indexOf(key) === -1 || !givenOpts[key]  ) {
        console.log(givenOpts);
        const msg = `${key} is a mandatary option for the createCommon function`;
        console.error(msg);
        throw Error(msg);
      }
    }
  }

  const defaultOptions = {
    tokenDist: [0],
    repDist: [MEMBER_REPUTATION],
    memberReputation: MEMBER_REPUTATION,
    fundingToken: COMMONTOKENADDRESS,
    VERSION: '000001', // just some alphanumberic marker  that is useful for understanding what our data is shaped like
  };
  const opts = {...defaultOptions, ...givenOpts};

  console.log('saving data on ipfs: ', opts);
  const ipfsHash = await IpfsClient.addAndPinString(JSON.stringify(opts));
  console.log('ipfsHash ->', ipfsHash);

  let receipt;

  // console.log('opts: ', opts);
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
  const data = {
    DAOFactoryInstance: daoFactoryInfo.address,
    orgName: opts.name,
    founderAddresses: [opts.founderAddresses],
    repDist: opts.repDist,
  };
  console.log('Calling DAOFactory.forgeOrg(...)', data);

  const forgeOrgData = getForgeOrgData(data);

  console.log('waiting for forgeOrg transaction to be mined');
  receipt = await daoFactoryContract.sendToRelayerWithReceipt(
    'forgeOrg',
    forgeOrgData,
  );
  // console.log('forgeOrg receipt ->', receipt);
  console.log('forgeOrg transaction was mined..');
  // get the new avatar address of the thing that was just created..
  const newOrgEvent = receipt.events.NewOrg;
  // console.log('newOrgEvent', newOrgEvent);
  const newOrgAddress = newOrgEvent._avatar;
  console.log('newOrgAddress', newOrgAddress);


  console.log('Calling DAOFactory.setSchemes(...)');
  const schemeDataToEncode = {
    DAOFactoryInstance: daoFactoryInfo.address,
    avatar: newOrgAddress,
    votingMachine: votingMachineInfo.address,
    fundingToken: opts.fundingToken,
    minFeeToJoin: opts.minFeeToJoin,
    memberReputation: opts.memberReputation,
    // we set the OFFICIAL funding goal to 0 - in the frontend we show the fundingGaol from ipfs data
    // goal: parseInt(opts.fundingGoal, 10),
    goal: 0,
    deadline: opts.fundingGoalDeadline,
    metaData: ipfsHash,
  };
    // console.log('variables sending to Contract', schemeDataToEncode);
  const schemeData = getSetSchemesData(schemeDataToEncode);

  //daoStore.setCreationStatus(4);
  console.log('createCommonStep2: waiting for tx to be mined');
  // receipt = await daoFactoryContract.sendToRelayerWithReceipt('setSchemes', schemeData);
  const manager = await WalletManager.getInstance();
  await manager.createCommonStep2(
    daoFactoryContract,
    'setSchemes',
    schemeData,
    newOrgAddress
  );
  console.log(`Created a DAO at ${newOrgAddress} with name "${opts.name}"`);
  return newOrgAddress;
};
