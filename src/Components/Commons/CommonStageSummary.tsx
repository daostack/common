import React, {ReactElement} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {font, layout, text} from '~/Theme';
import {CurrencySymbols} from '~/Util/locale';
import {CommonNumberBox} from './CommonNumberBox';
import {formatMoney} from '~/Util/FormatUtil';

interface Props {
  isCommonCard: boolean;
  time: number;
  activeProposals: number;
  goal: number;
  members: number;
  raised: number;
  balance: number;
  reservedBalance: number;
}

const CommonStageSummary = ({
  /* TODO: Currently not used */
  // time,
  // activeProposals,
  // goal
  isCommonCard,
  members,
  raised,
  balance,
  reservedBalance,
}: Props): ReactElement => (
  <View style={styles.commonProgressContainer}>
    <View style={styles.commonNumbers}>
      <CommonNumberBox
        numberComponent={
          <Text style={styles.headerTitle}>
            {CurrencySymbols.SHEKEL}
            {formatMoney(isCommonCard ? raised / 100 : balance / 100)}
          </Text>
        }
        title={isCommonCard ? 'Raised' : 'Available funds'}
        inProcessFunds={isCommonCard ? null : reservedBalance}
      />
      <CommonNumberBox
        numberComponent={
          <Text style={styles.headerTitle}>
            {isCommonCard
              ? members
              : CurrencySymbols.SHEKEL + formatMoney(raised / 100)}
          </Text>
        }
        title={isCommonCard ? 'Members' : 'Raised'}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  commonProgressContainer: {
    ...layout.content,
    paddingVertical: 0,
  },
  commonNumbers: {
    padding: 10,
    ...layout.flexRow,
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    ...text.h3Black,
    ...font.primary.bold,
    ...font.lineHeight(2),
    ...font.fontSize(4),
    paddingTop: 5,
  },
  headerTitleLight: {
    ...text.h3Black,
  },
  subtitleContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitleText: {
    ...text.smallBlackText,
    ...text.fontColorGreySteel,
    marginRight: 5,
  },
});

export default React.memo(CommonStageSummary);
