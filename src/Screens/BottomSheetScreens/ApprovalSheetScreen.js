import {Text, StyleSheet, SafeAreaView, TouchableOpacity, View, Dimensions} from 'react-native';
import React from 'react';
import {text, layout, colors, font, sizeL} from '~/Theme';
import ButtonSwiper from '~/Components/ButtonSwiper';
import {func, bool, shape} from 'prop-types';
import {useQuote} from '../../Util/hooks/useQuote';
import {Fade, Placeholder, PlaceholderLine} from 'rn-placeholder';

const ApprovalSheetScreen = ({
  onApprove,
  onClose,
  voteType,
  votingProcessState: {
    inProgress,
    error,
  },
}) => {
  const quote = useQuote();
  const title = voteType ? 'Approve' : 'Reject';
  const voteColor =
    error || !voteType ? colors.against : colors.lightishGreen;

  return (
    <SafeAreaView style={styles.body}>

      {inProgress && (
        <Placeholder Animation={Fade}>
          <PlaceholderLine
            width={Dimensions.get('window').width}
            height={9}
            color={'#6ee569'}
            style={{
              alignSelf: 'center',
              marginTop: -22,
            }} />
        </Placeholder>
      )}


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
          <Text style={styles.greyText}>This might take up to 2 minutes</Text>

          <View style={styles.quotesContainer}>
            <Text style={styles.quote}>{quote.quote}</Text>
            <Text style={styles.quoteAuthor}>{quote.author}</Text>
          </View>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Text style={styles.voteDescription}>
            Are you sure? You will not be able
            to change your vote after you confirm it.
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

  quotesContainer: {
    ...layout.marginTopL,
  },

  quote: {
    ...font.heading.bold,
    ...font.fontSize(3),
    color: colors.black,
    textAlign: 'center',
  },

  quoteAuthor: {
    ...font.primary.regular,
    ...font.fontSize(3),
    color: colors.greyText,
    textAlign: 'center',
  },

  greyText: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.greyText,
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
    paddingTop: 0,
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
