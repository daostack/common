import React from 'react';
import {
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {colors, font, layout} from '~/Theme';
import {bool, func, number, object} from 'prop-types';
import {CurrencySymbols} from '~/Util/locale';

const ModalConversion = ({onPressClose, showAmount, amount, funds}) => (
  <Pressable onPress={() => onPressClose()} style={styles.background}>
    <View style={styles.root}>
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.view}>
          <View style={styles.plug} />
          <ScrollView contentContainerStyle={styles.content}>
            <Image
              style={styles.piggyBank}
              source={require('~/Assets/transparent.png')}
              width={116}
              height={116}
            />
            <Text style={styles.title}>Local Currency</Text>
            {showAmount && (
              <View style={{marginBottom: 20}}>
                <Text style={[styles.text, styles.centerText]}>
                  <Text>Requested amount:</Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                    }}>{` ~${CurrencySymbols.SHEKEL}${amount}`}</Text>
                </Text>
                <Text style={[styles.text, styles.centerText]}>
                  {`Available funds: ~${CurrencySymbols.SHEKEL}${funds}`}
                </Text>
              </View>
            )}
            <Text style={[styles.text, styles.centerText]}>
              All funds are received in U.S. dollars. The actual balance in ILS
              may be different than the amount estimated above.
            </Text>
            <TouchableOpacity
              style={{
                ...styles.btns,
                ...layout.btnOutline,
                ...layout.marginRightS,
              }}
              onPress={onPressClose}>
              <Text>OK</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </Pressable>
);

ModalConversion.propTypes = {
  onPressClose: func,
  children: object,
  showAmount: bool,
  amount: number,
  funds: number,
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
    backgroundColor: colors.blackOpacity,
  },
  root: {
    paddingTop: 100,
    height: '100%',
    justifyContent: 'flex-end',
  },
  view: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,
  },
  plug: {
    backgroundColor: colors.paleblue,
    width: 72,
    height: 6,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 16,
  },
  content: {
    marginHorizontal: 24,
  },
  piggyBank: {
    height: 116,
    width: 116,
    alignSelf: 'center',
    marginBottom: 16,
  },
  btns: {
    marginVertical: 40,
  },
  title: {
    color: colors.black,
    ...font.primary.bold,
    fontSize: 20,
    marginHorizontal: 56,
    lineHeight: 28,
    textAlign: 'center',
    paddingBottom: 8,
  },
  subtitle: {
    color: colors.black,
    ...font.primary.bold,
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 16,
  },
  text: {
    color: colors.black,
    ...font.primary.regular,
    fontSize: 16,
    marginHorizontal: 30,
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default ModalConversion;
