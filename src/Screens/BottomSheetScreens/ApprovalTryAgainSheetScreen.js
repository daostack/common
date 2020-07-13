import {Text, StyleSheet, SafeAreaView, View, TouchableOpacity} from 'react-native';

import React from 'react';
import {text, layout, colors, font, sizeL} from '../../Theme';

const ApprovalTryAgainSheetScreen = ({onTryAgain, onClose, voteType}) => {
  return (
    <SafeAreaView style={styles.body}>
      <Text
        style={{
          ...styles.title,
          ...{color: colors.error},
        }}>
        {voteType ? 'Approve' : 'Reject'}
      </Text>

      <Text style={styles.voteDescription}>We couldn’t submit your vote to approve this proposal</Text>

      <View style={styles.containerRow}>
        <TouchableOpacity
          style={{...layout.btnOutline, ...layout.marginRightS}}
          onPress={onClose}>
          <Text style={text.buttonblue}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{...layout.btnPrimary, ...layout.marginLeftS}}
          onPress={onTryAgain}>
          <Text style={text.buttoncenterwhite}>Try again</Text>
        </TouchableOpacity>
      </View>
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
    ...font.fontSize(2),
    paddingHorizontal: sizeL,
    textAlign: 'center',
  },
  body: {
    height: 200,
    ...layout.content,
    ...layout.flexStart,
    alignItems: 'center',
  },
  containerRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    ...layout.marginTopL,
  },
});

export default ApprovalTryAgainSheetScreen;
