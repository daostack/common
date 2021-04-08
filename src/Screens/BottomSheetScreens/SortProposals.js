import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {text, layout, colors} from '~/Theme';
import logger from '~/Services/Logger';
import {object, func} from 'prop-types';

const SortProposals = ({navigation, onContinueEditing}) => {
  const liveWithoutSave = (e) => {
    navigation?.current?.goBack();
  };

  const continueEditing = (e) => {
    logger.log('onContinueEditing -> ', onContinueEditing);
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
        <Image style={styles.image} source={require('~/Assets/save.png')} />
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

SortProposals.propTypes = {
  navigation: object,
  onContinueEditing: func,
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
  image: {
    height: 116,
    resizeMode: 'contain',
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
});

export default SortProposals;
