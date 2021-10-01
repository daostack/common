import BaseStore from './BaseStore';
import {
  fetchDiscussions,
  fetchDiscussionById,
  createDiscussion,
} from '~/Services/ListServices/DiscussionListService';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import RootStore from '../RootStore';
import Logger from '~/Services/Logger';
import {CreateDiscussionInput} from '~/Graphql/Discussion';
import {Discussion as DiscussionModel} from '../Models/Discussion';
import {action, computed, observable, ObservableMap} from 'mobx';
import {showBackendError} from '~/Util';
import {Discussion} from '~/Graphql/Discussion';
import {DiscussionType} from '~/Graphql/Discussion/DiscussionType';

export default class DiscussionStore extends BaseStore<
  DiscussionModel,
  DiscussionType
> {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  @observable
  private discussions: ObservableMap<string, DiscussionModel> = observable.map(
    {},
  );

  @observable
  private proposalDiscussion: DiscussionModel; /*ObservableMap<
    string,
    DiscussionModel
  > = observable.map({});*/

  @computed
  get commonDiscussions() {
    return this.toDataArray(this.discussions);
  }

  @computed
  get proposalDiscussions() {
    return this.proposalDiscussion;
  }

  // Data consuming methods
  getDiscussionById = async (id: string): Promise<DiscussionModel | void> => {
    try {
      return this.getDataByIdAndCollections(id, [this.discussions]);
    } catch (err) {
      // Temporary logic for fetching Discussion in case it's not in the store.
      return await fetchDiscussionById(id)
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
  getEntityModel(entity: DiscussionType): DiscussionModel {
    return new DiscussionModel(entity, this.getIsExpanded(entity.id));
  }

  @action
  createCommonDiscussion = async (
    discussion: CreateDiscussionInput,
  ): Promise<void> => {
    await createDiscussion(discussion);
    this.loadCommonDiscussions(discussion.commonId);
  };

  @action
  loadCommonDiscussions = async (
    commonId: string,
    page: number = 0,
  ): Promise<void> => {
    if (page === 0) {
      this.discussions.clear();
    }

    const discussions = await fetchDiscussions({
      where: {
        commonId,
      },
      paginate: {
        skip: page * 10,
        take: 10,
      },
    });

    const discussionsMap = new Map<string, DiscussionModel>(
      this.discussions.toJS(),
    );

    discussions.forEach((item) => {
      if (!this.discussions.has(item.id)) {
        discussionsMap.set(item.id, item);
      }
    });

    this.discussions = observable.map(discussionsMap);
  };

  getProposalDiscussionById = async (id: string): Promise<DiscussionModel> =>
    await fetchDiscussionById(id);
}
