import React, {FC, useEffect} from 'react';
import {WithNavigationRef} from '~/Types/navigation';
import {CommonActions} from '@react-navigation/native';
import AuthStore from '~/Stores/AuthStore';
import {func, shape} from 'prop-types';
import {authStorePropTypes} from '~/Types/propTypes';
import {inject, observer} from 'mobx-react';

type Props = WithNavigationRef & {
  authStore: AuthStore;
};

const UserInfoChecker: FC<Props> = ({navigation, authStore}) => {
  useEffect(() => {
    // console.log('UserInfoChecker');
    // console.log('authStore.userInfo -> ', authStore.userInfo);

    if (authStore.userInfo && navigation.current) {
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
        //navigation.current?.dispatch(navigate);
      }
    }
  }, [navigation, authStore.userInfo]);

  return <></>;
};

UserInfoChecker.propTypes = {
  navigation: shape({
    current: shape({
      dispatch: func.isRequired,
    }).isRequired,
  }).isRequired,
  // @ts-ignore
  authStore: authStorePropTypes.isRequired,
};

export default inject('authStore')(observer(UserInfoChecker));
