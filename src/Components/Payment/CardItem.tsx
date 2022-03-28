import {observer} from 'mobx-react-lite';
import React, {useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Card} from '~/Stores/Models/Card';
import {colors, font} from '~/Theme';
import {baseMargin} from '~/Theme/layout';

interface Props {
  handleSelectCard: (card: Card) => void;
  card: Card;
}

// TODO: This component will be implemented in the future, as the API does not currently allow you to select a card

export const CardItem = observer(({card, handleSelectCard}: Props) => {
  const handlePress = useCallback(() => {
    handleSelectCard(card);
  }, []);

  return (
    <Pressable
      onPress={handlePress}
      style={({pressed}) => [
        {
          opacity: pressed ? 0.5 : 1.0,
        },
        styles.container,
      ]}>
      <FastImage
        style={styles.paymentSystemLogo}
        source={require('~/Assets/mastercard.png')}
        resizeMode="cover"
      />
      <View style={styles.cardInfoContainer}>
        <View />
        {/* <Text style={[styles.text, styles.cardholderName]}>{card.metadata?.owner}</Text> */}
        <Text style={styles.text}>********{card.metadata?.digits}</Text>
      </View>
      {/* <View style={styles.expirationDateContainer}>
        <Text style={styles.text}>{card.metadata?.expirationDate}</Text>
      </View> */}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: baseMargin * 1.5,
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
