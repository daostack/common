import BaseStore from './BaseStore';
import {
  fetchDiscussionMessageById,
  subscribeToProposalDiscussionMessages,
} from '~/Services/ListServices/DiscussionMessageListService';
import {FirestoreUnsubscribeFn, IFirebaseDoc} from '~/Firebase/types';
import RootStore from '../RootStore';
import {MessageType} from '~/Graphql/Message/MessageType';
import {DiscussionMessage} from '../Models/DiscussionMessage';
import {action, computed, observable, ObservableMap, runInAction} from 'mobx';
import {showBackendError} from '~/Util';
//import {ProposalEntity} from '~/Graphql/Proposal';
//import {createDiscussion} from '~/Services/ListServices/DiscussionListService';
import moment from 'moment';

export default class DiscussionMessageStore extends BaseStore<
  DiscussionMessage,
  MessageType
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
  loadDiscussionMessages = (discussionMessages: DiscussionMessage[]) => {
    this.discussionMessages.clear;

    discussionMessages.sort((a, b) => {
      const [aDate, bDate] = [moment(a.createdAt), moment(b.createdAt)];
      return aDate.isBefore(bDate) ? a : b;
    });

    discussionMessages.map((message) => {
      this.discussionMessages.set(message.id, message);
    });
  };

  @action
  loadProposalMessages = (proposalMessages: DiscussionMessage[]) => {
    this.proposalMessages.clear;
    proposalMessages.map((message) => {
      this.proposalMessages.set(message.id, message);
    });
  };

  // Not in use anyways, TODO to be removed
  getDiscussionMessageById = (
    discussionId: string,
  ): DiscussionMessage | undefined => {
    try {
      return this.getDataById(discussionId);
    } catch (errr) {
      // Temporary logic for fetching Discussion Message in case it's not in the store.
      fetchDiscussionMessageById(id)
        .then((discussion: IFirebaseDoc<MessageType>) => {
          if (discussion.exists) {
            runInAction(() => {
              this.setData(
                discussionId,
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

  subscribeToProposalDiscussionMessages = (
    proposalId: string,
  ): FirestoreUnsubscribeFn =>
    subscribeToProposalDiscussionMessages(proposalId, this.updateStoreData);

  // Overriden methods
  getEntityModel(entity: MessageType): DiscussionMessage {
    return new DiscussionMessage(entity);
  }
}
