import {Text, StyleSheet, SafeAreaView} from 'react-native';

import React from 'react';
import {text, layout, colors} from '../../Theme';
import ButtonSwiper from '../../Components/ButtonSwiper';

const ApprovalSheetScreen = ({onApprove, voteType}) => {
  return (
    <SafeAreaView style={styles.body}>
      <Text
        style={{
          ...styles.title,
          ...{color: voteType ? colors.lightishGreen : colors.error},
        }}>
        {voteType ? 'Approve' : 'Reject'}
      </Text>

      <Text style={text.blackText}>This cannot be changed later</Text>

      <ButtonSwiper
        title="Swipe to vote"
        onSwipeSuccess={() => onApprove(voteType)}
      />
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

export default ApprovalSheetScreen;
