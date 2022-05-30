import {makeAutoObservable} from 'mobx';
import {firebase} from '~/Firebase';
import {ProposalType} from '~/Firebase/Databasee/EntityTypes/basicArgsProposal';
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
    makeAutoObservable(this);
  }
}
