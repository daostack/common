import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {layout, text} from '~/Theme';
import {string, number, InferProps} from 'prop-types';

const props = {
  index: number.isRequired,
  title: string.isRequired,
  description: string,
  url: string,
};
const RequestToJoinRule: React.FC<InferProps<typeof props>> = ({
  index,
  title,
  description,
  url,
}) => (
  <View style={styles.container}>
    <View style={{width: '100%'}}>
      <Text style={{...styles.ruleTitle, ...text.textAlign(title)}}>
        {index}. {title}
      </Text>
      <Text style={{...styles.ruleDescription, ...text.textAlign(description)}}>
        {description}
      </Text>
      <Text style={{...styles.ruleDescription, ...text.textAlign(url)}}>
        {url}
      </Text>
    </View>
  </View>
);

RequestToJoinRule.propTypes = props;

const styles = StyleSheet.create({
  container: {
    ...layout.content,
    ...layout.flexStart,
    flexDirection: 'row',
    padding: 0,
    paddingBottom: 40,
  },
  sideContainer: {
    ...layout.marginRightXS,
    backgroundColor: 'pink',
  },
  ruleTitle: {
    ...text.h4Black,
  },
  ruleDescription: {
    ...text.blackText,
    fontWeight: '500',
  },
});

export default RequestToJoinRule;
