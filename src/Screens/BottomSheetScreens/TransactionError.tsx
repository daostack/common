import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {observer} from 'mobx-react';
import React from 'react';
import {text, layout, colors, font} from '~/Theme/index';
import Icon from '../../Assets/iconfont/Icon';
import {useStore} from '~/Stores';

const VALIDATION_ERROR = 'ValidationError';

type ErrorObj =
  | string
  | {
      data: {
        detailedErrors: any[];
      };
      errorId: string;
      name: string;
      statusCode?: number;
      errorCode?: number | string;
      errorName?: string;
      error?: string;
    };

const removeLineBreaks = (str: string) => str.replace(/[\r\n]+/gm, ' ');

const getChangeHeight = (errorObj?: ErrorObj) => {
  if (errorObj && typeof errorObj === 'object') {
    const detailedErrorsLength = errorObj?.data?.detailedErrors.length || 0;
    return 60 + detailedErrorsLength * 30;
  }
  return 60;
};

export const TransactionError: React.FC<{
  errorMessage: string;
  errorObj?: ErrorObj | string;
}> = observer(({errorMessage, errorObj}) => {
  const {
    uiStore: {bottomSheetStore},
  } = useStore();

  const [showMore, setShowMore] = React.useState(false);

  const toggleShowMore = React.useCallback(() => {
    setShowMore(!showMore);
    const changeHeight = getChangeHeight(errorObj);
    if (showMore) {
      bottomSheetStore.decreaseTopSnap(changeHeight);
    } else {
      bottomSheetStore.increaseTopSnap(changeHeight);
    }
  }, [errorObj]);

  return (
    <View style={styles.scrollView}>
      <View style={styles.body}>
        {errorObj && typeof errorObj === 'object' && (
          <TouchableOpacity style={styles.icon} onPress={toggleShowMore}>
            <Icon name="explanation1" />
          </TouchableOpacity>
        )}

        <View style={styles.spacer} />

        <Image source={require('~/Assets/alert.png')} style={styles.imgAlert} />

        <Text style={styles.title}>Something went wrong</Text>

        {typeof errorObj === 'string' && (
          <Text style={styles.blackTextWithImage}>{errorObj}</Text>
        )}

        {typeof errorObj === 'object' &&
          (showMore ? (
            <View style={layout.marginTopM}>
              <Text>Error ID: {errorObj.errorId}</Text>
              <Text>
                Error Status:{' '}
                {('errorCode' in errorObj && errorObj.errorCode) || ''}
              </Text>
              <Text>Error Name: {errorObj.errorName}</Text>
              {'errorCode' in errorObj &&
              errorObj.errorCode === VALIDATION_ERROR ? (
                <View style={layout.marginTopM}>
                  {errorObj.data.detailedErrors.map((currError, index) => (
                    <View key={`validation_key_${index}`}>
                      <Text>
                        <Text style={{fontWeight: 'bold'}}>{index + 1}.</Text>{' '}
                        Field{' '}
                        <Text style={{fontWeight: 'bold'}}>
                          {currError.field}
                        </Text>{' '}
                        with value{' '}
                        <Text style={{fontWeight: 'bold'}}>
                          {currError.value || 'null'}
                        </Text>{' '}
                        is invalid!
                      </Text>
                      <Text style={{fontSize: 11, color: colors.error}}>
                        {removeLineBreaks(currError.message)}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text>Full error text: {errorObj.error}</Text>
              )}
            </View>
          ) : (
            <View style={styles.textWithIconContainer}>
              <Text style={styles.blackTextWithImage}>{errorMessage}</Text>
            </View>
          ))}

        <View style={styles.spacer} />

        <TouchableOpacity
          style={styles.dismissButton}
          onPress={bottomSheetStore.hideBottomSheet}>
          <Text style={text.buttonblue}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

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
    maxHeight: 220,
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
