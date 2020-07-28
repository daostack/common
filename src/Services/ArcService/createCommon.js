import {IpfsClient} from '../../Config';
import {graphqlUrl} from '../../Config';
import axios from 'axios';
const { getForgeOrgData } = require('@daostack/common-factory');
const DAOFactoryABI = require('@daostack/common-factory/abis/DAOFactory');

const {
  ARC_VERSION,
  COMMONTOKENADDRESS,
  MEMBER_REPUTATION,
  IPFS_DATA_VERSION,
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
  try {
    const defaultOptions = {
      tokenDist: [0],
      repDist: [MEMBER_REPUTATION],
      memberReputation: MEMBER_REPUTATION,
      fundingToken: COMMONTOKENADDRESS,
      VERSION: IPFS_DATA_VERSION, // just some alphanumberic marker  that is useful for understanding what our data is shaped like
    };
    const opts = {...defaultOptions, ...givenOpts};

    console.log('saving data on ipfs: ', opts);
    const ipfsHash = await IpfsClient.addAndPinString(JSON.stringify(opts));
    console.log('ipfsHash ->', ipfsHash);

    const daoFactoryInfo = arc.getContractInfoByName(
      'DAOFactoryInstance',
      ARC_VERSION,
    );

    const daoFactoryContract = await arc.getContract(
      daoFactoryInfo.address,
      DAOFactoryABI,
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
      votingMachine: votingMachineInfo.address,
      fundingToken: opts.fundingToken,
      minFeeToJoin: 0, // Make the min fee to 0, simplify request to join logic
      memberReputation: opts.memberReputation,
      // we set the OFFICIAL funding goal to 0 - in the frontend we show the fundingGaol from ipfs data
      // goal: parseInt(opts.fundingGoal, 10),
      goal: 0,
      deadline: opts.fundingGoalDeadline,
      metaData: ipfsHash,
    };
    console.log('Calling DAOFactory.forgeOrg(...)', data);

    const [encodedForgeOrgParams, encodedSetSchemesParams] = getForgeOrgData(data);

    console.log('waiting for forgeOrg transaction to be mined');
    const receipt = await daoFactoryContract.sendToRelayerWithReceipt(
      'forgeOrg',
      [encodedForgeOrgParams, encodedSetSchemesParams]
    );

    // console.log('forgeOrg receipt ->', receipt);
    console.log('forgeOrg transaction was mined..');

    // Get the new avatar address of the thing that was just created..
    const newOrgEvent = receipt.events.NewOrg;
    const newOrgAddress = newOrgEvent._avatar;

    console.log(`Created a Common at ${newOrgAddress} with name "${opts.name}"`);

    console.log('Updating database');
    // we try to update the database, and we will retry four times, which should give us more than enough time
    // for the graph to index the data
    await axios.get(`${graphqlUrl}/update-dao-by-id?daoId=${newOrgAddress}&retries=4`);
    console.log('Common database has been updated');

    return newOrgAddress;
  } catch (e) {
    navigation.pop();
    throw e;
  }
};

