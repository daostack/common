import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from '~/Assets/iconfont/Icon';
import {colors, font, layout, text} from '~/Theme';

interface Props {
  moderatorOptions: null;
  onAction: (action: string) => void;
  hasPermission: boolean;
}

export const ModalCommonOptions = ({onAction}: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.body, {marginBottom: insets.bottom + 16}]}>
      <Text style={styles.text}>Options</Text>
        <>
          <TouchableOpacity
            style={styles.optionBtn}
            onPress={() => onAction('info')}>
            <Icon
              name="dao-general-info-24"
              style={layout.marginRightS}
              color={colors.black}
            />
            <Text style={styles.btnText}>Edit info and cover photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionBtn}
            onPress={() => onAction('rules')}>
            <Icon
              name="agenda-24"
              style={layout.marginRightS}
              color={colors.black}
            />
            <Text style={styles.btnText}>Edit rules</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionBtn}
            onPress={() => onAction('delete')}>
            <Icon
              name="delete"
              style={layout.marginRightS}
              color={colors.pinkishOrange}
            />
            <Text style={styles.btnOptionText}>Delete common</Text>
          </TouchableOpacity>
        </>
    </View>
  );
};

  const styles = StyleSheet.create({
    sheetTextStyle: {
      ...text.greyText,
      ...text.centered,
    },
    body: {
      width: '100%',
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
      paddingVertical: 22,
      paddingHorizontal: 16,
    },
    text: {
      ...font.primary.bold,
      fontSize: 20,
      lineHeight: 28,
      alignSelf: 'center',
      marginBottom: 30,
    },
    btnText: {
      fontFamily: 'NunitoSans-SemiBold',
      fontSize: 16,
      lineHeight: 20,
      color: colors.black,
    },
    btnOptionText: {
      fontFamily: 'NunitoSans-SemiBold',
      fontSize: 16,
      lineHeight: 20,
      color: colors.pinkishOrange,
    },
  });

