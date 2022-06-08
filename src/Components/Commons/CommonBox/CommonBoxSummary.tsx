import React, {ReactElement} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, font, text} from '~/Theme';
import {CurrencySymbols} from '~/Util/locale';
import {CommonNumberBox} from '../CommonNumberBox';
import {formatMoney} from '~/Util/FormatUtil';

interface Props {
  members: number;
  raised: number;
  balance: number;
}

const CommonBoxSummary = ({members, raised, balance}: Props): ReactElement => (
  <View style={styles.commonNumbers}>
    <CommonNumberBox
      numberComponent={
        <Text style={styles.headerTitle}>
          {CurrencySymbols.SHEKEL}
          {formatMoney(raised / 100)}
        </Text>
      }
      title={'Raised'}
      inProcessFunds={null}
    />
    <CommonNumberBox
      numberComponent={
        <Text style={styles.headerTitle}>
          {CurrencySymbols.SHEKEL}
          {formatMoney(balance / 100)}
        </Text>
      }
      title={'Available funds'}
    />
    <CommonNumberBox
      numberComponent={<Text style={styles.headerTitle}>{members}</Text>}
      title={'Members'}
    />
  </View>
);

const styles = StyleSheet.create({
  commonNumbers: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
  },
  headerTitle: {
    ...font.primary.bold,
    ...font.fontSize(2),
    lineHeight: 28,
  },
  headerTitleLight: {
    ...text.h3Black,
  },
});

export default React.memo(CommonBoxSummary);
