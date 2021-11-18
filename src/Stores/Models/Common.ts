import {formatNumber} from '~/Util';
import {
  CommonRegister,
  ICommonEntity,
  ICommonLink,
  ICommonMember,
  ICommonMetadata,
  ICommonRule,
} from '~/Types';

import {BaseDocument} from './base-document';

import {getCurrentUser} from './auth';
import {PERMISSIONS} from '~/Types';

export class Common extends BaseDocument<ICommonEntity> {
  get name(): string {
    return this.data.name;
  }
  get image(): string {
    return this.data.image;
  }
  get balance(): number {
    return this.data.balance;
  }
  get raised(): number {
    return this.data.raised;
  }
  get fundingGoalDeadline(): number {
    return this.data.fundingGoalDeadline;
  }
  get members(): ICommonMember[] {
    return this.data.members;
  }
  get rules(): ICommonRule[] {
    return this.data.rules;
  }
  get links(): ICommonLink[] {
    return this.data.links;
  }
  get metadata(): ICommonMetadata {
    return this.data.metadata;
  }
  get register(): CommonRegister {
    return this.data.register;
  }

  get raisedFormatted(): string {
    return formatNumber(this.raised / 100).toString();
  }

  get balanceFormatted(): string {
    return formatNumber(this.balance / 100).toString();
  }

  get minFeeToJoinFormatted(): string {
    const minValue = this.metadata.zeroContribution
      ? 0
      : +this.metadata.minFeeToJoin;
    return formatNumber(minValue / 100).toString();
  }

  getPermission = (uid?: string) => {
    uid = uid || getCurrentUser()?.uid;
    if (!uid) {
      return undefined;
    }
    if (this.metadata?.founderId === uid) {
      return PERMISSIONS.FOUNDER;
    } else {
      const memberObj = this.members.find(
        (member) => member.userId === uid && member.permission,
      );
      return memberObj?.permission;
    }
  };

  isMember = (uid?: string) => {
    uid = uid || getCurrentUser()?.uid;
    if (!uid) {
      return false;
    }
    return this.members.find((member) => member.userId === uid);
  };
  get isUserMember() {
    return this.isMember();
  }

  isModeratorUid(uid?: string) {
    return this.getPermission(uid) === PERMISSIONS.MODERATOR;
  }

  get isModerator() {
    return this.getPermission() === PERMISSIONS.MODERATOR;
  }
  get currentUserPermissions() {
    return this.getPermission();
  }

  get isMonthly() {
    return this.metadata.contributionType === 'monthly';
  }
  get numberOfBoostedProposals() {
    throw 'missing implementation';
  }
  get numberOfPreBoostedProposals() {
    throw 'missing implementation';
  }
  get numberOfQueuedProposals() {
    throw 'missing implementation';
  }
  get fundingGoal() {
    throw 'missing implementation';
  }
}
