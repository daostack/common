import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {text, layout, colors, font} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import {inject, observer} from 'mobx-react';
import {object, func, string} from 'prop-types';

const CommonProfileOptions = ({
  moderatorOptions = null,
  onAction,
  hasPermission,
}) => {
  const [actions, setActions] = useState(
    moderatorOptions.actions || ['Hide', 'Report', 'Share', 'Copy link'],
  );
  const [iconName, setIconName] = useState('hidden');
  const {item, isMember} = moderatorOptions;
  useEffect(() => {
    if (item) {
      if (item?.moderation) {
        if (item?.moderation?.flag === 'hidden') {
          setActions(['Show']);
          setIconName('show');
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
        <Text style={{...styles.text, ...font.fontSize(4)}}>Options</Text>
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
            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => onAction(actions[2])}>
              <Icon
                name="share-32"
                style={layout.marginRightS}
                color={colors.black}
              />
              <Text style={{...text.buttonblack, lineHeight: 20}}>
                {actions[2]}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => onAction(actions[3])}>
              <Icon
                name="link"
                style={layout.marginRightS}
                color={colors.black}
              />
              <Text style={{...text.buttonblack, lineHeight: 20}}>
                {actions[3]}
              </Text>
            </TouchableOpacity>
            {hasPermission && (
              <>
                <View style={styles.lineHorizontal} />
                <Text style={styles.text}>Moderator tools</Text>
                <TouchableOpacity
                  style={styles.optionBtn}
                  onPress={() => onAction(actions[0])}>
                  <Icon
                    name={iconName}
                    style={layout.marginRightS}
                    color={colors.error}
                  />
                  <Text style={text.buttonred}>{actions[0]}</Text>
                </TouchableOpacity>
              </>
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
                <Text style={text.buttonred}>{actions[1]}</Text>
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
  hasPermission: string,
};

const styles = StyleSheet.create({
  lineHorizontal: {
    width: '90%',
    borderWidth: 1,
    borderColor: colors.blueGray1,
  },
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
    width: 350,
  },
  text: {
    ...text.h2Black,
    alignSelf: 'center',
    marginVertical: 30,
  },
});

export default inject('rootStore')(observer(CommonProfileOptions));
