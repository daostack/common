import React, {FC} from 'react';
import {string} from 'prop-types';
import {StyleSheet, View, Text} from 'react-native';
import {colors, font, layout} from '~/Theme';

type Props = {
  fundingMinimumAmount: string;
  fundingType: string;
};

const MinimumContribution: FC<Props> = ({
  fundingMinimumAmount,
  fundingType,
}) => (
  <View>
    <Text style={styles.text}>
      {`$${fundingMinimumAmount} `}
      <Text style={[styles.text, styles.bold]}>{fundingType}</Text> contribution
    </Text>
  </View>
);

MinimumContribution.propTypes = {
  fundingMinimumAmount: string.isRequired,
  fundingType: string.isRequired,
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
