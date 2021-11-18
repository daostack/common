import React from 'react';
import Intercom from 'react-native-intercom';
import {useStore} from '~/Stores';

export function useIntercom() {
  const {authStore} = useStore();
  React.useEffect(() => {
    if (authStore.userInfo?.uid) {
      Intercom.registerIdentifiedUser({userId: authStore.userInfo?.uid});
    } else {
      Intercom.registerIdentifiedUser({userId: 'guest-' + Date.now()});
    }
  }, [authStore.userInfo?.uid]);
}
