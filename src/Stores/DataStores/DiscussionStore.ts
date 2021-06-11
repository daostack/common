import BaseStore from './BaseStore';
import {
  subscribeToCommonDiscussions,
  subscribeToDiscussionById,
  fetchDiscussionId,
  fetchDiscussions,
} from '~/Services/ListServices/DiscussionListService';
import {FirestoreUnsubscribeFn, IFirebaseDoc} from '~/Firebase/types';
import RootStore from '../RootStore';
import {IDiscussionEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionEntity';
import {Discussion as DiscussionModel} from '../Models/Discussion';
import {runInAction, action, computed, observable} from 'mobx';
import {showBackendError} from '~/Util';
import {Discussion} from '~/Graphql/Discussion';

export default class DiscussionStore extends BaseStore<
  Discussion,
  IDiscussionEntity
> {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  @observable
  private discussions: Discussion[] = [];

  @computed
  get commonDiscussions() {
    return this.discussions;
  }

  // Data consuming methods
  getDiscussionById = (id: string): Discussion | undefined => {
    try {
      return this.getDataById(id);
    } catch (errr) {
      // Temporary logic for fetching Discussion in case it's not in the store.
      fetchDiscussionId(id)
        .then((discussion: IFirebaseDoc<IDiscussionEntity>) => {
          if (discussion.exists) {
            runInAction(() => {
              this.setData(
                id,
                this.getEntityModel(this.firestoreDocToEntity(discussion)),
              );
            });
          }
        })
        .catch(() => {
          showBackendError({
            bottomSheetStore: this.rootStore.uiStore.bottomSheetStore,
          });
        });
      return undefined;
    }
  };

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

  //Actions
  subscribeToDiscussionById = (discussionId: string): FirestoreUnsubscribeFn =>
    subscribeToDiscussionById(discussionId, this.updateStoreData);

  // helper function
  // if discussion already exists in database,
  // we don't want to initialize isExpanded with the default true value,
  // but the current isExpanded state of the discussion
  getIsExpanded = (discussionId: string): boolean => {
    try {
      const existingDiscussion = this.getDataById(discussionId);
      if (existingDiscussion) {
        return existingDiscussion.isExpanded;
      }
    } catch (err) {}
    return true;
  };

  // Overriden methods
  getEntityModel(entity: IDiscussionEntity): any {
    return new DiscussionModel(entity, this.getIsExpanded(entity.id));
  }

  @action
  loadCommonDiscussions = async (
    commonId: string,
    page: number = 0,
  ): Promise<void> => {
    const discussions = await fetchDiscussions({
      where: {
        commonId,
      },
      paginate: {
        skip: page * 10,
        take: 10,
      },
    });

    const uniqueDiscussions = [
      ...new Map(
        [...this.discussions, ...discussions].map((item) => [item.id, item]),
      ).values(),
    ];

    this.discussions = uniqueDiscussions;
  };
}
