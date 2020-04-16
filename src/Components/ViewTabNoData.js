import {StyleSheet, View, Text} from 'react-native';
import React from 'react';
import {layout, colors, text, sizeXXL} from '../Theme';

const ViewTabNoData = ({title, subtitle}) => {
  return (
    <View
      style={{
        ...layout.content,
        backgroundColor: colors.grey5,
        height: 'auto',
        padding: 40,
        paddingHorizontal: 50,
      }}>
      <Text style={{...text.h2Black, color: colors.grey3}}>{title}</Text>
      <Text
        style={{
          ...text.h3Black,
          fontWeight: 'normal',
          textAlign: 'center',
          color: colors.grey3,
          ...layout.marginTopS,
        }}>
        {subtitle}
      </Text>
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

export default ViewTabNoData;
