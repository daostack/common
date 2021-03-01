import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {text, layout, colors} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import {inject, observer} from 'mobx-react';
import {object, func, bool} from 'prop-types';

const CommonProfileOptions = ({
  moderatorOptions = null,
  onAction,
  hasPermission,
}) => {
  const [actions, setActions] = useState(
    moderatorOptions.actions || ['Hide', 'Report'],
  );
  const [actionColor, setActionColor] = useState(text.buttonred);
  const {item} = moderatorOptions;
  useEffect(() => {
    if (item) {
      if (item?.moderation) {
        if (item?.moderation?.flag === 'hidden') {
          setActions(['Show']);
          setActionColor(text.buttonblack);
        }
      }
    }
  }, []);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollView}
      vertical={true}
      nestedScrollEnabled={true}
      directionalLockEnabled={true}>
      <View style={styles.body}>
        <Text style={styles.text}>Options</Text>
        {!item && (
          <>
            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => onAction('info')}>
              <Icon
                name="dao-general-info-24"
                style={layout.marginRightS}
                color={colors.black}
              />
              <Text style={text.buttonblack}>Edit info and cover photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => onAction('rules')}>
              <Icon
                name="agenda-24"
                style={layout.marginRightS}
                color={colors.black}
              />
              <Text style={text.buttonblack}>Edit rules</Text>
            </TouchableOpacity>
          </>
        )}
        {item && (
          <>
            <Text style={styles.text}>Moderator tools</Text>
            {hasPermission && (
              <TouchableOpacity
                style={styles.optionBtn}
                onPress={() => onAction(actions[0])}>
                <Icon
                  name="hidden"
                  style={layout.marginRightS}
                  color={colors.error}
                />
                <Text style={actionColor}>{actions[0]}</Text>
              </TouchableOpacity>
            )}
            {actions[1] && (
              <TouchableOpacity
                style={styles.optionBtn}
                onPress={() => onAction(actions[1])}>
                <Icon
                  name="report-16"
                  style={layout.marginRightS}
                  color={colors.error}
                />
                <Text style={actionColor}>{actions[1]}</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

CommonProfileOptions.propTypes = {
  bottomSheetStore: object,
  moderatorOptions: object,
  onAction: func,
  hasPermission: bool,
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

export default inject('rootStore')(observer(CommonProfileOptions));
