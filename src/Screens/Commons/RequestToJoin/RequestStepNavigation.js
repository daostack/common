import React from 'react';
import { TouchableOpacity } from 'react-native';
import NavigationBar from 'react-native-navbar';
import Icon from '~/Assets/iconfont/Icon';
import { text } from '~/Theme';

const RequestStepNavigation = props => {
  return (
    <NavigationBar
      statusBar={{ hidden: true }}
      style={{
        height: 48,
      }}
      title={{
        title: props.title,
        style: text.h3Black,
      }}
      leftButton={
        <TouchableOpacity
          style={{ justifyContent: 'center' }}
          onPress={() => props.navigation.pop()}>
          <Icon name="left-arrow" size={32} style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      }
    />
  );
};

export default RequestStepNavigation;
