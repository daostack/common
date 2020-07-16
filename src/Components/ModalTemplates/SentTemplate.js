import React from 'react';
import {Image, StyleSheet, Text, SafeAreaView} from 'react-native';
import LayoutHeader from './LayoutHeader';

import {font, sizeM} from '../../Theme';
import {func, string, bool} from 'prop-types';

const SentTemplate = ({
  children,
  title,
  description,
  onClose,
  isCommonCreation,
}) => {
  return (
    <SafeAreaView style={styles.areaView}>
      <LayoutHeader onClose={onClose} />
      <Image
        style={styles.image}
        source={
          isCommonCreation
            ? require('../../Assets/launch.png')
            : require('../../Assets/sent_igraphic.png')
        }
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {children}
    </SafeAreaView>
  );
};
SentTemplate.propTypes = {
  title: string.isRequired,
  description: string.isRequired,
  onClose: func.isRequired,
  isCommonCreation: bool,
};
const styles = StyleSheet.create({
  image: {
    top: 0,
    height: '50%',
    alignSelf: 'center',
    aspectRatio: 1,
  },
  title: {
    ...font.fontSize(6),
    textAlign: 'center',
    ...font.heading.bold,
  },
  areaView: {
    justifyContent: 'space-between',
    flex: 1,
    marginVertical: sizeM,
  },
  description: {
    ...font.fontSize(2),
    ...font.primary.regular,
    textAlign: 'center',
  },
  text: {},
});

export default SentTemplate;
