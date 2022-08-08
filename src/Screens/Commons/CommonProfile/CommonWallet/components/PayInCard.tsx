import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, font} from '~/Theme';
import {observer} from 'mobx-react';
import {CurrencySymbols} from '~/Util/locale';
import SectionDivider from '~/Components/CommonAgenda/SectionDivider';
import FastImage from 'react-native-fast-image';
import {useStore} from '~/Util/hooks/useStore';
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
}

export const PayInCard = observer((props: Props) => {
  const {userId, description, date, amount} = props;
  const actualAmount = amount?.amount;
  const userStore = useStore('userStore');
  const user = userStore.getUserById(userId);
  const image = user?.photoURL;
  const userName = user?.firstName;
  const dateForm = moment(new Date(date?.seconds * 1000)).format('D MMM, YYYY');

  return (
    <View style={styles.cardView}>
      <View style={styles.header}>
        <Text
          style={[
            styles.amount,
            {color: actualAmount > 0 ? colors.lightishGreen : colors.error},
          ]}>{`${actualAmount > 0 ? '+' : '-'} ${CurrencySymbols.SHEKEL}${
          actualAmount / 100
        }`}</Text>
        <Text style={styles.date}>{dateForm}</Text>
      </View>
      <SectionDivider padding={15} />
      {userName ? (
        <View style={styles.username}>
          <FastImage
            source={{
              uri: image,
            }}
            style={styles.image}
          />
          <Text style={styles.usernameText}>{userName}</Text>
        </View>
      ) : (
        <Text style={styles.description}>{description}</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 8,
  },
  username: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 8,
    paddingBottom: 15,
  },
  usernameText: {
    color: 'rgba(0, 26, 54, 0.3)',
    fontSize: 12,
    ...font.primary.regular,
  },
  image: {
    backgroundColor: colors.grey3,
    height: 24,
    width: 24,
    marginRight: 8,
    borderRadius: 15,
  },
  date: {
    textAlign: 'center',
    fontSize: 12,
    ...font.primary.regular,
    fontWeight: '400',
    color: colors.black,
  },
  containerBackground: {
    paddingTop: 50,
    backgroundColor: colors.iceBlue,
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
  balance: {
    textAlign: 'center',
    ...font.primary.regular,
    fontSize: 14,
    color: colors.greySubtitle,
    marginTop: 20,
  },
  amount: {
    textAlign: 'center',
    ...font.primary.bold,
    fontSize: 22,
  },
  listContainer: {
    backgroundColor: colors.grey5,
  },
});
