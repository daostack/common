import BaseStore from './BaseStore';
import {fetchDiscussionMessageById} from '~/Services/ListServices/DiscussionMessageListService';
import RootStore from '../RootStore';
import {MessageType} from '~/Graphql/Message/MessageType';
import {DiscussionMessage} from '../Models/DiscussionMessage';
import {action, computed, observable, ObservableMap} from 'mobx';
import {showBackendError} from '~/Util';
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

  getDiscussionMessageById = async (
    discussionId: string,
  ): Promise<DiscussionMessage | undefined> => {
    try {
      return this.getDataByIdAndCollections(discussionId, [
        this.proposalMessages,
        this.discussionMessages,
      ]);
    } catch (err) {
      try {
        const message = await fetchDiscussionMessageById(discussionId);
        return new DiscussionMessage(message);
      } catch (error) {
        showBackendError({
          bottomSheetStore: this.rootStore.uiStore.bottomSheetStore,
        });
      }
    }
  };

  // Overriden methods
  getEntityModel(entity: MessageType): DiscussionMessage {
    return new DiscussionMessage(entity);
  }
}
