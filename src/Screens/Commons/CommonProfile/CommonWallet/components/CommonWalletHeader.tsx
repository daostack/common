import React, {ReactElement} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IconPendingBalance} from '~/Assets/iconfont/IconPendingBalance';
import {Common} from '~/Stores/Models/Common';
import {colors, font, text} from '~/Theme';
import {formatMoney} from '~/Util/FormatUtil';
import {CurrencySymbols} from '~/Util/locale';

interface CommonWalletHeaderProps {
  common: Common | undefined;
  children: ReactElement;
}

export const CommonWalletHeader = (props: CommonWalletHeaderProps) => {
  const {common, children} = props;
  const insets = useSafeAreaInsets();
  return (
    <>
      <View style={[styles.containerBackground, {paddingTop: insets.top}]}>
        <Text style={[text.h1BlackTitle, styles.screenTitle]}>
          Common Wallet
        </Text>
        <Text style={styles.subtitle}>{common?.name}</Text>
        <View style={styles.cardView}>
          <Text style={styles.balance}>Balance</Text>
          <Text style={text.h2Black}>{`${CurrencySymbols.SHEKEL} ${formatMoney(
            common?.balance / 100,
          )}`}</Text>
          <View style={styles.subTitleContainer}>
            <Text style={styles.price}>
              Pending soon{' '}
              <Text style={styles.priceText}>{` ${
                CurrencySymbols.SHEKEL
              } ${formatMoney(common?.reservedBalance / 100)}  `}</Text>
            </Text>
            <IconPendingBalance size={16} />
          </View>
        </View>
      </View>
      {children}
    </>
  );
};

const styles = StyleSheet.create({
  screenTitle: {
    marginBottom: 8,
  },
  containerBackground: {
    backgroundColor: colors.iceBlue,
  },
  cardView: {
    backgroundColor: colors.white,
    marginHorizontal: 24.5,
    marginVertical: 24,
    shadowColor: 'rgba(0, 0, 0, 0.22)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    elevation: 2,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  subtitle: {
    textAlign: 'center',
    ...font.primary.regular,
    fontSize: 16,
    color: colors.mainBlue,
    fontWeight: 'bold',
  },
  balance: {
    textAlign: 'center',
    ...font.primary.regular,
    fontWeight: '600',
    fontSize: 14,
    color: colors.greySubtitle,
    marginTop: 16,
  },
  price: {
    textAlign: 'center',
    ...font.primary.regular,
    fontSize: 12,
    color: colors.greySubtitle,
    alignItems: 'center',
  },
  priceText: {
    ...font.primary.bold,
  },
  subTitleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 13,
    marginBottom: 8,
  },
});
