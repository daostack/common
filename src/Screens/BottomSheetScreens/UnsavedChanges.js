import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import React from 'react';
import {text, layout, colors, sizeL} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';

const UnsavedChanges = ({navigation, onContinueEditing}) => {
  const liveWithoutSave = (e) => {
    navigation.goBack();
  };

  const continueEditing = (e) => {
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
        <Icon name="save1" size={100} />
        <Text style={{...text.h3Black, ...layout.marginTopM}}>
          Unsaved Changes
        </Text>
        <Text
          style={{...text.blackText, ...text.centered, ...layout.marginTopS}}>
          You are about to leave this page without saving your changes
        </Text>
        <TouchableOpacity
          style={{...layout.btnOutline, ...layout.marginTopXL}}
          onPress={liveWithoutSave}>
          <Text style={text.buttonred}>Leave without saving</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{...layout.btnOutline, ...layout.marginTopS}}
          onPress={continueEditing}>
          <Text style={text.buttonblue}>Continue editing</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
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
