import {Text, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import React from 'react';
import {text, layout, colors, font, sizeL} from '~/Theme';
import ButtonSwiper from '~/Components/ButtonSwiper';
import Loader from '~/Components/Loader';
import {func, bool, shape} from 'prop-types';
import quotes from '../../Util/quotes.json';

const ApprovalSheetScreen = ({
  onApprove,
  onClose,
  voteType,
  votingProcessState: {
    inProgress,
    error,
  },
}) => {
  const title = voteType ? 'Approve' : 'Reject';
  const voteColor =
    error || !voteType ? colors.against : colors.lightishGreen;

  const [quote, setQuote] = React.useState(quotes[0]);

  React.useEffect(() => {
    setTimeout(() => {
      const index = quotes.findIndex((item) =>  JSON.stringify(item) === JSON.stringify(quote));

      setQuote(quotes[index === quotes.length - 1 ? 0 : index + 1]);
    }, 10000);
  }, [quote]);

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
        <React.Fragment>
          <Text style={{...styles.voteDescription, ...{...font.fontSize(2)}}}>
            Please try again later
          </Text>

          <TouchableOpacity
            style={styles.okButton}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </React.Fragment>
      ) : inProgress ? (
        <React.Fragment>
          <Text>This might take up to 2 minutes</Text>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Text style={styles.voteDescription}>
            Are you sure? You will not be able to change your vote after you
            confirm it. Duuh
          </Text>
          <ButtonSwiper
            title="Swipe to confirm your vote"
            onSwipeSuccess={() => onApprove(voteType)}
          />
        </React.Fragment>
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
