import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {layout, text} from '~/Theme';
type RequestToJoinRuleProps = {
  index: any,
  title: any,
  description?: any,
  url?: any
};
const RequestToJoinRule: React.FC<RequestToJoinRuleProps> = ({
  index,
  title,
  description,
  url,
}: RequestToJoinRuleProps) => (
  <View style={styles.container}>
    <View style ={{width: '100%'}} >
      <Text style={{...styles.ruleTitle, ...text.textAlign(title)}}>{index}. {title}</Text>
      <Text style={{...styles.ruleDescription, ...text.textAlign(description)}}>{description}</Text>
      <Text style={{...styles.ruleDescription, ...text.textAlign(url)}}>{url}</Text>
    </View>
  </View>
);
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
