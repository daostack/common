import {StyleSheet, ActivityIndicator, Text, View} from 'react-native';
import React from 'react';
import {layout, colors, text, sizeL, sizeXXL} from '../Theme';

const AppHeader = ({title, leftButton, rightButton}) => {
  return (
    <View styl={styles.loaderContainer}>
      <View>
        <Text>{title}</Text>
      </View>
      <View>{rightButton}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    ...layout.content,
    ...layout.flexRow,
    justifyContent: 'space-between',
  },
  loader: {
    marginTop: sizeXXL,
    alignSelf: 'center',
  },
});

export default AppHeader;
