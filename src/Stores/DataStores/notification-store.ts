import {flow, makeAutoObservable} from 'mobx';
import {getByUidAndObjectId, getNotificationByUid} from '../data-sources';
import {getCurrentUser} from '~/Firebase';

import {Linking} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import validUrl from 'valid-url';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import DeepLinking from 'react-native-deep-linking';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';
import Logger from '~/Services/Logger';
import { BOTTOM_SHEET } from '~/Screens/BottomSheetScreens';

const Actions = CommonActions.Action | 


function setup(store: NotificationStore) {

  DeepLinking.addScheme('common://');
  DeepLinking.addScheme('com.daostack.common://');
  DeepLinking.addScheme('https://app.common.io');

  Linking.addEventListener('url', store.handleOpenURL);

  DeepLinking.addRoute('/common/:id', (response: {id: string}) => {
    store.routing(NAVIGATION_SCREENS.COMMON_PROFILE, {commonId: response.id});
  });

  DeepLinking.addRoute('/proposal/:id', (response: {id: string}) => {
    store.routing(NAVIGATION_SCREENS.PROPOSAL_SCREEN, {proposalId: response.id});
  });

  DeepLinking.addRoute('/user/:id', (response: {id: string}) => {
    bottomSheetStore.showBottomSheet(
      BOTTOM_SHEET.USER_PROFILE_SHEET_SCREEN,
      {userId: response.id},
    );
  });

  DeepLinking.addRoute('/discussion/:id', (response: {id: string}) => {
    store.routing(NAVIGATION_SCREENS.DISCUSSIONS, {discussionId: response.id});
  });

  const foregroundLink = dynamicLinks().onLink(handleOpenURL);
  dynamicLinks()
    .getInitialLink()
    .then((link) => {
      if (link) {
        store.handleOpenURL(link);
      } else {
        Linking.getInitialURL()
          .then((url) => url && store.handleOpenURL({url}))
          .catch((err) => err);
      }
    });
  return () => {
    Linking.removeEventListener('url', handleOpenURL);
    foregroundLink();
  };
}

export class NotificationStore {
  notificationRouting: CommonActions.Action | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getByUid = (uid: string) => getNotificationByUid(uid);

  getByUidAndObjectId = (uid: string, eventObjectId: string) =>
    getByUidAndObjectId(uid, eventObjectId);

  // Data consuming methods
  get loggedUserNotifications() {
    return this.getByUid(getCurrentUser()!.uid);
  }

  get hasNewNotifications() {
    return this.loggedUserNotifications.map(
      (notification) => notification.seen,
    );
  }

  routing(screenName: NAVIGATION_SCREENS, params: any) {
    switch(screenName) {
      case NAVIGATION_SCREENS.BOTTOM_SHEET: {

      }
      default: {
        this.notificationRouting = CommonActions.navigate({
          name: screenName,
          params: params,
        });
      }
    }
  }

  handleOpenURL = (function*(this: NotificationStore, {url}: {url: string}) {
    if (url) {
      const supported: boolean = yield Linking.canOpenURL(url);
      if (supported && !DeepLinking.evaluateUrl(url) && validUrl.isWebUri(url)) {
        Logger.log(`Routing Browser -> ${url}`);
        this.routing(NAVIGATION_SCREENS.BROWSER, {url: url});
      }
    }
  }
}
