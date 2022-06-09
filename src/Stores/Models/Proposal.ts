import {makeAutoObservable} from 'mobx';
import {firebase} from '~/Firebase';
import {
  CalculatedVotes,
  ProposalGlobal,
} from '~/Firebase/Databasee/EntityTypes/governance/proposals/BaseProposal';
import {IModerationEntity} from '~/Firebase/Databasee/EntityTypes/IModerationEntity';
import {ProposalType} from '~/Firebase/Databasee/EntityTypes/proposals/Proposal';
import {PROPOSALS, PROPOSAL_STATE} from '~/Shared/enums/proposals';
import {BaseModel} from './BaseModel';

export class Proposal implements BaseModel<ProposalType> {
  commonId: string;
  proposerId: string;
  title: string;
  description: string;
  images: string[];
  files: string[];
  amount?: number | null;

  id: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;

  // Governance
  global?: ProposalGlobal;
  local?: Record<string, unknown>;
  limitations?: Record<string, unknown>;
  votes?: CalculatedVotes;
  data?: {expiresOn: firebase.firestore.Timestamp} & Record<string, unknown>;
  state?: PROPOSAL_STATE;
  approvalDate?: firebase.firestore.Timestamp | null;
  type?: PROPOSALS;
  moderation?: IModerationEntity;

  constructor(newProposalInfo: ProposalType) {
    this.commonId = newProposalInfo.commonId;
    this.proposerId = newProposalInfo.proposerId;
    this.title = newProposalInfo.title;
    this.description = newProposalInfo.description;
    this.images = newProposalInfo.images;
    this.files = newProposalInfo.files;
    this.amount = newProposalInfo?.amount;
    this.id = ''; //newProposalInfo?.id;
    this.createdAt = newProposalInfo?.createdAt;
    this.updatedAt = newProposalInfo?.updatedAt;

    this.global = newProposalInfo.global;
    this.local = newProposalInfo.local;
    this.limitations = newProposalInfo.limitations;
    this.votes = newProposalInfo.votes;
    this.data = newProposalInfo.data;
    this.state = newProposalInfo.state;
    this.approvalDate = newProposalInfo.approvalDate;
    this.type = newProposalInfo.type;
    this.moderation = newProposalInfo.moderation;
    makeAutoObservable(this);
  }
}
