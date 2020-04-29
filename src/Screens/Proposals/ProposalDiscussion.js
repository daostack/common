import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {text} from '../../Theme';

const ProposalDiscussion = ({}) => {
  return <Text style={styles.title}>Proposal Discussion</Text>;
};

const styles = StyleSheet.create({
  title: {
    ...text.h3Black,
  },
});

export default ProposalDiscussion;
