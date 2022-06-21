import {firebase} from '~/Firebase';
import {makeAutoObservable} from 'mobx';
import {CommonMember} from '~/Firebase/Databasee/EntityTypes/commons/CommoneMembers';
import {
  AllowedActions,
  AllowedProposals,
} from '~/Firebase/Databasee/EntityTypes/governance/Circles';
import {Reputation} from '~/Firebase/Databasee/EntityTypes/governance/Reputation';

export class CommonMemberModel implements CommonMember {
  id: string;
  userId: string;
  joinedAt: firebase.firestore.Timestamp;
  circles: number;
  allowedActions: AllowedActions;
  allowedProposals: AllowedProposals;
  tokenBalance: number;
  reputation: Partial<Reputation>;

  constructor(newCommonMember: CommonMember) {
    this.id = newCommonMember.id;
    this.userId = newCommonMember.userId;
    this.joinedAt = newCommonMember.joinedAt;
    this.circles = newCommonMember.circles;
    this.allowedActions = newCommonMember.allowedActions;
    this.allowedProposals = newCommonMember.allowedProposals;
    this.tokenBalance = newCommonMember.tokenBalance;
    this.reputation = newCommonMember.reputation;
    makeAutoObservable(this);
  }
}
