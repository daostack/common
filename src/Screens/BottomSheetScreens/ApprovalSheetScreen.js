import {Text, View, StyleSheet, ScrollView, Image} from 'react-native';

import React from 'react';
import {text, layout, colors} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';

const ApprovalSheetScreen = ({navigation, onContinueEditing}) => {
  return (
    <View style={styles.body}>
      <Text style={styles.title}>Approve</Text>

      <Text style={text.blackText}>This cannot be changed later</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    paddingVertical: 20,
    ...text.h1Black,
    color: colors.lightishGreen,
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
  },
  scrollView: {
    flex: 1,
  },
  sheetTextStyle: {
    ...text.greyText,
    ...text.centered,
  },
  body: {
    flex: 1,
    ...layout.content,
    width: '100%',
    alignSelf: 'stretch',
  },

  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
});

export default ApprovalSheetScreen;
