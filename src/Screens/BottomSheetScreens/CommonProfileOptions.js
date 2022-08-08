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
import {observer} from 'mobx-react';
import {object, func, string, bool} from 'prop-types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const CommonProfileOptions = ({
  moderatorOptions = null,
  onAction,
  hasPermission,
  hasShare = false,
}) => {
  const insets = useSafeAreaInsets();
  const [actions, setActions] = useState(
    moderatorOptions.actions || ['Hide', 'Report'],
  );
  const [iconName, setIconName] = useState('hidden');
  const {item} = moderatorOptions;
  const isOptions = item ? false : true;

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

  const renderEditActions = () => (
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
  );

  const renderCommonShare = () => (
    <>
      <TouchableOpacity
        style={styles.optionBtn}
        onPress={() => onAction('Share')}>
        <Icon
          name="share-32"
          style={layout.marginRightS}
          color={colors.black}
        />
        <Text style={{...text.buttonblack, lineHeight: 20}}>Share</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionBtn}
        onPress={() => onAction('Copy link')}>
        <Icon name="copy" style={layout.marginRightL} color={colors.black} />
        <Text style={{...text.buttonblack, lineHeight: 20, marginLeft: 10}}>
          Copy Link
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderModeratorTools = () => (
    <>
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
  );

  return (
    <ScrollView
      style={[styles.scrollView]}
      contentContainerStyle={[
        styles.scrollContainer,
        {paddingBottom: insets.bottom + 20},
      ]}
      vertical={true}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
      directionalLockEnabled={true}>
      <View style={styles.body}>
        <Text style={styles.text}>Options</Text>
        {isOptions && renderEditActions()}
        {item && (
          <>
            {hasShare && renderCommonShare()}
            {renderModeratorTools()}
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
  hasShare: bool,
};

const styles = StyleSheet.create({
  lineHorizontal: {
    width: '90%',
    borderWidth: 1,
    borderColor: colors.blueGray1,
  },
  scrollView: {},
  scrollContainer: {
    flexGrow: 1,
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

export default observer(CommonProfileOptions);
