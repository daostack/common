import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {text, layout, colors, font} from '~/Theme';

interface Props {
  proceed: () => void;
  message: string;
}

const PaymentMethodUpdateStatus = ({
  proceed,
  message = 'Payment method updated',
}: Props) => (
  <View style={styles.scrollView}>
    <View style={styles.lever} />
    <View style={styles.body}>
      <Image
        style={styles.image}
        source={require('../../../src/Assets/paymentMethod.png')}
      />

      <Text style={styles.title}>{message}</Text>
      <TouchableOpacity style={styles.continue} onPress={proceed}>
        <Text style={text.buttonblack}>Ok</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },
  image: {
    height: 116,
    resizeMode: 'contain',
  },
  continue: {
    ...layout.btnOutline,
    flexGrow: 0,
  },
  title: {
    ...text.h1Black,
  },
  message: {
    ...font.primary.regular,
    ...font.fontSize(3),
    ...text.centered,
  },
  body: {
    ...layout.content,
    height: '70%',
    justifyContent: 'space-around',
  },
  lever: {
    height: 5,
    width: 100,
    borderRadius: 10,
    backgroundColor: colors.grey2,
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default PaymentMethodUpdateStatus;
