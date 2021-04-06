import {
  Dimensions,
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import {colors} from '~/Theme';
import {AxiosError} from 'axios';
import PropTypes from 'prop-types';


interface IFormattedError {
  errorId: string;
  errorName: string;
  errorCode: string;
  errorMessage: string;
}

const propTypes = {
  error: PropTypes.instanceOf(Error),
  bottomSheetStore: PropTypes.any,
  onLayout: PropTypes.func,
};

interface IPropOverrides {
  onLayout?: (layout: LayoutRectangle, change: number) => void
}

export const ErrorExpand: React.FC<PropTypes.InferProps<typeof propTypes> & IPropOverrides> = ({bottomSheetStore, ...props}) => {
  const [formattedError, setFormattedError] = React.useState<IFormattedError | null>(null);
  const [containerHeight, setContainerHeight] = React.useState<number>(0);
  const [showDetails, setShowDetails] = React.useState<boolean>(false);


  const toggleShowDetails = (): void => {
    setShowDetails(!showDetails);
  };

  const onErrorContainerLayout = (e: LayoutChangeEvent): void => {
    const layout = e.nativeEvent.layout;

    if (typeof bottomSheetStore === 'object') {
      showDetails
        ? bottomSheetStore.increaseTopSnap(layout.height - containerHeight)
        : bottomSheetStore.decreaseTopSnap(containerHeight - layout.height);
    }

    if (typeof props.onLayout === 'function') {
      showDetails
        ? props.onLayout(layout, layout.height - containerHeight)
        : props.onLayout(layout, (containerHeight - layout.height) * -1);
    }


    setContainerHeight(layout.height);
  };


  React.useEffect(() => {
    if (props.error) {
      if ((props.error as any).isAxiosError) {
        const errorData = (props.error as AxiosError).response?.data;

        console.log(errorData);

        setFormattedError({
          errorId: errorData?.errorId,
          errorName: errorData?.errorName,
          errorCode: errorData?.errorCode,
          errorMessage: errorData?.error,
        });
      }
    }
  }, []);

  return (
    <React.Fragment>
      {formattedError && (
        <View style={styles.errorDetailsContainer} onLayout={onErrorContainerLayout}>

          <TouchableWithoutFeedback onPress={toggleShowDetails}>
            <Text style={styles.errorDetailsToggle}>
              {showDetails ? 'Close error details' : 'Show error details'}
            </Text>
          </TouchableWithoutFeedback>

          {showDetails && (
            <View>
              {formattedError.errorId && (
                <Text style={styles.errorInfoText}>Error ID: {formattedError.errorId}</Text>
              )}

              {formattedError.errorName && (
                <Text style={styles.errorInfoText}>Error Name: {formattedError.errorName}</Text>
              )}

              {formattedError.errorCode && (
                <Text style={styles.errorInfoText}>Error Code: {formattedError.errorCode}</Text>
              )}

              {formattedError.errorMessage && (
                <Text style={styles.errorInfoText}>Error Message: {formattedError.errorMessage}</Text>
              )}
            </View>
          )}
        </View>
      )}
    </React.Fragment>
  );
};

ErrorExpand.propTypes = propTypes;

const styles = StyleSheet.create({
  errorDetailsContainer: {
    width: Dimensions.get('window').width * 0.9,
  },

  errorDetailsToggle: {
    color: colors.grey6,
    textAlign: 'center',
    marginBottom: 10,
  },

  errorInfoText: {
    marginVertical: 3,
  },
});
