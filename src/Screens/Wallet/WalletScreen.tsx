import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {colors, font, text} from '~/Theme';
import {observer} from 'mobx-react';
import {CurrencySymbols} from '~/Util/locale';
import WalletItemCard from './components/WalletItemCard';

const hardcodeList = [
  {
    id: 1,
    amount: 350,
    username: 'Ivan Santiago',
    image:
      'https://learnenglish.britishcouncil.org/sites/podcasts/files/2021-10/RS6715_492969113-hig.jpg',
    date: '12 Apr, 2022',
  },
  {
    id: 2,
    amount: -350,
    description: 'Launch a facebook campagin to raise awarenessbout the amazon',
    date: '13 Apr, 2022',
  },
  {
    id: 3,
    amount: 890,
    username: 'Ivan Santiago',
    image:
      'https://learnenglish.britishcouncil.org/sites/podcasts/files/2021-10/RS6715_492969113-hig.jpg',
    date: '14 Apr, 2022',
  },
];

const WalletScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.containerBackground}>
        <Text style={text.h1Black}>Common Wallet</Text>
        <Text style={styles.subtitle}>TLV Common</Text>
        <View style={styles.cardView}>
          <Text style={styles.balance}>Balance</Text>
          <Text style={text.h2Black}>{`${CurrencySymbols.SHEKEL} 1,421`}</Text>
          <Text
            style={
              styles.price
            }>{`Pending soon   ${CurrencySymbols.SHEKEL} 660`}</Text>
        </View>
      </View>
      <View style={styles.listContainer}>
        <Text style={[{marginTop: 20}, text.h2Black]}>All Transactions</Text>
        <FlatList
          maxToRenderPerBatch={5}
          initialNumToRender={5}
          listKey="WalletList"
          data={hardcodeList}
          renderItem={({item}) => (
            <WalletItemCard
              key={item.id}
              amount={item.amount}
              userName={item.username}
              image={item.image}
              date={item.date}
              description={item.description}
            />
          )}
        />
      </View>
    </View>
  );
};

export default observer(WalletScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    fontSize: 14,
    color: colors.greySubtitle,
    marginTop: 20,
  },
  price: {
    textAlign: 'center',
    ...font.primary.regular,
    fontSize: 12,
    color: colors.greySubtitle,
    marginTop: 10,
    marginBottom: 8,
  },
  listContainer: {
    backgroundColor: colors.grey5,
  },
});
