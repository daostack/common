import BaseStore from './BaseStore';
import {subscribeToUserNotifications} from '~/Services/ListServices/NotificationListService';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import RootStore from '../RootStore';
import {
  EventTypeState,
  INotificationEntity,
  IProposalNotificationData,
} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {Notification, NotificationItemState} from '../Models/Notification';
import {action, computed, observable} from 'mobx';
import Logger from '~/Services/Logger';
import {IDiscussionMessageEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionMessageEntity';
import {Discussion} from '../Models/Discussion';
import {Proposal} from '../Models/Proposal';
import {showBackendError} from '~/Util';

export default class NotificationStore extends BaseStore<
  Notification,
  INotificationEntity
> {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  // Data consuming methods
  getNotificationById = (id: string): Notification | undefined => {
    try {
      return this.getDataById(id);
    } catch (error) {
      showBackendError({
        bottomSheetStore: this.rootStore.uiStore.bottomSheetStore,
      });
      return;
    }
  };

  @computed
  get loggedUserNotifications(): Array<Notification> | undefined {
    try {
      const notif = this.getDataArray
        ?.filter(() => true)
        .sort(
          (notification: Notification, prevNotification: Notification) =>
            prevNotification.createdAt?.seconds -
            notification.createdAt?.seconds,
        );
      return notif;
    } catch (error) {
      return [];
    }
  }

  @computed
  get hasNewNotifications() {
    return (
      (this.loggedUserNotifications?.filter(
        (notification: Notification) =>
          notification.notificationItemState?.seen === false,
      )?.length || 0) > 0
    );
  }

  @action
  setNotificationItemState = (
    notificationId: string,
    newState: Partial<NotificationItemState>,
  ) => {
    const currentNotification = this.getNotificationById(notificationId);
    if (currentNotification) {
      currentNotification.notificationItemState = {
        seen: newState.seen || currentNotification.notificationItemState.seen,
        opened:
          newState.opened || currentNotification.notificationItemState.opened,
      };
    }
    Logger.warn(
      'Not found notification while trying to update notifciationItemState',
      notificationId,
    );
  };

  @action
  removeSeenStateForNewNotifications = () => {
    const newNotificationsList = this.loggedUserNotifications?.filter(
      (notification: Notification) =>
        notification.notificationItemState?.seen === false,
    );
    newNotificationsList?.forEach((notificationItem: Notification) => {
      notificationItem.notificationItemState = {
        seen: true,
        opened: notificationItem.notificationItemState.opened,
      };
    });
  };

  //Actions
  subscribeToLoggedUserNotifications = (): FirestoreUnsubscribeFn[] | null =>
    this.rootStore.authStore.signedInUser
      ? subscribeToUserNotifications(
          this.rootStore.authStore.signedInUser,
          this.updateStoreData,
        )
      : null;

  @action
  deleteUserNotifications = () => {
    this.data = observable.map({});
  };

  @action
  addWelcomeNotification = () => {
    const welcomeNotification = {
      id: EventTypeState.welcomeNotification,
      createdAt: this.rootStore.authStore.userInfo?.createdAt,
      updatedAt: this.rootStore.authStore.userInfo?.createdAt,
      eventObjectId: '',
      userFilter: [],
      eventType: EventTypeState.welcomeNotification,
    } as INotificationEntity;

    this.setData(
      EventTypeState.welcomeNotification,
      this.getEntityModel(welcomeNotification),
    );
  };

  // Overriden methods
  getEntityModel(entity: INotificationEntity): Notification {
    const defaultNotificationItemState = {
      seen: false,
      opened: false,
    };

    let notificationItemState = defaultNotificationItemState;

    if (this.rootStore.notificationStore.exists(entity.id)) {
      const notificationFromStore = this.rootStore.notificationStore.getNotificationById(
        entity.id,
      );
      // It's possible to have undefined notificationItemState for existing Notification in the store,
      // because of old notifications, before the implementation of the feature with the dot indicator.
      // So, we are setting a default state to such of prorposals for safety.
      notificationItemState =
        notificationFromStore?.notificationItemState ||
        defaultNotificationItemState;
    }

    const newNotif = new Notification(entity, notificationItemState);
    return newNotif;
  }

  getProposalNotificationData(
    eventObjectId: string,
  ): IProposalNotificationData | null {
    let user = null;
    let common = null;
    let proposal = this.rootStore.proposalStore.getProposalById(eventObjectId);
    if (proposal) {
      common = this.rootStore.commonStore.getCommonById(proposal.commonId);
      user = proposal.user;
    }

    if (proposal && user && common) {
      return {
        proposal,
        common,
        user,
      } as IProposalNotificationData;
    } else {
      return null;
    }
  }

  getParentDiscussion(
    message: IDiscussionMessageEntity,
  ): Discussion | Proposal {
    return (
      (this.rootStore.discussionStore.getDiscussionById(
        message.discussionId,
      ) as Discussion) ||
      (this.rootStore.proposalStore.getProposalById(
        message.discussionId,
      ) as Proposal)
    );
  }
}
