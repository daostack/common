import {observable, runInAction} from 'mobx';
import BottomSheetStore from './BottomSheetStore';
import AppLoaderStore from './AppLoaderStore';
import RootStore from './RootStore';
import {getCurrentConversionRate} from '~/Util/locale';
import NotificationService from '~/Services/NotificationService';
import {Notification} from './Models/Notification';

export default class UIStore {
  rootStore: RootStore;
  bottomSheetStore: BottomSheetStore;
  appLoaderStore: AppLoaderStore;

  @observable
  conversionRate: number = 0;

  @observable
  lastNotificationIsUnread: boolean = false;

  // checkNotificationsUnRead = () => {
  //   const notifications: Array<Notification> = this.rootStore.notificationStore.getLoggedUserNotifications();
  //   const notificationsRead: string[] = this.rootStore.notificationStore
  //     .notificationsRead;
  //   if (notifications.length > 0) {
  //     runInAction(() => {
  //       this.lastNotificationIsUnread = !notificationsRead.includes(
  //         notifications[0].id,
  //       );
  //     });
  //   }
  // };

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.bottomSheetStore = new BottomSheetStore();
    this.appLoaderStore = new AppLoaderStore();
    getCurrentConversionRate().then((result) => {
      runInAction(() => {
        this.conversionRate = result.data.rates.ILS;
      });
    });
  }
}
