/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import Icon from '../../Assets/iconfont/Icon';

const CreateStepNavigation = (props) => {
  return (
    <NavigationBar
      statusBar={{hidden: true}}
      leftButton={
        <TouchableOpacity
          style={{justifyContent: 'center', flexDirection: 'row'}}
          onPress={() => props.navigation.pop()}>
          <Icon name="left-arrow" size={32} style={{marginLeft: 10}} />
          <Text
            style={{
              fontWeight: 'bold',
              alignSelf: 'center',
              fontSize: 16,
              top: -6,
              marginLeft: 3,
            }}>
            {props.title}
          </Text>
        </TouchableOpacity>
      }
    />
  );
};

export default CreateStepNavigation;
