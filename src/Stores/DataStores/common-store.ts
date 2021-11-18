import {makeAutoObservable} from 'mobx';
import {Common} from '../Models/Common';
import {
  getProposals,
  getCommonByUserId,
  getFeaturedCommons,
  getCommonByIds,
} from '../data-sources';
import {getCurrentUser} from '../Models/auth';
import {PROPOSAL_STAGE, PROPOSAL_TYPE} from '~/Types';

export class CommonStore {
  isLoading: boolean = false;
  constructor() {
    makeAutoObservable(this);
  }

  getCommonById = (id: string) => new Common(`daos/${id}`);

  get myCommons() {
    const uid = getCurrentUser()?.uid;
    if (uid) {
      return getCommonByUserId(uid);
    }
    return [];
  }

  get myActiveMembershipRequests() {
    return getProposals({
      uid: getCurrentUser()!.uid,
      type: 'user',
      params: {
        type: PROPOSAL_TYPE.Join,
        stage: PROPOSAL_STAGE.Active,
      },
    });
  }

  get pendingCommons() {
    return getCommonByIds(
      this.myActiveMembershipRequests?.map((proposal) => proposal.commonId) ||
        [],
    );
  }

  get featuredCommons() {
    return getFeaturedCommons([
      ...this.myCommons.map((common) => common.id),
      ...this.pendingCommons.map((common) => common.id),
    ]);
  }

  get sections() {
    const groupTitle = (title: string, arrLength: number) =>
      arrLength > 0 ? `${title} (${arrLength})` : '';

    if (getCurrentUser()) {
      const myDaosGroup = {
        title: groupTitle('My Commons', this.myCommons.length),
        data: this.myCommons,
      };
      const pendingDaosGroup = {
        title: groupTitle('Pending', this.pendingCommons.length),
        data: this.pendingCommons,
      };
      const featuredDaosGroup = {
        title: 'Featured',
        data: this.featuredCommons,
      };
      return [myDaosGroup, pendingDaosGroup, featuredDaosGroup];
    } else {
      return [
        {
          title: 'Featured',
          data: this.featuredCommons,
        },
      ];
    }
  }
}
