import {Text, StyleSheet, SafeAreaView, TouchableOpacity, View} from 'react-native';

import React from 'react';
import {text, layout, colors, font, sizeL} from '~/Theme';
import ButtonSwiper from '~/Components/ButtonSwiper';
import Loader from '~/Components/Loader';

const ApprovalSheetScreen = ({onApprove, onClose, voteType, votingProcessState}) => {
  const voteColor =
    votingProcessState.error || !voteType ? colors.error : colors.lightishGreen;

  return (
    <SafeAreaView style={styles.body}>
      <Text
        style={{
          ...styles.title,
          ...{color: voteColor},
        }}>
        {voteType ? 'Approve' : 'Reject'}
      </Text>

      {votingProcessState.error ? (
        <>
          <Text style={{...styles.voteDescription, ...{...font.fontSize(2)}}}>
            We couldn’t submit your vote to approve this proposal
          </Text>

          <View style={styles.containerRow}>
            <TouchableOpacity
              style={{...layout.btnOutline, ...layout.marginRightS}}
              onPress={onClose}>
              <Text style={text.buttonblue}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{...layout.btnPrimary, ...layout.marginLeftS}}
              onPress={() => onApprove(voteType)}>
              <Text style={text.buttoncenterwhite}>Try again</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : votingProcessState.inProgress ? (
        <Loader color={voteColor} isBigger={true} />
      ) : (
        <>
          <Text style={styles.voteDescription}>
            Are you sure? You will not be able to change your vote after you
            confirm it.
          </Text>
          <ButtonSwiper
            title="Swipe to confirm your vote"
            onSwipeSuccess={() => onApprove(voteType)}
          />
        </>
      )}
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
  containerRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    ...layout.marginTopL,
  },
});

export default ApprovalSheetScreen;
