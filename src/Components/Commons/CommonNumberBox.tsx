import {observer} from 'mobx-react';
import React, {ReactElement, ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {layout, text} from '~/Theme';
import {CurrencySymbols} from '~/Util/locale';

interface Props {
  numberComponent: ReactNode;
  title: string;
  inProcessFunds?: number | null;
}

export const CommonNumberBox = observer(
  ({numberComponent, title, inProcessFunds}: Props): ReactElement => (
    <View style={styles.numberBoxContainer}>
      <Text style={styles.headerSmallText}>{title}</Text>
      <View style={styles.raisedContainer}>{numberComponent}</View>
      {Number(inProcessFunds) > 0 && (
        <Text style={styles.inProcessFundsText}>
          In process: {CurrencySymbols.SHEKEL}
          {Number(inProcessFunds) / 100}
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
  inProcessFundsText: {
    ...text.smallBlackText,
  },
});
