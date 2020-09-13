import React from 'react';
import {TouchableOpacity} from 'react-native';
import NavigationBar from 'react-native-navbar';
import Icon from '~/Assets/iconfont/Icon';
import {text} from '~/Theme';
import {string, object} from 'prop-types';

const RequestStepNavigation = ({navigation, title}) => (
  <NavigationBar
    statusBar={{hidden: true}}
    style={{
      height: 48,
    }}
    title={{
      title: title,
      style: text.h3Black,
    }}
    leftButton={
      <TouchableOpacity
        style={{justifyContent: 'center'}}
        onPress={() => navigation.pop()}>
        <Icon name="left-arrow" size={32} style={{marginLeft: 10}} />
      </TouchableOpacity>
    }
  />
);


RequestStepNavigation.propTypes = {
  navigation: object,
  title: string,
};

export default RequestStepNavigation;
