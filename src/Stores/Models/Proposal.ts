import {observable, computed} from 'mobx';
import {PROPOSAL_STAGE} from '~/Services/ListServices/ProposalListService';
import {BaseModel} from './BaseModel';
//import ImageSize from 'react-native-image-size';
//import {promisedComputed} from 'computed-async-mobx';
//import Logger from '~/Services/Logger';
import {ModerationType, REPORT_FLAG} from '~/Graphql/Report';
import {UserModel} from './UserModel';
import {
  ProposalType,
  ProposalEntity,
  ProposalJoin,
  ProposalFunding,
  JoinRequestEntity,
  FundingProposalEntity,
  VoteOutcome,
} from '~/Graphql/Proposal';
import {Vote} from '~/Graphql/Votes';
import {Discussion} from '~/Graphql/Discussion';

export class Proposal extends BaseModel<ProposalEntity> {
  @observable
  id: string;

  @observable
  userId: string;

  @observable
  user: UserModel;

  @observable
  commonId: string;

  @observable
  type: ProposalType;

  @observable
  votes: Vote[];

  @observable
  state: string;

  @observable
  expiresAt: Date;

  @observable
  votesFor: number;

  @observable
  votesAgainst: number;

  @observable
  paymentState?: string;

  @observable
  funding: ProposalFunding | undefined;

  @observable
  join: ProposalJoin | undefined;

  @observable
  title: string;

  @observable
  description: string;

  @observable
  discussions: Discussion[];

  @observable
  moderation?: ModerationType;

  @computed
  get isJoinRequest() {
    return this.type === ProposalType.JOIN_REQUEST;
  }

  @computed
  get isFundingRequest() {
    return this.type === ProposalType.FUNDING_REQUEST;
  }

  @computed
  get isCountdown() {
    return this.state === PROPOSAL_STAGE.countdown;
  }

  @computed
  get fundingAmount() {
    return this.type === ProposalType.JOIN_REQUEST
      ? this.join?.funding
      : this.funding?.amount;
  }

  @computed
  get fundingFormatted() {
    return (this.fundingAmount || 0) / 100;
  }

  @computed
  get progressBarWidthPercent() {
    return (this.votesFor / (this.votesFor + this.votesAgainst)) * 100;
  }

  @computed
  get votesCount() {
    return this.votes.length;
  }

  @computed
  get isModerationHidden() {
    return this.moderation && this.moderation?.flag === REPORT_FLAG.Hidden;
  }

  @computed
  get countdown() {
    return (
      this.moderation?.updatedAt + this.moderation?.expiresAt ||
      this.createdAt + (this?.expiresAt || 0)
    );
  }

  @computed
  get votesForCount() {
    return this.votesFor;
  }

  @computed
  get votesAgainstCount() {
    return this.votesAgainst;
  }

  constructor(newProposalInfo: ProposalEntity) {
    super(newProposalInfo);
    this.id = newProposalInfo.id;
    this.createdAt = new Date(newProposalInfo.createdAt);
    this.updatedAt = new Date(newProposalInfo.updatedAt);
    this.userId = newProposalInfo.userId;
    this.user = newProposalInfo.user;
    this.commonId = newProposalInfo.commonId;
    this.type = newProposalInfo.type;
    this.votes = newProposalInfo.votes;
    this.state = newProposalInfo.state;
    this.expiresAt = new Date(newProposalInfo.expiresAt);
    [this.votesFor, this.votesAgainst] = [this.countVotes(VoteOutcome.APPROVE), this.countVotes(VoteOutcome.CONDEMN)];
    this.description = newProposalInfo.description;
    this.title = newProposalInfo.title;
    this.moderation = {
      reports: newProposalInfo.reports,
      flag: newProposalInfo.flag,
    };
    //this.images = newProposalInfo.images;
    if (this.type === ProposalType.JOIN_REQUEST) {
      this.paymentState = (newProposalInfo as JoinRequestEntity).paymentState;
      this.join = (newProposalInfo as JoinRequestEntity).join;
      // TODO: ... more props
    }
    if (this.type === ProposalType.FUNDING_REQUEST) {
      this.funding = (newProposalInfo as FundingProposalEntity).funding;
      // TODO: ... more props
    }
    this.discussions = newProposalInfo.discussions;
  }

  countVotes(state: string) {
    return this.votes.filter((vote) => vote.outcome === state).length;
  }
}
