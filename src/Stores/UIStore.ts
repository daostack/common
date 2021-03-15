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

  @persist
  @observable
  lastNotificationIsUnread: boolean = false;

  @action
  checkNotificationsUnRead = async () => {
    const notifications: Array<Notification> = this.rootStore.notificationStore.getLoggedUserNotifications();

    const lastNotificationRead = await NotificationService.isNotificationRead(
      notifications[0].id,
    );
    this.lastNotificationIsUnread = !lastNotificationRead;
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
