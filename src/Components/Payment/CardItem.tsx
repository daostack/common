import {observer} from 'mobx-react-lite';
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Card} from '~/Stores/Models/Card';
import {colors, font, text} from '~/Theme';
import {baseMargin} from '~/Theme/layout';
import {Divider} from '~/Components/Divider';
import {AddPaymentMethod} from './AddPaymentMethod';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';
import {useNavigation} from '@react-navigation/native';
import {getCardNetwork} from './helper';
import {formatExpirationDate} from '~/Util/FormatUtil';

interface Props {
  card?: Card;
}

export const CardItem = observer(({card}: Props) => {
  const navigation = useNavigation();

  const replacePaymentMethod = () => {
    navigation.navigate(NAVIGATION_SCREENS.CHOOSE_PAYMENT_METHOD_STEP);
  };

  const network = getCardNetwork(card?.metadata?.network);

  return card ? (
    <View style={styles.container}>
      <>
        <FastImage
          style={styles.paymentSystemLogo}
          source={network}
          resizeMode="cover"
        />
        <View style={styles.cardInfoContainer}>
          <Text style={styles.ccdetails}>{card?.fullName}</Text>
          <Text style={text.buttonblack}>
            {formatExpirationDate(card?.metadata?.expiration)}
          </Text>
        </View>
        <Text style={{...text.buttonblack, textAlign: 'left'}}>
          ********{card?.metadata?.digits}
        </Text>
        <Divider mt={baseMargin * 3} mb={baseMargin * 2} />
        <Pressable
          onPress={replacePaymentMethod}
          style={({pressed}) => [
            {
              opacity: pressed ? 0.5 : 1.0,
            },
            styles.replacePaymentButton,
          ]}>
          <Text style={styles.addPaymentText}>Replace payment method</Text>
        </Pressable>
      </>
    </View>
  ) : (
    <AddPaymentMethod replacePaymentMethod={replacePaymentMethod} />
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
    alignSelf: 'center',
    shadowColor: 'rgba(10, 10, 10, 0.2)',
    shadowOffset: {width: 1, height: 13},
    shadowOpacity: 1,
    shadowRadius: 15,
    padding: 20,
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
  replacePaymentButton: {
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignContent: 'center',
  },
  paymentSystemLogo: {
    width: 70,
    height: 40,
  },
  cardInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: baseMargin * 1.5,
    marginBottom: baseMargin,
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
  ccdetails: {
    ...text.buttonblack,
    fontWeight: 'bold',
  },
});
