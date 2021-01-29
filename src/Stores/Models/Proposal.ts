import {observable, computed} from 'mobx';
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
  @observable
  id: string;

  @observable
  proposerId: string;

  @observable
  commonId: string;

  @observable
  type: ProposalType;

  @observable
  votes: IProposalVote[];

  @observable
  state: string;

  @observable
  countdownPeriod: number;

  @observable
  quietEndingPeriod: number;

  @observable
  votesFor: number;

  @observable
  votesAgainst: number;

  @observable
  paymentState?: string;

  @observable
  fundingRequest: IProposalFundingRequest | undefined;

  @observable
  join: IProposalJoin | undefined;

  @computed
  get isJoinRequest() {
    return this.type === PROPOSAL_TYPE.Join;
  }

  @computed
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
