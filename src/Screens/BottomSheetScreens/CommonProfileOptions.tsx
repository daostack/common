import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {text, layout, colors} from '~/Theme';
import Icon, {IconNames} from '~/Assets/iconfont/Icon';
import {DiscussionMessage} from '~/Stores/Models';
import {ActionValues} from '~/Components/Moderation/constants';
import {EditType} from '~/Types';

// keyof typeof ACTIONS
type Actions = ReadonlyArray<ActionValues>;

export interface CommonProfileOptionsProps {
  moderatorOptions?: {item: DiscussionMessage; actions?: Actions};
  onAction(action: EditType | ActionValues): void;
  hasPermission: string;
}

export const CommonProfileOptions: React.FC<CommonProfileOptionsProps> = ({
  moderatorOptions = null,
  onAction,
  hasPermission,
}) => {
  const [actions, setActions] = useState<Actions>(
    moderatorOptions?.actions || ['Hide', 'Report'],
  );
  const [iconName, setIconName] = useState<IconNames>('hidden');
  useEffect(() => {
    if (moderatorOptions?.item?.moderation?.flag === 'hidden') {
      setActions(['Show']);
      setIconName('show');
    }
  }, [moderatorOptions?.item?.moderation?.flag]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollView}
      nestedScrollEnabled={true}
      directionalLockEnabled={true}>
      <View style={styles.body}>
        <Text style={styles.text}>Options</Text>
        {moderatorOptions?.item ? (
          <>
            {hasPermission && <Text style={styles.text}>Moderator tools</Text>}
            {hasPermission && (
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
        ) : (
          <>
            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => onAction(EditType.info)}>
              <Icon
                name="dao-general-info-24"
                style={layout.marginRightS}
                color={colors.black}
              />
              <Text style={text.buttonblack}>Edit info and cover photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => onAction(EditType.rules)}>
              <Icon
                name="agenda-24"
                style={layout.marginRightS}
                color={colors.black}
              />
              <Text style={text.buttonblack}>Edit rules</Text>
            </TouchableOpacity>
          </>
        )}
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
