import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {string, number} from 'prop-types';
import {layout, text} from '~/Theme';

const RequestToJoinRule = ({index, title, description}) => (
  <View style={styles.container}>
    <Text style={styles.ruleTitle}>{`${index}     ${title}`}</Text>
    <Text style={styles.ruleDescription}>{description}</Text>
  </View>
);

RequestToJoinRule.propTypes = {
  index: number.isRquired,
  title: string.isRquired,
  description: string.isRquired,
};

const styles = StyleSheet.create({
  container: {
    ...layout.content,
    ...layout.flexStart,
    padding: 0,
    paddingBottom: 40,
  },
  ruleTitle: {
    ...text.h4Black,
    textAlign: 'left',
  },
  ruleDescription: {
    ...text.blackText,
    ...layout.marginTopM,
    marginLeft: 30,
  },
});

export default RequestToJoinRule;
