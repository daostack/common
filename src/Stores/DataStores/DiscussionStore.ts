import BaseStore from './BaseStore';
import {
  subscribeToCommonDiscussions,
  subscribeToDiscussionById,
  fetchDiscussionId,
  fetchDiscussions,
} from '~/Services/ListServices/DiscussionListService';
import {FirestoreUnsubscribeFn, IFirebaseDoc} from '~/Firebase/types';
import RootStore from '../RootStore';
import Logger from '~/Services/Logger';
import {IDiscussionEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionEntity';
import {Discussion as DiscussionModel} from '../Models/Discussion';
import {runInAction, action, computed, observable, ObservableMap} from 'mobx';
import {showBackendError} from '~/Util';
import {Discussion} from '~/Graphql/Discussion';

export default class DiscussionStore extends BaseStore<
  DiscussionModel,
  IDiscussionEntity
> {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  @observable
  private discussions: ObservableMap<string, DiscussionModel> = observable.map(
    {},
  );

  @computed
  get commonDiscussions() {
    return this.toDataArray(this.discussions);
  }

  // Data consuming methods
  getDiscussionById = async (id: string): Promise<DiscussionModel | void> => {
    try {
      return this.getDataByIdAndCollections(id, [this.discussions]);
    } catch (err) {
      // Temporary logic for fetching Discussion in case it's not in the store.
      return fetchDiscussionId(id)
        .then((discussion: DiscussionModel) => {
          this.discussions.set(id, discussion);
          return discussion;
        })
        .catch(() => {
          Logger.info('getDiscussionById-error ~>', id);
          showBackendError({
            bottomSheetStore: this.rootStore.uiStore.bottomSheetStore,
          });
        });
    }
  };

  getCommonDiscussions = (
    commonId: string,
  ): Array<IDiscussionEntity> | undefined =>
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
  getEntityModel(entity: IDiscussionEntity): DiscussionModel {
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

    const discussionsMap = new Map<string, DiscussionModel>();

    discussions.forEach((item) => {
      if (!this.discussions.has(item.id)) {
        discussionsMap.set(item.id, item);
      }
    });

    this.discussions = observable.map(discussionsMap);
  };
}
