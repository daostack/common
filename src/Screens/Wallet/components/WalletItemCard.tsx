import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, font, text} from '~/Theme';
import {observer} from 'mobx-react';
import {CurrencySymbols} from '~/Util/locale';
import {ITEM_ID} from '~/Components/Forms/ModerationForm';
import SectionDivider from '~/Components/CommonAgenda/SectionDivider';
import FastImage from 'react-native-fast-image';

interface Props {
  userName?: string;
  description?: string;
  date: string;
  image: string;
  id: number;
  amount: number;
}

const WalletItemCard = (props: Props) => {
  const {userName, description, date, image, amount} = props;

  return (
    <View style={styles.cardView}>
      <View style={styles.header}>
        <Text
          style={[
            styles.amount,
            {color: amount > 0 ? colors.lightishGreen : colors.error},
          ]}>{`${CurrencySymbols.SHEKEL}${amount}`}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <SectionDivider />
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
};

export default observer(WalletItemCard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  username: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  usernameText: {
    color: colors.greySubtitle,
    fontSize: 14,
    ...font.primary.regular,
  },
  image: {
    height: 30,
    width: 30,
    marginLeft: 10,
    marginRight: 15,
  },
  date: {
    textAlign: 'center',
    fontSize: 15,
  },
  containerBackground: {
    paddingTop: 50,
    backgroundColor: colors.iceBlue,
  },
  cardView: {
    backgroundColor: colors.white,
    marginHorizontal: 25,
    marginVertical: 10,
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
    padding: 10,
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
    marginLeft: 10,
  },
  listContainer: {
    backgroundColor: colors.grey5,
  },
});
