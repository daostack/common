import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {string, number} from 'prop-types';
import {layout, text} from '~/Theme';

const RequestToJoinRule = ({index, title, description, url}) => (
  <View style={styles.container}>
    <View style={styles.sideContainer}>
      <Text style={styles.ruleTitle}>
        {index}.
      </Text>
    </View>

    <View>
      <Text style={styles.ruleTitle}>{title}</Text>
      <Text style={styles.ruleDescription}>{description}</Text>
      <Text style={styles.ruleDescription}>{url}</Text>
    </View>
  </View>
);

RequestToJoinRule.propTypes = {
  index: number.isRequired,
  title: string.isRequired,
  description: string,
  url: string,
};

const styles = StyleSheet.create({
  container: {
    ...layout.content,
    ...layout.flexStart,
    flexDirection: 'row',
    padding: 0,
    paddingBottom: 40,
  },
  sideContainer: {
    ...layout.marginRightXS
  },
  ruleTitle: {
    ...text.h4Black,
    textAlign: 'left',
  },
  ruleDescription: {
    ...text.blackText,
    fontWeight: '500',
  },
});

export default RequestToJoinRule;
