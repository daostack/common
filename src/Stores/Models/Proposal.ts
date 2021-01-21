import {observable, decorate} from 'mobx';
import {PROPOSAL_TYPE} from '~/Config';
import {
  IFundingRequestProposal,
  IJoinRequestProposal,
  IProposalEntity,
  IProposalFundingRequest,
  IProposalJoin,
  IProposalVote,
  ProposalType,
} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {
  PROPOSAL_STAGES_ACTIVE,
  PROPOSAL_STAGES_HISTORY,
} from '~/Services/ListServices/ProposalListService';
import {ACTIVE_PAYMENT_STATES} from '~/Util/constants';
import {BaseModel} from './BaseModel';

export class Proposal extends BaseModel<IProposalEntity> {
  // Fields
  id: string = '';
  proposerId: string = '';
  commonId: string = '';
  type: ProposalType = 'join';
  votes: IProposalVote[] = [];
  state: string = '';
  countdownPeriod: number = 0;
  quietEndingPeriod: number = 0;
  votesFor: number = 0;
  votesAgainst: number = 0;
  paymentState: string = '';
  fundingRequest: IProposalFundingRequest | undefined;
  join: IProposalJoin | undefined;

  get isJoinRequest() {
    return this.type === PROPOSAL_TYPE.Join;
  }

  get isActive() {
    return (
      PROPOSAL_STAGES_ACTIVE.some((stg) => stg === this.state) ||
      ACTIVE_PAYMENT_STATES.some((x) => x === this.paymentState)
    );
  }

  get isHistory() {
    return (
      PROPOSAL_STAGES_HISTORY.some((stg) => stg === this.state) &&
      !ACTIVE_PAYMENT_STATES.some((x) => x === this.paymentState)
    );
  }

  get funding() {
    if (this.type === PROPOSAL_TYPE.Join) {
      return this.join?.funding;
    } else {
      return this.fundingRequest?.amount;
    }
  }

  constructor(newProposalInfo: IProposalEntity) {
    super();
    this.id = newProposalInfo.id;
    this.createdAt = newProposalInfo.createdAt;
    this.updatedAt = newProposalInfo.updatedAt;
    this.proposerId = newProposalInfo.proposerId;
    this.commonId = newProposalInfo.commonId;
    this.type = newProposalInfo.type;
    this.votes = newProposalInfo.votes;
    this.state = newProposalInfo.state;
    this.countdownPeriod = newProposalInfo.countdownPeriod;
    this.quietEndingPeriod = newProposalInfo.quietEndingPeriod;
    this.votesFor = newProposalInfo.votesFor;
    this.votesAgainst = newProposalInfo.votesAgainst;
    if (this.type === PROPOSAL_TYPE.Join) {
      this.paymentState = (newProposalInfo as IJoinRequestProposal).paymentState;
      this.join = (newProposalInfo as IJoinRequestProposal).join;
      // TODO: ... more props
    }
    if (this.type === PROPOSAL_TYPE.FundingRequest) {
      this.fundingRequest = (newProposalInfo as IFundingRequestProposal).fundingRequest;
      // TODO: ... more props
    }
  }
}

decorate(Proposal, {
  //observables
  id: observable,
  proposerId: observable,
  commonId: observable,
  type: observable,
  votes: observable,
  state: observable,
  countdownPeriod: observable,
  quietEndingPeriod: observable,
  votesFor: observable,
  votesAgainst: observable,
  paymentState: observable,

  //computed

  //actions
});
