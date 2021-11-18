import {StackActions} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/core';
import React, {ReactElement} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {font, layout, text} from '~/Theme/index';
import {useStore} from '~/Stores';

export function LoadingExpired({
  errorMessage,
}: {
  errorMessage: string;
}): ReactElement {
  const navigation = useNavigation();
  const {
    uiStore: {appLoaderStore, bottomSheetStore},
  } = useStore();
  const onReloadApp = React.useCallback(() => {
    navigation.dispatch(StackActions.popToTop());
    appLoaderStore.showLoader();
    bottomSheetStore.hideBottomSheet();
  }, []);

  return (
    <View style={styles.scrollView}>
      <View style={styles.body}>
        <View style={styles.spacer} />

        <Image source={require('~/Assets/alert.png')} style={styles.imgAlert} />

        <Text style={styles.title}>Something went wrong</Text>

        <View style={styles.textWithIconContainer}>
          <Text style={styles.blackTextWithImage}>{errorMessage}</Text>
        </View>

        <View style={styles.spacer} />

        <TouchableOpacity style={styles.dismissButton} onPress={onReloadApp}>
          <Text style={text.buttonblue}>Reload</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
  body: {
    ...layout.content,
    ...layout.flexStart,
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
});
