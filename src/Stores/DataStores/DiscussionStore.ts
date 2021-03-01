import BaseStore from './BaseStore';
import {subscribeToCommonDiscussions} from '~/Services/ListServices/DiscussionListService';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import RootStore from '../RootStore';
import {IDiscussionEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionEntity';
import {Discussion} from '../Models/Discussion';

export default class DiscussionStore extends BaseStore<
  Discussion,
  IDiscussionEntity
> {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  // Data consuming methods
  getDiscussionById = (id: string): IDiscussionEntity | undefined =>
    this.getDataById(id);

  getCommonDiscussions = (commonId: string): Array<Discussion> | undefined =>
    this.getDataArray
      ?.filter((discussion: Discussion) => discussion.commonId === commonId)
      .sort(
        (discussion: Discussion, prevDiscussion: Discussion) =>
          prevDiscussion.lastMessage.seconds - discussion.lastMessage.seconds,
      );

  //Actions
  subscribeToCommonDiscussions = (commonId: string): FirestoreUnsubscribeFn =>
    subscribeToCommonDiscussions(commonId, this.updateStoreData);

  // Overriden methods
  getEntityModel(entity: IDiscussionEntity): Discussion {
    return new Discussion(entity);
  }
}
