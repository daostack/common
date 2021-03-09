import React, {ReactElement} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, font} from '~/Theme';

type Props = {
    label: string;
    infoLabel: string;
}

export const Label = ({label, infoLabel}: Props): ReactElement => (
    <View style={{flexDirection: 'row', marginBottom: 8}}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.infoLabel}>{infoLabel}</Text>
    </View>
  );

  const styles = StyleSheet.create({
    label: {
      ...font.primary.regular,
      ...font.fontSize(2),
      lineHeight: font.lineHeightForm,
      letterSpacing: 0,
      color: colors.slate,
      alignSelf: 'flex-start',
    },
    infoLabel: {
      marginBottom: 0,
      lineHeight: font.lineHeightForm,
      ...font.primary.italic,
      ...font.fontSize(2),
      color: colors.paleblue,
      textAlign: 'right',
      flex: 1,
    },
  });
