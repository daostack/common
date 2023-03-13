import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, font} from '~/Theme';
import {observer} from 'mobx-react';
import {CurrencySymbols} from '~/Util/locale';
import SectionDivider from '~/Components/CommonAgenda/SectionDivider';
import moment from 'moment';

interface Props {
  userId: string;
  description?: string;
  date: {
    seconds: number;
    miliseconds: number;
  };
  image: string;
  id: number;
  amount: {
    amount: number;
    currency: string;
  };
  funded: boolean;
}

export const PayOutCard = observer((props: Props) => {
  const {description, date, amount} = props;
  const actualAmount = amount;
  const dateForm = moment(new Date(date?.seconds * 1000)).format('D MMM, YYYY');

  return (
    <View style={styles.cardView}>
      <View style={styles.header}>
        <Text style={styles.amount}>{`- ${CurrencySymbols.SHEKEL}${
          actualAmount / 100
        }`}</Text>
        <Text style={styles.date}>{dateForm}</Text>
      </View>
      <SectionDivider padding={15} />
      <Text style={styles.description}>{description}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 8,
  },
  date: {
    textAlign: 'center',
    fontSize: 12,
    ...font.primary.regular,
    fontWeight: '400',
    color: colors.black,
  },
  cardView: {
    backgroundColor: colors.white,
    marginHorizontal: 24,
    marginVertical: 4,
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
  description: {
    ...font.primary.regular,
    fontSize: 15,
    paddingHorizontal: 15,
    paddingTop: 8,
    paddingBottom: 15,
    fontWeight: 'bold',
  },
  amount: {
    textAlign: 'center',
    ...font.primary.bold,
    fontSize: 22,
    color: colors.error,
  },
});
