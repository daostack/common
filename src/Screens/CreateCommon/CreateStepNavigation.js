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

const CreateStepNavigation = (props) => {
  // const rightButtonConfig = {
  //   title: 'Next',
  //   // handler: () => alert('hello!'),
  // };

  // const titleConfig = {
  //   title: 'Hello, world',
  // };

  return (
    <View style={styles.container}>
      <NavigationBar title={'test'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CreateStepNavigation;
