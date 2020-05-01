const {
  getForgeOrgData,
  getSetSchemesData,
} = require('@daostack/common-factory');
const {ARC_VERSION, OVERRIDES} = require('./arc');

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

async function createCommon(arc, givenOpts = {}) {
  const defaultOptions = {
    fundingToken: '0x0000000000000000000000000000000000000000',
    memberReputation: 1000,
  };
  const opts = {...defaultOptions, ...givenOpts};
  let tx;
  let receipt;

  console.log('fetching contractinfo from graphql...');
  const contractInfo = arc.getContractInfoByName(
    'DAOFactoryInstance',
    ARC_VERSION,
  );
  const contractABI = arc.getABI(undefined, 'DAOFactory', ARC_VERSION);
  const daoFactoryContract = await arc.getContract(
    contractInfo.address,
    contractABI,
  );
  const votingMachineInfo = arc.getContractInfoByName(
    'GenesisProtocol',
    ARC_VERSION,
  );

  console.log('Calling DAOFactory.forgeOrg(...)');
  const forgeOrgData = getForgeOrgData({
    DAOFactoryInstance: contractInfo.address,
    orgName: opts.name,
    founderAddresses: opts.founderAddresses,
    repDist: [opts.memberReputation],
  });
  tx = await daoFactoryContract.forgeOrg(...forgeOrgData, OVERRIDES);
  console.log('waiting for tx to be mined');
  receipt = await tx.wait();
  console.log('done!');
  // get the new avatar address of the thing that was just created..
  const newOrgEvent = receipt.events.filter(e => e.event === 'NewOrg')[0];
  const newOrgAddress = newOrgEvent.args._avatar;

  console.log('Calling DAOFactory.setSchemes(...)');

  const schemeData = getSetSchemesData({
    DAOFactoryInstance: contractInfo.address,
    avatar: newOrgAddress,
    votingMachine: votingMachineInfo.address,
    fundingToken: opts.fundingToken,
    minFeeToJoin: opts.minFeeToJoin,
    memberReputation: opts.memberReputation,
    goal: opts.fundingGoal,
    deadline: opts.deadline,
    metaData: opts.ipfsHash,
  });

  tx = await daoFactoryContract.setSchemes(...schemeData, OVERRIDES);
  console.log('waiting for tx to be mined');
  receipt = await tx.wait();
  console.log(`Created a DAO at ${newOrgAddress} with name "${opts.name}"`);
  return newOrgAddress;
}

module.exports = {createCommon};
