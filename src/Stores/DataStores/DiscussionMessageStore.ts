import BaseStore from './BaseStore';
import DiscussionMessageService from '~/Services/DiscussionMessageService';
import {
  FirestoreUnsubscribeFn,
  IFirebaseDoc,
  IFirebaseDocChange,
} from '~/Firebase/types';
import RootStore from '../RootStore';
import {IDiscussionMessageEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionMessageEntity';
import {DiscussionMessage} from '../Models/DiscussionMessage';
import {runInAction} from 'mobx';
import {showBackendError} from '~/Util';

export default class DiscussionMessageStore extends BaseStore<
  DiscussionMessage,
  IDiscussionMessageEntity
> {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  // Data consuming methods
  getDiscussionMessageById = (id: string): DiscussionMessage | undefined => {
    try {
      return this.getDataById(id);
    } catch (errr) {
      // Temporary logic for fetching Discussion Message in case it's not in the store.
      DiscussionMessageService.fetchDiscussionMessageById(id)
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
            prevMessage?.createdAt?.seconds - message?.createdAt?.seconds,
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
    DiscussionMessageService.subscribeToDiscussionsMessages(
      discussionIds,
      this.updateStoreData,
    );

  subscribeToProposalDiscussionMessages = (
    proposalId: string,
  ): FirestoreUnsubscribeFn =>
    DiscussionMessageService.subscribeToProposalDiscussionMessages(
      proposalId,
      this.updateStoreData,
    );

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
