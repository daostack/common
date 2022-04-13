import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {colors, text} from '~/Theme';
import {baseMargin} from '~/Theme/layout';

interface Props {
  replacePaymentMethod: () => void;
}

export const AddPaymentMethod = ({replacePaymentMethod}: Props) => (
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
      onPress={() => replacePaymentMethod()}
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

const styles = StyleSheet.create({
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
});
