import {makeAutoObservable} from 'mobx';
import {FLAGS} from '~/Components/Moderation/constants';
import {PROPOSAL_TYPE} from '~/Config';
import {firebase} from '~/Firebase';
import {IModerationEntity} from '~/Firebase/Databasee/EntityTypes/IModerationEntity';
import {
  IFundingRequestDescription, IFundingRequestProposal, IJoinReqDescription, IJoinRequestProposal,
  IProposalEntity,
  IProposalFundingRequest,
  IProposalJoin,
  IProposalVote,
  ProposalType,
} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {PROPOSAL_STAGE} from '~/Services/ProposalService';
import {BaseModel} from './BaseModel';

export class Proposal implements BaseModel<IProposalEntity> {
  id: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  proposerId: string;
  commonId: string;
  type: ProposalType;
  votes: IProposalVote[];
  state: string;
  countdownPeriod: number;
  quietEndingPeriod: number;
  votesFor: number;
  votesAgainst: number;
  paymentState?: string | null = null;
  fundingRequest: IProposalFundingRequest | undefined | null = null;
  join: IProposalJoin | undefined | null = null;
  description: IFundingRequestDescription | IJoinReqDescription;
  moderation?: IModerationEntity | null = null;

  get isJoinRequest() {
    return this.type === PROPOSAL_TYPE.Join;
  }

  get isFundingRequest() {
    return this.type === PROPOSAL_TYPE.FundingRequest;
  }

  get isCountdown() {
    return this.state === PROPOSAL_STAGE.countdown;
  }

  get funding() {
    if (this.type === PROPOSAL_TYPE.Join) {
      return (this as IJoinRequestProposal).join.funding;
    } else {
      return (this as IFundingRequestProposal).fundingRequest.amount;
    }
  }

  get fundingFormatted() {
    return this.funding / 100;
  }

  get progressBarWidthPercent() {
    return (this.votesFor / (this.votesFor + this.votesAgainst)) * 100;
  }

  get votesCount() {
    return this.votesFor + this.votesAgainst;
  }

  get isModerationHidden() {
    return this.moderation && this.moderation?.flag === FLAGS.hidden;
  }

  get countdown() {
    return (
      this.moderation?.quietEnding ||
      this.moderation?.updatedAt.seconds + this.moderation?.countdownPeriod ||
      this.createdAt.seconds + this?.countdownPeriod
    );
  }

  constructor(newProposalInfo: IProposalEntity) {
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
    this.description = newProposalInfo.description;
    this.moderation = newProposalInfo.moderation;
    if (this.type === PROPOSAL_TYPE.Join) {
      this.paymentState = (
        newProposalInfo as IJoinRequestProposal
      ).paymentState;
      this.join = (newProposalInfo as IJoinRequestProposal).join;
      // TODO: ... more props
    }
    //if (this.type === PROPOSAL_TYPE.FundingRequest) {
    this.fundingRequest = (
      newProposalInfo as IFundingRequestProposal
    ).fundingRequest;
    // TODO: ... more props
    //}
    makeAutoObservable(this);
  }
}
