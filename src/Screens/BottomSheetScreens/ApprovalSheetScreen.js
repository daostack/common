import {Text, StyleSheet, SafeAreaView} from 'react-native';

import React from 'react';
import {text, layout, colors, font} from '../../Theme';
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

      <Text style={styles.voteDescription}>Are you sure? You will not be able to change your vote after you confirm it.</Text>

      <ButtonSwiper
        title="Swipe to confirm your vote"
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
  voteDescription: {
    ...text.blackText,
    ...font.fontSize(0),
    textAlign: 'center',
  },
  body: {
    height: 250,
    ...layout.content,
  },
});

export default ApprovalSheetScreen;
