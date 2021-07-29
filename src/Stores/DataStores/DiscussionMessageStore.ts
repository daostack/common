import BaseStore from './BaseStore';
import {
  fetchDiscussionMessageById,
  getProposalDiscussionMessages,
  subscribeToDiscussionsMessages,
  subscribeToProposalDiscussionMessages,
} from '~/Services/ListServices/DiscussionMessageListService';
import {
  FirestoreUnsubscribeFn,
  IFirebaseDoc,
  IFirebaseDocChange,
} from '~/Firebase/types';
import RootStore from '../RootStore';
import {IDiscussionMessageEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionMessageEntity';
import {DiscussionMessage} from '../Models/DiscussionMessage';
import {action, computed, observable, ObservableMap, runInAction} from 'mobx';
import {showBackendError} from '~/Util';
import {ProposalEntity} from '~/Graphql/Proposal';
import {createDiscussion} from '~/Services/ListServices/DiscussionListService';
import {IDiscussionEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionEntity';

export default class DiscussionMessageStore extends BaseStore<
  DiscussionMessage,
  IDiscussionMessageEntity
> {
  @observable
  private proposalMessages: ObservableMap<string, DiscussionMessage> =
    observable.map({});

  @observable
  private discussionMessages: ObservableMap<string, DiscussionMessage> =
    observable.map({});

  @observable
  proposalDiscussionId: String | null = null;

  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  @computed
  get getProposalMessages(): readonly DiscussionMessage[] {
    return this.toDataArray(this.proposalMessages);
  }

  @computed
  get getDiscussionMessages(): readonly DiscussionMessage[] {
    return this.toDataArray(this.discussionMessages);
  }

  @action
  loadProposalMessaages = (proposal: ProposalEntity) => {
    if (proposal.discussions.length > 0) {
      this.proposalDiscussionId = proposal.discussions[0].id;
      getProposalDiscussionMessages(proposal.discussions[0].id).then(
        (disscussionMessages: IDiscussionMessageEntity[]) => {
          this.proposalMessages.clear();
          this.proposalMessages.merge(
            this.toEntityModelArr(disscussionMessages),
          );
        },
      );
    } else {
      createDiscussion({
        topic: 'linking discussion',
        description: 'Linking discussion',
        commonId: proposal.commonId,
        proposalId: proposal.id,
      }).then((discussion: IDiscussionEntity) => {
        this.proposalMessages.clear();
        this.proposalDiscussionId = discussion.id;
      });
    }
  };

  // Data consuming methods
  getDiscussionMessageById = (id: string): DiscussionMessage | undefined => {
    try {
      return this.getDataById(id);
    } catch (errr) {
      // Temporary logic for fetching Discussion Message in case it's not in the store.
      fetchDiscussionMessageById(id)
        .then((discussion: IFirebaseDoc<IDiscussionMessageEntity>) => {
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

  getDiscussionMessagesByDiscussionId = (
    discussionId: string,
  ): Array<DiscussionMessage> | undefined => {
    try {
      return this.getDataArray
        ?.filter(
          (message: DiscussionMessage) => message.discussionId === discussionId,
        )
        .sort(
          (message: DiscussionMessage, prevMessage: DiscussionMessage) =>
            prevMessage?.createdAt?.getSeconds() -
            message?.createdAt?.getSeconds(),
        );
    } catch (error) {
      showBackendError({
        bottomSheetStore: this.rootStore.uiStore.bottomSheetStore,
      });
      return;
    }
  };
  //Actions
  subscribeToDiscussionsMessages = (
    discussionIds: Array<string>,
  ): FirestoreUnsubscribeFn =>
    subscribeToDiscussionsMessages(discussionIds, this.updateStoreData);

  subscribeToProposalDiscussionMessages = (
    proposalId: string,
  ): FirestoreUnsubscribeFn =>
    subscribeToProposalDiscussionMessages(proposalId, this.updateStoreData);

  // Overriden methods
  getEntityModel(entity: IDiscussionMessageEntity): DiscussionMessage {
    return new DiscussionMessage(entity);
  }

  firestoreDocChangeToEntity(
    firebaseDoc: IFirebaseDocChange<IDiscussionMessageEntity>,
  ): IDiscussionMessageEntity {
    const entity = super.firestoreDocChangeToEntity(firebaseDoc);
    return {
      ...entity,
      createdAt: entity.createTime,
    };
  }
}
