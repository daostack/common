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
import {ErrorExpand} from '~/Components';
import {uiStorePropTypes} from '~/Types/propTypes';

const propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  buttonText: PropTypes.string,

  titleRed: PropTypes.bool,
  uiStore: uiStorePropTypes.isRequired,
  error: PropTypes.instanceOf(Error),

  onClose: PropTypes.func,
};

const BackendErrorSheetScreen: React.FC<
  PropTypes.InferProps<typeof propTypes>
> = ({uiStore, ...props}) => {
  console.log('------------error', props);
  const onClose = (): void => {
    uiStore.bottomSheetStore.hideBottomSheet();

    typeof props.onClose === 'function' && onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.lever} />

      <View style={styles.imageContainer}>
        <Image source={require('~/Assets/alert.png')} style={styles.image} />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.title, props.titleRed && styles.titleRed]}>
          {props.title || 'Something went wrong'}
        </Text>

        {props.subTitle && (
          <Text style={styles.subtitle}>{props.subTitle}</Text>
        )}
      </View>

      <TouchableOpacity onPress={onClose} style={styles.button}>
        <Text>{props.buttonText || 'OK'}</Text>
      </TouchableOpacity>

      <ErrorExpand
        error={props.error}
        bottomSheetStore={uiStore.bottomSheetStore}
      />
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
    height: '100%',
    width: '100%',

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
    width: Dimensions.get('window').width * 0.45,
    maxHeight: 220,
    aspectRatio: 1,
  },

  textContainer: {
    marginTop: 30,
    width: Dimensions.get('window').width * 0.6,
  },

  button: {
    width: Dimensions.get('window').width * 0.9,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 25,
    borderColor: colors.grey4,
    marginVertical: 30,
  },

  title: {
    ...font.primary.bold,
    ...font.fontSize(3),
    textAlign: 'center',
  },

  titleRed: {
    color: colors.error,
  },

  subtitle: {
    ...font.primary.regular,
    ...font.fontSize(2),
    textAlign: 'center',
  },
});

BackendErrorSheetScreen.propTypes = propTypes;
BackendErrorSheetScreen.defaultProps = {
  title: 'Something went wrong',
  buttonText: 'OK',
};

export default inject('uiStore')(observer(BackendErrorSheetScreen));
