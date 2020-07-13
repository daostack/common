import {IpfsClient} from '../../Config';
import WalletManager from '../../Util/WalletManager';
import {graphqlUrl} from '../../Config';
const { getForgeOrgData } = require('@daostack/common-factory');
const DAOFactoryABI = require('@daostack/common-factory/abis/DAOFactory');
import axios from 'axios';

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
  try {
  // need these keys:
    console.log('Create Common');
    const MANDATORY_ARGS = [
      'name',
      'minFeeToJoin',
      'fundingGoal',
      'fundingGoalDeadline',
    ];

    for (const key of MANDATORY_ARGS) {
      if (Object.keys(givenOpts).indexOf(key) === -1) {
        console.log(givenOpts);
        const msg = `${key} is a mandatary option for the createCommon function`;
        console.error(msg);
        throw Error(msg);
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

    await arc.fetchContractInfos();

    // console.log('opts: ', opts);
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
      minFeeToJoin: opts.minFeeToJoin,
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

    // const OVERRIDES = {
    //   gasLimit: 10000000,
    //   gasPrice: 15000000000,
    // };
    // const receipt = await daoFactoryContract.forgeOrg(encodedForgeOrgParams, encodedSetSchemesParams, OVERRIDES);

    console.log('forgeOrg receipt ->', receipt);
    console.log('forgeOrg transaction was mined..');

    // Get the new avatar address of the thing that was just created..
    const newOrgEvent = receipt.events.NewOrg;
    const newOrgAddress = newOrgEvent._avatar;

    console.log(`Created a DAO at ${newOrgAddress} with name "${opts.name}"`);

    // Wait for 3 seconds then update database
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('Updating database');
    await axios.get(`${graphqlUrl}/update-dao-by-id?daoId=${newOrgAddress}`);
    console.log('Common database have been updated');
    
    return newOrgAddress;
  } catch (e) {
    navigation.pop();
    throw e;
  }
};
