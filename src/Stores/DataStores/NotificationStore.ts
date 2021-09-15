import BaseStore from './BaseStore';
import {
  fetchNotifications,
  fetchNotificationById,
  changeNotificationSeenStatus,
  markAsSeenNotifications,
} from '~/Services/ListServices/NotificationListService';
import {
  NotificationSeenStatus,
  NotificationType,
} from '~/Graphql/Notification/NotificationType';
import RootStore from '../RootStore';
import {
  EventTypeState,
  IProposalNotificationData,
} from '~/Graphql/Notification/NotificationType';
import {Notification} from '../Models/Notification';
import {action, computed, observable, ObservableMap} from 'mobx';
import Logger from '~/Services/Logger';
import {DiscussionMessageType} from '~/Graphql/Message/MessageType';
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
  removeSeenStateForNewNotifications = async (): Promise<void> => {
    const ids: string[] = [];
    const updatedNotification = new Map<string, Notification>();
    this.notifications.forEach((value, key) => {
      if (!value.notificationItemState.seen) {
        ids.push(key);
      }
      updatedNotification.set(key, {
        ...value,
        notificationItemState: {
          seen: true,
          opened: value.notificationItemState.opened,
        },
      });
    });
    this.notifications = observable.map(updatedNotification);
    if (ids.length > 0) {
      await markAsSeenNotifications(ids);
    }
  };

  @action
  deleteUserNotifications = () => {
    this.notifications.clear();
  };

  @action
  addWelcomeNotification = (userId?: string) => {
    if (userId) {
      const welcomeNotification = {
        id: EventTypeState.welcomeNotification,
        createdAt: this.rootStore.authStore.userInfo?.createdAt,
        updatedAt: this.rootStore.authStore.userInfo?.createdAt,
        eventObjectId: '',
        userFilter: [],
        eventType: EventTypeState.welcomeNotification,
        commonId: null,
        proposalId: null,
        discussionId: null,
        userId,
        show: true,
        seenStatus: NotificationSeenStatus.Done,
      } as NotificationType;

      this.notifications.set(
        EventTypeState.welcomeNotification,
        this.getEntityModel(welcomeNotification),
      );
    }
  };

  // Overriden methods
  getEntityModel(entity: NotificationType): Notification {
    return new Notification(entity);
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
