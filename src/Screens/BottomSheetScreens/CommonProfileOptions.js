import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import React from 'react';
import {text, layout, colors} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';

const CommonProfileOptions = ({navigation, onContinueEditing}) => {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollView}
      vertical={true}
      nestedScrollEnabled={true}
      directionalLockEnabled={true}>
      <View style={styles.body}>
        <Text style={{...text.h2Black, alignSelf: 'center', marginBottom: 30}}>
          Options
        </Text>

        <TouchableOpacity style={styles.optionBtn}>
          <Icon
            name="following"
            style={layout.marginRightS}
            color={colors.black}
          />
          <Text style={text.buttonblack}>Unfollow</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionBtn}>
          <Icon
            name="agenda"
            style={layout.marginRightS}
            color={colors.black}
          />
          <Text style={text.buttonblack}>Contribute</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionBtn}>
          <Icon
            name="agenda"
            style={layout.marginRightS}
            color={colors.black}
          />
          <Text style={text.buttonblack}>View agenda</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionBtn}>
          <Icon
            name="agenda"
            style={layout.marginRightS}
            color={colors.black}
          />
          <Text style={text.buttonblack}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionBtn}>
          <Icon
            name="report"
            style={layout.marginRightS}
            color={colors.error}
          />
          <Text style={text.buttonred}>Report</Text>
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
    alignSelf: 'stretch',
    ...layout.content,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
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
    width: 330,
  },
});

export default CommonProfileOptions;
