import {StyleSheet, ActivityIndicator, View} from 'react-native';
import React from 'react';
import {layout, colors, sizeXXL} from '../Theme';

const Loader = ({ color }) => {
  return (
    <View styl={styles.loaderContainer}>
      <ActivityIndicator
        size="large"
        color={color || colors.mainBlue}
        style={styles.loader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    ...layout.content,
    alignSelf: 'stretch',
  },
  loader: {
    marginTop: sizeXXL,
    alignSelf: 'center',
  },
});

export default Loader;
