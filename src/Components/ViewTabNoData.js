import {StyleSheet, View, Text} from 'react-native';
import React from 'react';
import {layout, colors, text} from '../Theme';

const ViewTabNoData = ({title, subtitle}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...layout.content,
    backgroundColor: colors.grey5,
    height: 'auto',
    padding: 40,
    paddingHorizontal: 50,
  },
  subtitle: {
    ...text.h3Black,
    fontWeight: 'normal',
    textAlign: 'center',
    color: colors.grey3,
    ...layout.marginTopS,
  },
  title: {
    ...text.h2Black,
    color: colors.grey3,
  },
});

export default React.memo(ViewTabNoData);
