import {observer} from 'mobx-react';
import React, {ReactElement, ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {layout, text} from '~/Theme';
import {CurrencySymbols} from '~/Util/locale';

interface Props {
  numberComponent: ReactNode;
  title: string;
  inProcess?: number | null;
}

export const CommonNumberBox = observer(
  ({numberComponent, title, inProcess}: Props): ReactElement => (
    <View style={styles.numberBoxContainer}>
      <Text style={styles.headerSmallText}>{title}</Text>
      <View style={styles.raisedContainer}>{numberComponent}</View>
      {Number(inProcess) > 0 && (
        <Text style={styles.inProcessText}>
          In process: {CurrencySymbols.SHEKEL}
          {inProcess}
        </Text>
      )}
    </View>
  ),
);

const styles = StyleSheet.create({
  numberBoxContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerSmallText: {
    ...text.smallBlackText,
    ...text.fontColorGreySteel,
  },
  raisedContainer: {
    ...layout.flexRow,
  },
  inProcessText: {
    ...text.smallBlackText,
  },
});
