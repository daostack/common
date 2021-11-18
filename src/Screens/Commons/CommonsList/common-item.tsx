import React from 'react';
import {CommonActions} from '@react-navigation/routers';
import {CommonBox} from '~/Components';
import {useNavigation} from '@react-navigation/core';
import {Common} from '~/Stores/Models';

// eslint-disable-next-line react/prop-types
export const CommonItem: React.FC<{common: Common}> = ({common}) => {
  const navigation = useNavigation();
  const navigateToCommon = React.useCallback(() => {
    const navigate = CommonActions.navigate({
      name: 'CommonProfile',
      params: {
        currCommon: common,
      },
    });

    navigation.dispatch(navigate);
  }, []);
  return (
    <CommonBox
      common={common}
      width="100%"
      key={common.id}
      onPress={() => navigateToCommon()}
    />
  );
};
