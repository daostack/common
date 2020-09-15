import {Text, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import React from 'react';
import {text, layout, colors, font, sizeL} from '~/Theme';
import ButtonSwiper from '~/Components/ButtonSwiper';
import Loader from '~/Components/Loader';
import {func, bool, shape} from 'prop-types';

const ApprovalSheetScreen = ({onApprove, onClose, voteType,
  votingProcessState: {inProgress, error}}) => {
  const title = voteType ? 'Approve' : 'Reject';
  const voteColor =
    error || !voteType ? colors.against : colors.lightishGreen;

  return (
    <SafeAreaView style={styles.body}>
      <Text
        style={{
          ...styles.title,
          color: voteColor,
        }}>
        {error ? 'Something went wrong' : title}
      </Text>

      {error ? (
        <>
          <Text style={{...styles.voteDescription, ...{...font.fontSize(2)}}}>
            Please try again later
          </Text>

            <TouchableOpacity
              style={styles.okButton}
              onPress={onClose}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
        </>
      ) : inProgress ? (
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

ApprovalSheetScreen.propTypes = {
  onApprove: func,
  onClose: func,
  voteType: bool,
  votingProcessState: shape({
    inProgress: bool,
    error: bool,
  }),
};

const styles = StyleSheet.create({
  title: {
    ...text.h1Black,
    ...layout.paddingBottomS,
    width: '100%',
    ...font.fontSize(4),
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
    width: '100%',
  },
  okButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    ...layout.btnOutline,
    ...layout.marginTopXXL,
    height: 52,
  },
  buttonText:
  {
    color: colors.black,
    alignSelf: 'center',
    fontSize: 16,
  },
});

export default ApprovalSheetScreen;
