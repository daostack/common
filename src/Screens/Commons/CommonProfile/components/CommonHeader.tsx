import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Common} from '~/Stores/Models/Common';
import {colors, font, text} from '~/Theme';

interface HeaderProps {
  common: Common;
  title: string;
}

export const CommonHeader = (props: HeaderProps) => {
  const {common, title} = props;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, {paddingTop: insets.top}]}>
      <Text style={[text.h1BlackTitle, styles.screenTitle]}>{title}</Text>
      <Text style={styles.subtitle}>{common?.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.iceBlue,
  },
  screenTitle: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    ...font.primary.regular,
    fontSize: 16,
    color: colors.mainBlue,
    fontWeight: 'bold',
    paddingBottom: 15,
  },
});
