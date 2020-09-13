import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import NavigationBar from 'react-native-navbar';
import Icon from '~/Assets/iconfont/Icon';
import {string, object} from 'prop-types';

const NavigationHeader = ({title, navigation}) => (
  <NavigationBar
    statusBar={{hidden: true}}
    leftButton={
      <TouchableOpacity
        style={{justifyContent: 'center', flexDirection: 'row'}}
        onPress={() => navigation.pop()}>
        <Icon name="left-arrow" size={32} style={{marginLeft: 10}} />
      </TouchableOpacity>
    }
    title={<Text
      style={{
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: 16,
        top: -6,
        marginLeft: 3,
      }}>
      {title}
    </Text>}
  />
);

NavigationHeader.propTypes = {
  title: string,
  navigation: object,
};

export default NavigationHeader;
