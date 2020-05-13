// import {Address} from '../../node_modules/@daostack/arc.js/src'
const {
  getForgeOrgData,
  getSetSchemesData,
} = require('@daostack/common-factory');
const {ARC_VERSION, OVERRIDES} = require('./arc');

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

export const createCommon = async (arc, givenOpts = {}, navigation, daoStore) => {
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
      fundingGoal: [parseInt(opts.fundingGoal)],
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
      goal: parseInt(opts.fundingGoal),
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
    console.log('[Create Common error]: ', e);
    daoStore.creationError(e);
    throw `[Create Common error] ${e}`;
  }
};

const ipfsUpload = async formData => {
  return await IpfsClient.addAndPinString(
    JSON.stringify({
      name: formData.name,
      byline: formData.byline,
      description: formData.description,
      courseOfAction: formData.action,
      mainValue1: formData.funding,
      mainValue2: formData.minimum,
      mainValue3: 'empty value',
    }),
  );
};

// const forgeCommon = async _ipfsHash => {
//   try {
//     const formData = props.createCommonFormStore.getChangedFormFieldsJson();
//     const manager = await WalletManager.getInstance();
//     const wallet = manager.ethWallet;
//     const address = await manager.getOwnerAccount();
//     console.log('owner account: ', address);
//     let contract = new ethers.Contract(
//       '0x565737926597B88da5B851cd2e3d7Ad7F68bAc7F',
//       DAOFactory,
//       provider,
//     );
//     let daoFactory = contract.connect(wallet);
//     let overrides = {
//       gasLimit: 6000000,
//     };
//     //TODO: add funding amounts??
//     const forgeOrgData = getForgeOrgData({
//       DAOFactoryInstance: '0x565737926597B88da5B851cd2e3d7Ad7F68bAc7F',
//       orgName: formData.name,
//       founderAddresses: [address],
//       tokenDist: [0],
//       repDist: [100],
//     });

//     console.log('forgeOrgData: ', forgeOrgData);
//     const forgeOrg = await daoFactory.forgeOrg(...forgeOrgData, overrides);

//     console.log('forgeOrg: ', forgeOrg);

//     const {hash} = forgeOrg;
//     console.log('hash: ', hash);
//     let avatarAddress;
//     contract.on('NewOrg', (_avatarAddress, newValue, event) => {
//       setScheme(_ipfsHash, _avatarAddress);
//     });

//     return {avatarAddress: avatarAddress};
//   } catch (e) {
//     throw 'Send transaction failed with error: ' + e;
//   }
// };

// const setScheme = async (_ipfsHash, _avatarAddress) => {
//   try {
//     const manager = await WalletManager.getInstance();
//     const wallet = manager.ethWallet;
//
//     console.log('ethwallet: ', manager.ethWallet);
//     const address = await manager.getAddress();
//     let contract = new ethers.Contract(
//       '0x565737926597B88da5B851cd2e3d7Ad7F68bAc7F',
//       DAOFactory,
//       provider,
//     );
//     let daoFactory = contract.connect(wallet);
//
//     let overrides = {
//       gasLimit: 6000000,
//     };
//     const setSchemeData = getSetSchemesData({
//       DAOFactoryInstance: '0x565737926597B88da5B851cd2e3d7Ad7F68bAc7F',
//       avatar: _avatarAddress,
//       votingMachine: '0x59EC3731Dca0512678A5F6507d79Cf631005cAd4',
//       joinAndQuitVoteParams:
//         '0x1000000000000000000000000000000000000000000000000000000000000000',
//       fundingRequestVoteParams:
//         '0x1100000000000000000000000000000000000000000000000000000000000000',
//       schemeFactoryVoteParams:
//         '0x1110000000000000000000000000000000000000000000000000000000000000',
//       fundingToken: '0x0000000000000000000000000000000000000000',
//       minFeeToJoin: 100,
//       memberReputation: 100,
//       goal: 1000,
//       deadline: (await provider.getBlock('latest')).timestamp + 3000,
//       metaData: _ipfsHash,
//     });
//
//     console.log('setSchemeData: ', setSchemeData);
//     const setSchemes = await daoFactory.setSchemes(
//       ...setSchemeData,
//       overrides,
//     );
//     console.log('setSchemes: ', setSchemes);
//     const {hash} = setSchemes;
//     console.log('hash: ', hash);
//   } catch (e) {
//     throw 'Send transaction failed with error: ' + e;
//   }
// };
//
// const createCommon = async () => {
//   try {
//     console.log(
//       'commonfields: ',
//       props.createCommonFormStore.getChangedFormFieldsJson(),
//     );
//     const commonFormData = props.createCommonFormStore.getChangedFormFieldsJson();
//     const ipfsHash = await ipfsUpload(commonFormData);
//     await forgeCommon(ipfsHash);
//   } catch (e) {
//     console.log('error: ', e);
//   }
// };
