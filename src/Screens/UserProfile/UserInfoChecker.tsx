import React, {FC, useEffect} from 'react';
import {CommonActions} from '@react-navigation/native';
import {useNavigationContainerRef} from '@react-navigation/core';
import {observer} from 'mobx-react';
import {useStore} from '~/Stores';

const UserInfoChecker: FC = () => {
  const {authStore} = useStore();
  const navigation = useNavigationContainerRef();
  useEffect(() => {
    if (navigation && authStore.uid) {
      const {firstName, lastName} = authStore.userInfo || {};

      // always redirect to edit profile when data is empty
      if (!firstName || !lastName) {
        const navigate = CommonActions.navigate({
          name: 'EditProfile',

          params: {
            isCompleteAccount: true,
          },
        });

        // @ts-ignore
        navigation.current?.dispatch(navigate);
      }
    }
  }, [navigation, authStore.uid]);

  return <></>;
};

export default observer(UserInfoChecker);
