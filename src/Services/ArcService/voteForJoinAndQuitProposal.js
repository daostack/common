

// TODO: add here scripts for createRequestToJoin and createFundingRequest
// import {getArc} from './arc';
// const {ARC_VERSION, OVERRIDES} = require('./arc');
const {first} = require('rxjs/operators');
import {ipfsUpload} from '../../Config';
const {OVERRIDES} = require('../../Config');
import {Arc, Proposal} from '@daostack/arc.js';

export const voteForJoinAndQuitProposal = async (arc, proposalId, data) => {
  
  try {
  
    const proposal = new Proposal(arc, proposalId)
    console.log("Proposal -> ", proposal);

    const voteTransaction = await proposal.vote(data.vote);
    console.log("voteTransaction -> ", voteTransaction);
    
    const receipt = await voteTransaction.send();
    console.log("receipt -> ", receipt);
    

  } catch (e) {
    console.log(e);
    throw e;
  }
};
