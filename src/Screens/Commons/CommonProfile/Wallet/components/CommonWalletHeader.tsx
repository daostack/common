import React, {Children} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, font, text} from '~/Theme';
import {formatMoney} from '~/Util/FormatUtil';
import {CurrencySymbols} from '~/Util/locale';
import {WalletTabs} from '~/Screens/Commons/CommonProfile/Wallet/components/CommonWalletTabs';

export const CommonWalletHeader = (props) => {
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
          <Text style={styles.price}>
            Pending soon{' '}
            <Text style={styles.priceText}>{` ${
              CurrencySymbols.SHEKEL
            } ${formatMoney(common?.reservedBalance / 100)}`}</Text>
          </Text>
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
    marginTop: 13,
    marginBottom: 8,
  },
  priceText: {
    ...font.primary.bold,
  },
});
