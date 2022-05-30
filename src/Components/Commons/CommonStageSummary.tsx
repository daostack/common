import React, {ReactElement} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, layout, text} from '~/Theme';
import {CurrencySymbols} from '~/Util/locale';
import {CommonNumberBox} from './CommonNumberBox';
import {formatMoney} from '~/Util/FormatUtil';
import {Common} from '~/Stores/Models/Common';
import {observer} from 'mobx-react';

interface Props {
  isCommonCard: boolean;
  common: Common;
}

export const CommonStageSummary = observer(
  ({isCommonCard, common}: Props): ReactElement => {
    const members = common?.members?.length;
    const balance = common?.balance;
    const raised = common?.raised;

    return (
      <View style={styles.commonProgressContainer}>
        <View style={styles.commonNumbers}>
          <CommonNumberBox
            numberComponent={
              <Text style={styles.headerTitle}>
                {CurrencySymbols.SHEKEL}
                {formatMoney(isCommonCard ? raised / 100 : balance / 100)}
              </Text>
            }
            title={isCommonCard ? 'Total raised' : 'Available funds'}
          />
          <CommonNumberBox
            numberComponent={
              <Text style={styles.headerTitle}>
                {isCommonCard
                  ? members
                  : CurrencySymbols.SHEKEL + formatMoney(raised / 100)}
              </Text>
            }
            title={isCommonCard ? 'Members' : 'Total raised'}
          />
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  commonProgressContainer: {
    ...layout.content,
    paddingVertical: 0,
  },
  commonNumbers: {
    paddingHorizontal: 10,
    ...layout.flexRow,
    width: '100%',
    paddingTop: 18,
  },
  headerTitle: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
    paddingVertical: 4.4,
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
