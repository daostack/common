import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {text, layout, colors, font} from '~/Theme/index';
import PropTypes from 'prop-types';
import Icon from '../../Assets/iconfont/Icon';

const TransactionError = ({bottomSheetStore, errorMessage, errorObj}) => {
  const [showMore, setShowMore] = React.useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <View style={styles.scrollView}>
      <View style={styles.body}>
        {(errorObj && typeof errorObj === 'object') && (
          <TouchableOpacity
            style={styles.icon}
            onPress={toggleShowMore}
          >
            <Icon name="explanation1" />
          </TouchableOpacity>
        )}

        <View style={styles.spacer}/>

        <Image
          source={require('~/Assets/alert.png')}
          style={styles.imgAlert}
        />

        <Text style={styles.title}>
          Something went wrong
        </Text>

        {(typeof errorObj === 'string') && (
          <Text style={styles.blackTextWithImage}>
            {errorObj}
          </Text>
        )}


        {typeof errorObj === 'object' && ((showMore) ? (
          <View>
            <Text>Error ID: {errorObj.errorId}</Text>
            <Text>Error Status: {errorObj.errorCode}</Text>
            <Text>Error Name: {errorObj.errorName}</Text>
            <Text>Full error text: {errorObj.error}</Text>
          </View>
        ) : (
          <View style={styles.textWithIconContainer}>
            <Text style={styles.blackTextWithImage}>{errorMessage}</Text>
          </View>
        ))}

        <View style={styles.spacer}/>

        <TouchableOpacity
          style={styles.dismissButton}
          onPress={bottomSheetStore.hideBottomSheet}
        >
          <Text style={text.buttonblue}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

TransactionError.propTypes = {
  bottomSheetStore: PropTypes.shape({
    hideBottomSheet: PropTypes.func,
  }),
  errorMessage: PropTypes.string,
  errorObj: PropTypes.oneOfType([
    PropTypes.shape({
      errorId: PropTypes.string,
      name: PropTypes.string,
      statusCode: PropTypes.number,
    }),
    PropTypes.any,
  ]),
};

const styles = StyleSheet.create({
  title: {
    ...text.h1Black,
    textAlign: 'left',
  },

  spacer: {
    flex: 1,
  },

  dismissButton: {
    ...layout.btnOutline,
    flexGrow: 0,
    width: '100%',
    alignSelf: 'stretch',
  },

  imgAlert: {
    height: '50%',
    aspectRatio: 1,
  },
  title2: {
    ...layout.marginTopL,
    ...text.regularText,
    textAlign: 'left',
  },
  textWithIconContainer: {
    ...layout.content,
    ...layout.flexRow,
    paddingHorizontal: 0,
    paddingVertical: 7,
  },
  blackTextWithImage: {
    ...text.regularText,
    ...layout.marginLeftM,
    ...font.fontSize(3),
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  sheetTextStyle: {
    ...text.greyText,
    ...text.centered,
  },
  body: {
    ...layout.content,
    ...layout.flexStart,
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },

  icon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});

export default inject('bottomSheetStore')(observer(TransactionError));
