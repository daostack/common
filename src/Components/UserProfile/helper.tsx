import React from 'react';
import {View} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';

export const getProviderIcon = (provider: string) => {
  let icon = null;
  switch (provider) {
    case 'facebook.com':
      icon = <Icon name={'facebook'} size={16} />;
      break;
    case 'phone':
      icon = <Icon name="phone" size={16} />;
      break;
    case 'apple.com':
      icon = <Icon name="apple-logo" size={16} />;
      break;
    default:
      icon = <Icon name="google" size={20} />;
  }
  return <View style={{marginHorizontal: 5}}>{icon}</View>;
};
