import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {
  colors,
  font,
  sizeLineHeight,
  sizeM,
  sizeL,
  sizeS,
} from '~/Theme';
import {string, oneOfType, func} from 'prop-types';

const RequestStepHeaderTitle = ({title, subtitle}) => (
  <>
    <Text style={styles.generalInfoTitle}>{title}</Text>

    {typeof subtitle === 'function' ? subtitle(styles.generalInfoSubtitle) : (
      <Text style={styles.generalInfoSubtitle}>{subtitle}</Text>
    )}
  </>
);

RequestStepHeaderTitle.propTypes = {
  title: string.isRequired,
  subtitle: oneOfType([
    string,
    func,
  ]),
};

const styles = StyleSheet.create({
  generalInfoTitle: {
    marginTop: sizeM,
    ...font.primary.bold,
    ...font.fontSize(4),
    textAlign: 'center',
  },
  generalInfoSubtitle: {
    marginTop: sizeS,
    color: colors.slate,
    marginBottom: sizeL,
    textAlign: 'center',
    lineHeight: sizeLineHeight,
    ...font.primary.regular,
    ...font.fontSize(2),
  },
});

export default RequestStepHeaderTitle;
