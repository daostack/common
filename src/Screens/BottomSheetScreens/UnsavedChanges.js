import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

import React from 'react';
import {text, layout, colors,font} from '../../Theme';

const UnsavedChanges = ({
  navigation,
  onContinueEditing,
  onLeaveWithoutSaving,
}) => {
  const liveWithoutSave = e => {
    navigation.goBack();
    if (onLeaveWithoutSaving) {
      onLeaveWithoutSaving();
    }
  };

  const continueEditing = e => {
    console.log('onContinueEditing -> ', onContinueEditing);
    if (onContinueEditing) {
      onContinueEditing();
    }
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollView}
      vertical={true}
      nestedScrollEnabled={true}
      directionalLockEnabled={true}>
      <View style={styles.body}>
        <Image
          style={styles.image}
          source={require('../../../src/Assets/edit.png')}
        />

        <Text style={styles.title}>
          Unsaved changes
        </Text>
        <Text
          style={styles.message}>
          You are about to leave this page without saving your changes
        </Text>
        <TouchableOpacity
          style={styles.leave}
          onPress={liveWithoutSave}>
          <Text style={text.buttonred}>Leave without saving</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continue}
          onPress={continueEditing}>
          <Text style={text.buttonblack}>Continue editing</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  image: {
    height: 116,
    resizeMode: 'contain',
  },
  continue: {
    ...layout.btnOutline,
    ...layout.marginTopS,
  },
  leave: {
    ...layout.btnOutline,
    ...layout.marginTopXL,
  },
  title: {
    ...text.h1Black,
    ...layout.marginTopM,
  },
  message: {
    ...font.primary.regular,
    ...font.fontSize(3),
    ...text.centered,
    ...layout.marginTopS,
  },
  sheetTextStyle: {
    ...text.greyText,
    ...text.centered,
  },
  body: {
    ...layout.content,
  },

  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
});

export default UnsavedChanges;
