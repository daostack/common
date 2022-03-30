import {observer} from 'mobx-react-lite';
import React, {useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {Card} from '~/Stores/Models/Card';
import {colors, font, text} from '~/Theme';
import {baseMargin} from '~/Theme/layout';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';

interface Props {
  handleSelectCard: (card: Card) => void;
  card: Card | undefined;
}

export const CardItem = observer(({card, handleSelectCard}: Props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const handlePress = useCallback(() => {
    console.log('pressed');
    //handleSelectCard(card);
  }, []);

  const addPaymentMethod = () => (
    <View style={styles.cardBox}>
      <FastImage
        style={styles.addPaymentImage}
        source={require('~/Assets/addPaymentMethod.png')}
        resizeMode="cover"
      />
      <Text style={styles.addPaymentText}>
        Add a payment method for future contributions
      </Text>
      <Pressable
        onPress={() => navigation.navigate('ChoosePaymentMethodStep')}
        style={({pressed}) => [
          {
            opacity: pressed ? 0.5 : 1.0,
          },
          styles.addPaymentButton,
        ]}>
        <Text style={text.buttonblue}>Add a new card</Text>
      </Pressable>
    </View>
  );

  return card ? (
    <Pressable
      onPress={handlePress}
      style={({pressed}) => [
        {
          opacity: pressed ? 0.5 : 1.0,
        },
        styles.container,
      ]}>
      <>
        <FastImage
          style={styles.paymentSystemLogo}
          source={require('~/Assets/mastercard.png')}
          resizeMode="cover"
        />
        <View style={styles.cardInfoContainer}>
          <View />
          {/* <Text style={[styles.text, styles.cardholderName]}>{card.metadata?.owner}</Text> */}
          <Text style={styles.text}>********{card?.metadata?.digits}</Text>
          <Text style={styles.text}>{card?.fullName}</Text>
        </View>
        {/* <View style={styles.expirationDateContainer}>
        <Text style={styles.text}>{card.metadata?.expirationDate}</Text>
      </View> */}
      </>
    </Pressable>
  ) : (
    addPaymentMethod()
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'space-around',
    marginVertical: baseMargin * 1.5,
    borderRadius: 10,
    width: '90%',
    height: '30%',
    alignSelf: 'center',

    shadowColor: 'rgba(10, 10, 10, 0.2)',
    shadowOffset: {width: 1, height: 13},
    shadowOpacity: 1,
    shadowRadius: 15,
    padding: 10,
    elevation: 6,
    backgroundColor: 'white',
  },
  addPaymentImage: {
    width: 64,
    height: 50,
  },
  cardBox: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: baseMargin * 1.5,
    borderRadius: 10,
    width: '90%',
    paddingVertical: 15,
    alignSelf: 'center',
    backgroundColor: colors.paleLilacTwo,
    flex: 1,
  },
  addPaymentText: {
    fontSize: 18,
    textAlign: 'center',
    color: colors.black,
    ...text.buttonblack,
  },
  addPaymentButton: {
    borderRadius: 10,
    paddingHorizontal: 50,
    paddingVertical: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  paymentSystemLogo: {
    width: 64,
    height: 32,
    marginRight: 12,
  },
  cardInfoContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: colors.black,
  },
  cardholderName: {
    marginBottom: 4,
    ...font.primary.bold,
  },
  expirationDateContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});
