import React from 'react';
import {Image, View, StyleSheet, Text, SafeAreaView} from 'react-native';
import LayoutHeader from './LayoutHeader';
import {font, sizeM, sizeLineHeight} from '~/Theme';
import {func, string, bool, object} from 'prop-types';

const SentTemplate = ({
  children,
  title,
  description,
  onClose,
  isCommonCreation,
}) => (
  <SafeAreaView style={styles.areaView}>
    <LayoutHeader onClose={onClose} />
    <Image
      style={styles.image}
      source={
        isCommonCreation
          ? require('~/Assets/launch.png')
          : require('~/Assets/send.png')
      }
    />
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {children}
    </View>
  </SafeAreaView>
);
SentTemplate.propTypes = {
  title: string.isRequired,
  description: string.isRequired,
  onClose: func.isRequired,
  isCommonCreation: bool,
  children: object,
};
const styles = StyleSheet.create({
  image: {
    top: 0,
    height: '50%',
    alignSelf: 'center',
    aspectRatio: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  title: {
    ...font.fontSize(6),
    textAlign: 'center',
    ...font.heading.bold,
    marginBottom: sizeM,
  },
  areaView: {
    justifyContent: 'space-between',
    flex: 1,
    marginVertical: sizeM,
  },
  description: {
    lineHeight: sizeLineHeight,
    ...font.fontSize(2),
    ...font.primary.regular,
    textAlign: 'center',
    marginBottom: sizeM,
  },
  text: {},
});

export default SentTemplate;
