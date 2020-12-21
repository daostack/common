import React from 'react';
import {Text, View, ScrollView, Pressable} from 'react-native';
import {func, InferProps} from 'prop-types';
import styles from './styles';
import data from './data';
import {CheckMark, PiggyBank} from '~/Assets';

const props = {
  onPressAgree: func,
};
const UseOfFunds: React.FC<InferProps<typeof props>> = ({onPressAgree}) => (
  <View style={styles.root}>
    <View style={styles.view}>
      <View style={styles.plug} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.piggyBank}><PiggyBank /></View>
        <Text style={styles.title}>{data.useOfFundsTitle}</Text>
        <Text style={[styles.text, styles.centerText]}>{data.useOfFundsText}</Text>
        <View style={styles.line} />
        <Text style={styles.subtitle}>{data.onlyUseFundsTo}</Text>
        {[data.payProperyBusinesses, data.contributeToNonProfits].map((text, index) =>
          <View key={index} style={styles.item}>
            <View style={styles.checkMark}><CheckMark /></View>
            <Text style={[styles.text, styles.flex]}>{text}</Text>
          </View>
        )}
        <Text style={[styles.text, styles.centerText, styles.highlighted]}>{data.invoicesRequirment}</Text>
        <Pressable onPress={onPressAgree}>
          <Text style={styles.button}>{data.iAgreeWithAbove}</Text>
        </Pressable>
      </ScrollView>
    </View>
  </View>
);
UseOfFunds.propTypes = props;

export default UseOfFunds;
