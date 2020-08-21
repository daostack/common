import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { inject, observer } from 'mobx-react';
import React from 'react';
import {
  text, layout, colors, font,
} from '../../Theme/index';

const TransactionError = ({ bottomSheetStore, ...props }) => (
  <View style={styles.scrollView}>
    <View style={styles.body}>
      <Image
        source={require('../../Assets/alert.png')}
        style={styles.imgAlert}
      />
      <Text style={styles.title}>Something went wrong</Text>

      <View style={styles.textWithIconContainer}>
        <Text style={styles.blackTextWithImage}>{props.errorMessage}</Text>
      </View>
      <TouchableOpacity
        style={styles.dismissButton}
        onPress={() => bottomSheetStore.hideBottomSheet()}
      >
        <Text style={text.buttonblue}>Dismiss</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  title: {
    ...text.h1Black,
    textAlign: 'left',
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
  },

  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
});

export default inject('bottomSheetStore')(observer(TransactionError));
