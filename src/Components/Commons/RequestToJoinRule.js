import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import React from 'react';

import Icon from '../../Assets/iconfont/Icon';
import {layout, colors, text} from '../../Theme';

const RequestToJoinRule = ({index, title, description}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.ruleTitle}>{`${index}     ${title}`}</Text>
      <Text style={styles.ruleDescription}>{description}</Text>
    </View>
  );
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
