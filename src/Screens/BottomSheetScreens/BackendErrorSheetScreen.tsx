import React from 'react';
import PropTypes from 'prop-types';
import {Dimensions, Image, LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';

import {colors, font} from '~/Theme';
import {inject, observer} from 'mobx-react';
import {AxiosError} from 'axios';

const propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  buttonText: PropTypes.string,

  error: PropTypes.instanceOf(Error),

  bottomSheetStore: PropTypes.any.isRequired,

  onClose: PropTypes.func,
};

interface IFormattedError {
  errorId: string,
  errorName: string,
  errorStatus: string
}

const BackendErrorSheetScreen: React.FC<PropTypes.InferProps<typeof propTypes>> = ({bottomSheetStore, ...props}) => {
  const [showDetails, setShowDetails] = React.useState<boolean>(false);
  const [formattedError, setFormattedError] = React.useState<IFormattedError | null>(null);
  const [containerHeight, setContainerHeight] = React.useState<number>(0);

  React.useEffect(() => {
    if (props.error) {
      if ((props.error as any).isAxiosError) {
        const errorData = (props.error as AxiosError).response?.data;

        setFormattedError({
          errorId: errorData?.errorId,
          errorName: errorData?.errorMessage,
          errorStatus: errorData?.errorStatus,
        });
      }
    }
  }, []);

  const toggleShowDetails = (): void => {
    setShowDetails(!showDetails);
  };

  const onErrorContainerLayout = (e: LayoutChangeEvent): void => {
    const layout = e.nativeEvent.layout;

    showDetails
      ? bottomSheetStore.increseTopSnap(layout.height - containerHeight)
      : bottomSheetStore.decreseTopSnap(containerHeight - layout.height);

    setContainerHeight(layout.height);
  };

  const onClose = (): void => {
    bottomSheetStore.hideBottomSheet();

    typeof props.onClose === 'function' && onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.lever}/>

      <View style={styles.imageContainer}>
        <Image
          source={require('~/Assets/alert.png')}
          style={styles.image}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{props.title || 'Something went wrong'}</Text>


        {props.subTitle && (
          <Text style={styles.subtitle}>{props.subTitle}</Text>
        )}
      </View>

      <TouchableOpacity onPress={onClose} style={styles.button}>
        <Text>{props.buttonText || 'OK'}</Text>
      </TouchableOpacity>

      {formattedError && (
        <View style={styles.errorDetailsContainer} onLayout={onErrorContainerLayout}>

          <TouchableWithoutFeedback onPress={toggleShowDetails}>
            <Text style={styles.errorDetailsToggle}>
              {showDetails ? 'Close error details' : 'Show error details'}
            </Text>
          </TouchableWithoutFeedback>

          {showDetails && (
            <View>
              <Text>Error ID: {formattedError.errorId}</Text>
              <Text>Error Name: {formattedError.errorName}</Text>
              <Text>Error Status: {formattedError.errorStatus}</Text>
            </View>
          )}
        </View>
      )}
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
    shadowRadius: 16.00,
    elevation: 24,

    alignItems: 'center',
  },

  containerExpanded: {},

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

  subtitle: {
    ...font.primary.regular,
    ...font.fontSize(2),
    textAlign: 'center',
  },

  errorDetailsContainer: {
    width: Dimensions.get('window').width * 0.9,
  },

  errorDetailsToggle: {
    color: colors.grey6,
    textAlign: 'center',
    marginBottom: 10,
  },
});

BackendErrorSheetScreen.propTypes = propTypes;
BackendErrorSheetScreen.defaultProps = {
  title: 'Something went wrong',
  buttonText: 'OK',
};

export default inject('bottomSheetStore')(observer(BackendErrorSheetScreen));

