import {Text, StyleSheet, SafeAreaView} from 'react-native';

import React from 'react';
import {text, layout, colors, font, sizeL} from '../../Theme';
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
    paddingHorizontal: sizeL,
    textAlign: 'center',
  },
  body: {
    height: 200,
    ...layout.content,
    ...layout.flexStart,
    alignItems: 'center',
  },
});

export default ApprovalSheetScreen;
