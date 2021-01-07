import {StyleSheet, View, Text} from 'react-native';
import React from 'react';
import {layout, colors, font} from '~/Theme';
import {string} from 'prop-types';

const ViewTabNoData = ({title, subtitle}) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
  </View>
);

ViewTabNoData.propTypes = {
  title: string,
  subtitle: string,
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
