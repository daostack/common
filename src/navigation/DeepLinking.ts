import {useState, useEffect, useCallback} from 'react';
import {Linking} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import validUrl from 'valid-url';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import DeepLinking from 'react-native-deep-linking';
import {BOTTOM_SHEET} from '~/Stores/BottomSheet';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';
import Logger from '~/Services/Logger';
import {useStore} from '~/Stores';

export const useDeepLinks = () => {
  const {
    uiStore: {bottomSheetStore},
    notificationStore,
  } = useStore();
  const [
    notificationRouting,
    setNotificationRouting,
  ] = useState<CommonActions.Action | null>(null);

  const routing = useCallback((screenName: NAVIGATION_SCREENS, params: any) => {
    const actions = CommonActions.navigate({
      name: screenName,
      params: params,
    });
    setNotificationRouting(actions);
  }, []);

  // Deep & Dynamic Link
  const handleOpenURL = ({url}: {url: string}) => {
    if (url) {
      Linking.canOpenURL(url).then((supported) => {
        if (!supported) {
          return;
        }
        if (!DeepLinking.evaluateUrl(url) && validUrl.isWebUri(url)) {
          Logger.log(`Routing Browser -> ${url}`);
          routing(NAVIGATION_SCREENS.BROWSER, {url: url});
        }
      });
    }
  };

  useEffect(() => {
    DeepLinking.addScheme('common://');
    DeepLinking.addScheme('com.daostack.common://');
    DeepLinking.addScheme('https://app.common.io');

    Linking.addEventListener('url', handleOpenURL);

    DeepLinking.addRoute('/common/:id', (response: {id: string}) => {
      routing(NAVIGATION_SCREENS.COMMON_PROFILE, {commonId: response.id});
    });

    DeepLinking.addRoute('/proposal/:id', (response: {id: string}) => {
      routing(NAVIGATION_SCREENS.PROPOSAL_SCREEN, {proposalId: response.id});
    });

    DeepLinking.addRoute('/user/:id', (response: {id: string}) => {
      bottomSheetStore.showBottomSheet(BOTTOM_SHEET.USER_PROFILE_SHEET_SCREEN, {
        userId: response.id,
      });
    });

    DeepLinking.addRoute('/discussion/:id', (response: {id: string}) => {
      routing(NAVIGATION_SCREENS.DISCUSSIONS, {discussionId: response.id});
    });

    const foregroundLink = dynamicLinks().onLink(handleOpenURL);
    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        if (link) {
          handleOpenURL(link);
        } else {
          Linking.getInitialURL()
            .then((url) => url && handleOpenURL({url}))
            .catch((err) => err);
        }
      });

    return () => {
      Linking.removeEventListener('url', handleOpenURL);
      foregroundLink();
    };
  }, []);
};
