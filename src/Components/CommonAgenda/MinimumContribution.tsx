import React, {FC} from 'react';
import {string, number} from 'prop-types';
import {StyleSheet, View, Text} from 'react-native';
import {colors, font, layout} from '~/Theme';

type Props = {
  minFeeToJoin: number;
  contributionType: string;
};

const MinimumContribution: FC<Props> = ({minFeeToJoin, contributionType}) => (
  <View>
    <Text style={styles.text}>
      {minFeeToJoin / 100}
      {'$ '}
      <Text style={[styles.text, styles.bold]}>{contributionType}</Text>{' '}
      contribution
    </Text>
  </View>
);

MinimumContribution.propTypes = {
  minFeeToJoin: number.isRequired,
  contributionType: string.isRequired,
};

const styles = StyleSheet.create({
  text: {
    ...font.primary.regular,
    ...font.fontSize(2),
    ...layout.marginBottomL,
    color: colors.black,
  },
  bold: {
    ...font.primary.bold,
  },
});

export default MinimumContribution;
