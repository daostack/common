import {Text, StyleSheet, SafeAreaView} from 'react-native';

import React from 'react';
import {text, layout, colors} from '../../Theme';
import Loader from '../../Components/Loader';

const ApprovalProgressSheetScreen = ({ voteType }) => {
  const voteColor = voteType ? colors.lightishGreen : colors.error;

  return (
    <SafeAreaView style={styles.body}>
      <Text
        style={{
          ...styles.title,
          ...{ color: voteColor},
        }}>
        {voteType ? 'Approve' : 'Reject'}
      </Text>

      <Loader color={voteColor}/>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    ...text.h1Black,
    ...layout.paddingBottomS,
  },

  body: {
    height: 250,
    ...layout.content,
  },
});

export default ApprovalProgressSheetScreen;
