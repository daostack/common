import {action, observable, runInAction} from 'mobx';
import BottomSheetStore from './BottomSheetStore';
import AppLoaderStore from './AppLoaderStore';
import RootStore from './RootStore';
import {getCurrentConversionRate} from '~/Util/locale';
import NotificationService from '~/Services/NotificationService';
import {persist} from 'mobx-persist';
import {Notification} from './Models/Notification';

export default class UIStore {
  rootStore: RootStore;
  bottomSheetStore: BottomSheetStore;
  appLoaderStore: AppLoaderStore;

  @observable
  conversionRate: number = 0;

  @observable
  lastNotificationIsUnread: boolean = false;

  checkNotificationsUnRead = () => {
    const notifications: Array<Notification> = this.rootStore.notificationStore.getLoggedUserNotifications();
    NotificationService.isNotificationRead(notifications[0].id).then(
      (lastNotificationRead) => {
        runInAction(() => {
          this.lastNotificationIsUnread = !lastNotificationRead;
        });
      },
    );
  };

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
