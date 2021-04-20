import React, {FC} from 'react';
import {string} from 'prop-types';
import {StyleSheet, View, Text} from 'react-native';
import {colors, font, layout} from '~/Theme';

type Props = {
  minFeeToJoin: string;
  contributionType: string;
};

const MinimumContribution: FC<Props> = ({minFeeToJoin, contributionType}) => (
  <View>
    <Text style={styles.text}>
      {`${minFeeToJoin}$ `}
      <Text style={[styles.text, styles.bold]}>{contributionType}</Text>{' '}
      contribution
    </Text>
  </View>
);

MinimumContribution.propTypes = {
  minFeeToJoin: string.isRequired,
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
