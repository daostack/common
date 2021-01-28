import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {text, layout, colors} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import {inject, observer} from 'mobx-react';
import {object, func} from 'prop-types';

const CommonProfileOptions = ({bottomSheetStore, onEdit}) => (
  <ScrollView
    contentInsetAdjustmentBehavior="automatic"
    style={styles.scrollView}
    vertical={true}
    nestedScrollEnabled={true}
    directionalLockEnabled={true}>
    <View style={styles.body}>
      <Text style={styles.text}>Options</Text>
      <TouchableOpacity style={styles.optionBtn} onPress={() => onEdit('info')}>
        <Icon
          name="dao-general-info-24"
          style={layout.marginRightS}
          color={colors.black}
        />
        <Text style={text.buttonblack}>Edit info and cover photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionBtn}
        onPress={() => onEdit('rules')}>
        <Icon
          name="agenda-24"
          style={layout.marginRightS}
          color={colors.black}
        />
        <Text style={text.buttonblack}>Edit rules</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
);

CommonProfileOptions.propTypes = {
  bottomSheetStore: object,
  onEdit: func,
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
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    paddingVertical: 20,
  },

  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },

  optionBtn: {
    alignSelf: 'stretch',
    ...layout.content,
    ...layout.flexRow,
    ...layout.flexStart,
    borderBottomWidth: 1,
    borderColor: colors.grey4,
    width: 350,
  },
  text: {
    ...text.h2Black,
    alignSelf: 'center',
    marginBottom: 30,
  },
});

export default inject('bottomSheetStore')(observer(CommonProfileOptions));
