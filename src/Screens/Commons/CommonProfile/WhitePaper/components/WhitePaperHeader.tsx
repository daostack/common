import React, {Children} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, font, text} from '~/Theme';

type WhitePaperHeaderProps = {
  common: object;
};

export const WhitePaperHeader = ({common}: WhitePaperHeaderProps) => {
  const insets = useSafeAreaInsets();
  return (
    <>
      <View style={[styles.containerBackground, {paddingTop: insets.top}]}>
        <Text style={[text.h1BlackTitle, styles.screenTitle]}>
          {`${common?.name}'s White Paper`}
        </Text>
        <Text style={styles.subtitle}>
          Common's set of guides are managed by user type
        </Text>
      </View>
      {/*children*/}
    </>
  );
};

const styles = StyleSheet.create({
  screenTitle: {
    marginBottom: 8,
    fontSize: 18,
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
    color: colors.greySubtitle,
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
