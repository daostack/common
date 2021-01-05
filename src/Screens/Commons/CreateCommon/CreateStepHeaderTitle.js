import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {colors, font, sizeLineHeight, sizeM, sizeL, sizeS} from '~/Theme';
import {string} from 'prop-types';

const CreateStepHeaderTitle = ({title, subtitle}) => (
  <>
    <Text style={styles.generalInfoTitle}>{title}</Text>
    <Text style={styles.generalInfoSubtitle}>{subtitle}</Text>
  </>
);

CreateStepHeaderTitle.propTypes = {
  title: string.isRequired,
  subtitle: string,
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

export default CreateStepHeaderTitle;
