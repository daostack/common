import {makeAutoObservable} from 'mobx';
import {getCommonDiscussions, getDiscussionById} from '../data-sources';

export class DiscussionStore {
  constructor() {
    makeAutoObservable(this);
  }

  getDiscussionById = (id: string) => getDiscussionById(id);

  getCommonDiscussions = (commonId: string) => getCommonDiscussions(commonId);
}
