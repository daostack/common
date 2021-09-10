import BaseStore from './BaseStore';
import {
  subscribeToUserNotifications,
  fetchNotifications,
  fetchNotificationById,
  changeNotificationSeenStatus,
} from '~/Services/ListServices/NotificationListService';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import {
  NotificationSeenStatus,
  NotificationType,
} from '~/Graphql/Notification/NotificationType';
import RootStore from '../RootStore';
import {
  EventTypeState,
  INotificationEntity,
  IProposalNotificationData,
} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {Notification} from '../Models/Notification';
import {action, computed, observable, ObservableMap} from 'mobx';
import Logger from '~/Services/Logger';
import {IDiscussionMessageEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionMessageEntity';
import {Discussion} from '../Models/Discussion';
import {Proposal} from '../Models/Proposal';
import {showBackendError} from '~/Util';

export default class NotificationStore extends BaseStore<
  Notification,
  NotificationType
> {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  @observable
  private notifications: ObservableMap<string, Notification> = observable.map(
    {},
  );

  @observable
  private loadedNotifications: ObservableMap<string, Notification> =
    observable.map({});

  @computed
  get myNotificationsValues() {
    return this.toDataArray(this.notifications);
  }

  @action
  loadNotifications = async (page: number = 0): Promise<void> => {
    if (page === 0) {
      this.notifications.clear();
    }
    const notifications = await fetchNotifications(page);

    const notificationsMap = new Map<string, Notification>();
    notifications.forEach((item) => {
      notificationsMap.set(item.id, item);
    });
    this.notifications.forEach((value, key) => {
      if (!notificationsMap.has(key)) {
        notificationsMap.set(key, value);
      }
    });
    this.notifications = observable.map(notificationsMap);
  };

  // Data consuming methods
  getNotificationById = async (
    id: string,
  ): Promise<Notification | undefined> => {
    try {
      return this.getDataByIdAndCollections(id, [
        this.notifications,
        this.loadedNotifications,
      ]);
    } catch (error) {
      try {
        const notification = await fetchNotificationById(id);
        this.loadedNotifications.set(id, notification as Notification);
        return notification;
      } catch (err) {}
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
            new Date(prevNotification.createdAt).valueOf() -
            new Date(notification.createdAt).valueOf(),
        );
      return notif;
    } catch (error) {
      return [];
    }
  }

  @computed
  get hasNewNotifications() {
    return (
      (this.toDataArray(this.notifications)?.filter(
        (notification: Notification) =>
          notification.notificationItemState?.seen === false,
      )?.length || 0) > 0
    );
  }

  @action
  setNotificationItemState = async (
    notificationId: string,
    newState: NotificationSeenStatus,
  ) => {
    const currentNotification = await changeNotificationSeenStatus(
      notificationId,
      newState,
    );
    if (currentNotification) {
      this.notifications.set(notificationId, currentNotification);
    }
    Logger.warn(
      'Not found notification while trying to update notification seen status',
      notificationId,
    );
  };

  @action
  removeSeenStateForNewNotifications = () => {
    const updatedNotification = new Map<string, Notification>();
    this.notifications.forEach((value, key) => {
      updatedNotification.set(key, {
        ...value,
        notificationItemState: {
          seen: true,
          opened: value.notificationItemState.opened,
        },
      });
    });
    console.log('--updatedNotification', updatedNotification);
    this.notifications = observable.map(updatedNotification);
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
      const notificationFromStore =
        this.rootStore.notificationStore.getNotificationById(entity.id);
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

  async getProposalNotificationData(
    eventObjectId: string,
  ): Promise<IProposalNotificationData | null> {
    let user = null;
    let common = null;
    let proposal = await this.rootStore.proposalStore.getProposalById(
      eventObjectId,
    );
    if (proposal && proposal.commonId && proposal.user) {
      common = await this.rootStore.commonStore.getCommonById(
        proposal.commonId,
      );
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

  async getParentDiscussion(
    message: IDiscussionMessageEntity,
  ): Promise<Discussion | Proposal> {
    const discussion = await this.rootStore.discussionStore.getDiscussionById(
      message.discussionId,
    );
    if (discussion) {
      return discussion as Discussion;
    }
    const proposal = await this.rootStore.proposalStore.getProposalById(
      message.discussionId,
    );

    return proposal as Proposal;
  }
}
