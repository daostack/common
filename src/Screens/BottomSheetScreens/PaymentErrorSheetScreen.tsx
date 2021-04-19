import React from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {colors, font} from '~/Theme';
import {inject, observer} from 'mobx-react';
import {uiStorePropTypes} from '~/Types/propTypes';

const propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  buttonText: PropTypes.string,

  titleRed: PropTypes.bool,
  uiStore: uiStorePropTypes.isRequired,
  error: PropTypes.string,

  onClose: PropTypes.func,
  navigation: PropTypes.any,
  shouldGoBack: PropTypes.bool,
};

const BackendErrorSheetScreen: React.FC<
  PropTypes.InferProps<typeof propTypes>
> = ({uiStore, shouldGoBack, ...props}) => {
  const onClose = (): void => {
    uiStore.bottomSheetStore.hideBottomSheet();
    if (shouldGoBack && props.navigation?.current) {
      props.navigation?.current?.goBack();
    }
    typeof props.onClose === 'function' && onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.lever} />
      <View style={styles.imageContainer}>
        <Image
          source={require('~/Assets/cardDeclined.png')}
          style={styles.image}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, props.titleRed && styles.titleRed]}>
          {props.title}
        </Text>

        {props.subTitle && (
          <Text style={styles.subtitle}>{props.subTitle}</Text>
        )}
      </View>
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText]}>{props.error}</Text>
      </View>
      <Text style={{...styles.subtitle, ...font.primary.bold}}>
        To join the Common, please update your payment details within 14 days.
      </Text>
      <TouchableOpacity onPress={onClose} style={styles.button}>
        <Text style={styles.buttonText}>{props.buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'white',
    marginTop: -60,
    paddingTop: 60,
    flex: 1,
    height: '100%',

    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 16.0,
    elevation: 24,

    alignItems: 'center',
  },

  lever: {
    height: 5,
    width: 100,
    borderRadius: 10,
    backgroundColor: colors.grey2,
    alignSelf: 'center',
    marginTop: -40,
    marginBottom: 30,
  },

  imageContainer: {
    width: Dimensions.get('window').width,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  image: {
    width: Dimensions.get('window').width * 0.4,
    maxHeight: 220,
    aspectRatio: 1,
  },

  errorContainer: {
    width: Dimensions.get('window').width - 24 * 2,
    backgroundColor: colors.blueGray2,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginVertical: 8,
    borderRadius: 14,
  },

  errorText: {
    ...font.fontSize(2),
    ...font.primary.regular,
    color: colors.blueGrayText,
    textAlign: 'center',
  },

  textContainer: {
    marginTop: 30,
    width: Dimensions.get('window').width,
    paddingHorizontal: 24,
  },

  button: {
    width: Dimensions.get('window').width * 0.9,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: colors.mainBlue,
    marginVertical: 30,
  },

  buttonText: {
    ...font.fontSize(2),
    ...font.primary.regular,
    fontSize: 16,
    color: colors.white,
  },

  title: {
    ...font.primary.bold,
    fontSize: 20,
    textAlign: 'center',
  },

  titleRed: {
    color: colors.error,
  },

  subtitle: {
    ...font.primary.regular,
    ...font.fontSize(2),
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
});

BackendErrorSheetScreen.propTypes = propTypes;
BackendErrorSheetScreen.defaultProps = {
  title: 'Payment Failed',
  buttonText: 'Update Details',
  error:
    'Payment denied by Circle Risk Service or card processor risk controls',
  shouldGoBack: false,
};

export default inject('uiStore')(observer(BackendErrorSheetScreen));
