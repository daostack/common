import React from 'react';
import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {text, layout, font, colors} from '../../Theme';
import {inject, observer} from 'mobx-react';
import {BOTTOM_SHEET_TEMPLATES} from '../../Stores/BottomSheetStore';
import {object, func} from 'prop-types';

const PublishCommon = ({bottomSheetStore, forgeCommon}) => (
  <View style = {styles.container}>
    <View style = {styles.body} >
      <Image
        source={require('../../Assets/edit.png')}
        style={styles.image}/>
      <Text style={styles.textTitle}>Are you sure?</Text>
      <Text style={styles.subtitle}>You will not be able to make changes to the Common info after it is published.</Text>
      <TouchableOpacity
        style={styles.dismissButton}
        onPress={() => bottomSheetStore.hideBottomSheet(BOTTOM_SHEET_TEMPLATES.PUBLISH_COMMON)}>
        <Text style={styles.continueEditButtonTxt}>Continue editing</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.publishButton}
        onPress={forgeCommon}>
        <Text style={styles.publishButtonText}>Publish Common</Text>
      </TouchableOpacity>
    </View>
  </View>
);

PublishCommon.propTypes = {
  bottomSheetStore: object,
  forgeCommon: func,
};

const styles = StyleSheet.create({
  container:
  {
    flex: 1,
    padding: 20,
  },
  body: {
    height: '75%',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-around',
  },
  textTitle: {
    ...font.primary.bold,
    ...font.fontSize(4),
  },
  subtitle: {
    ...text.regularText,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,

  },
  image: {
    height: '25%',
    aspectRatio: 1,
  },
  publishButtonText: {
    ...font.primary.regular,
    ...font.fontSize(3),
    color: 'white',
    width: '100%',
    textAlign: 'center',
  },
  continueEditButtonTxt:
  {
    ...font.primary.semiBold,
    ...font.fontSize(3),
    textAlign: 'center',
    color: colors.mainBlue,
    width: '100%',
  },
  publishButton: {
    ...layout.btnPrimary,
    flexGrow: 0,
    width: '100%',
    height: 52,
  },
  dismissButton: {
    ...layout.btnOutline,
    flexGrow: 0,
    width: '100%',
    height: 52,
    alignSelf: 'center',
  },
});

export default inject('bottomSheetStore')(observer(PublishCommon));
