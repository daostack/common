import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import NavigationBar from 'react-native-navbar';
import Icon from '~/Assets/iconfont/Icon';

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
  },
  icon: { marginLeft: 20 },
});

const CreateStepNavigation = props => {
  return (
    <NavigationBar
      statusBar={{ hidden: true }}
      title={{
        title: props.title,
      }}
      leftButton={
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.pop()}>
          <Icon name="left-arrow" size={28} style={styles.icon} color="black" />
        </TouchableOpacity>
      }
    />
  );
};

export default CreateStepNavigation;
