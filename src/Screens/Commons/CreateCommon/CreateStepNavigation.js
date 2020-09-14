import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import NavigationBar from 'react-native-navbar';
import Icon from '~/Assets/iconfont/Icon';
import {string, object} from 'prop-types';

const CreateStepNavigation = ({title, navigation}) => (
  <NavigationBar
    statusBar={{hidden: true}}
    title={{
      title: title,
    }}
    leftButton={
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.pop()}>
        <Icon name="left-arrow" size={28} style={styles.icon} color="black" />
      </TouchableOpacity>
    }
  />
);

CreateStepNavigation.propTypes = {
  title: string,
  navigation: object,
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
  },
  icon: {marginLeft: 20},
});

export default CreateStepNavigation;
