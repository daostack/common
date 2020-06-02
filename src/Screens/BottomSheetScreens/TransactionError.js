import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import React from 'react';
import {text, layout, colors} from '../../Theme/index';

const TransactionError = (props) => {
  console.log('TX ERROR PROPS: ',  props.errorMessage);
  return (
    <View
      style={styles.scrollView} >
      <View style={styles.body}>
        <Image
          source={require('../../Assets/alert.png')}
          style={{
            alignSelf: 'center',
            padding: 80,
            resizeMode: 'contain',
            height: 50,
            width: 50,
          }}
        />
        <Text style={styles.title}>Something went wrong</Text>

        <View style={styles.textWithIconContainer}>
          <Text style={styles.blackTextWithImage}>{props.errorMessage}</Text>
        </View>
        <TouchableOpacity
          style={{
            ...layout.btnOutline,
          }}
          onPress={() => {}}>
          <Text style={text.buttonblue}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    paddingVertical: 20,
    ...text.h1Black,
    textAlign: 'left',
  },

  title2: {
    ...layout.marginTopL,
    paddingVertical: 10,
    ...text.h2Black,
    textAlign: 'left',
  },
  textWithIconContainer: {
    ...layout.content,
    ...layout.flexRow,
    paddingHorizontal: 0,
    paddingVertical: 7,
  },
  blackTextWithImage: {
    ...text.blackText,
    ...layout.marginLeftM,
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

export default TransactionError;
