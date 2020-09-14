import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import NavigationBar from 'react-native-navbar';
import Icon from '~/Assets/iconfont/Icon';

const NavigationHeader = (props) => (
  <NavigationBar
    statusBar={{hidden: true}}
    leftButton={
      <TouchableOpacity
        style={{justifyContent: 'center', flexDirection: 'row'}}
        onPress={() => props.navigation.pop()}>
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
      {props.title}
    </Text>}
  />
);

export default NavigationHeader;
