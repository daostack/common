import {StyleSheet, ActivityIndicator, View} from 'react-native';
import React from 'react';
import {layout, colors, text, sizeL, sizeXXL} from '../Theme';

const Loader = ({}) => {
  return (
    <View styl={styles.loaderContainer}>
      <ActivityIndicator
        size="large"
        color={colors.mainBlue}
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
