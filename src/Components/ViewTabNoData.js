import {StyleSheet, View, Text} from 'react-native';
import React from 'react';
import {layout, colors, font, sizeXL} from '../Theme';

const ViewTabNoData = ({title, subtitle}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...layout.content,
    backgroundColor: 'transparent',
    height: 'auto',
    // paddingHorizontal: sizeXL,
  },
  subtitle: {
    ...font.primary.regular,
    fontSize: 16,
    textAlign: 'center',
    color: colors.black,
    ...layout.marginTopS,
    ...layout.marginBottomXL,
  },
  title: {
    ...font.primary.bold,
    ...font.fontSize(3),
    color: colors.black,
  },
});

export default React.memo(ViewTabNoData);
