import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {colors, text, layout, font, sizeL, sizeLineHeight} from '~/Theme';
import {func, object, shape, array, InferProps} from 'prop-types';
import MultiLinkField from '~/Components/FormFields/MultiLinkField';
import {RULES} from '~/Components/Forms/EditCommonForm';

const EditRules: React.FC<InferProps<typeof EditRules.propTypes>> = ({
  isValidChange,
  common,
  editCommonFormStore,
}) => (
  <View style={styles.body}>
    <Text style={styles.subtitle}>Define your rules of conduct</Text>

    <Text style={styles.title}>Rules of conduct</Text>
    <Text
      style={{
        ...font.primary.regular,
        ...font.fontSize(2),
        ...font.lineHeight(2),
        color: colors.grey3,
      }}>
      Use rules to set the tone for your Common's discussions. (No advertising
      and spam, accepted language, etc.)
    </Text>

    <MultiLinkField
      rule
      allowsEditing={true}
      title="Rule title"
      placeholderValueText="Rule description"
      multiline={true}
      addMultiFieldBtnName="Add Rule"
      onChangeText={(value) => isValidChange(value)}
      currRules={common.rules}
      validation={{
        name: RULES,
        formStore: editCommonFormStore,
        validateRule: {common: 'string', title: 'string|max:80'},
      }}
    />
  </View>
);

EditRules.propTypes = {
  common: shape({
    rules: array,
  }),
  editCommonFormStore: object,
  isValidChange: func,
};

const styles = StyleSheet.create({
  body: {
    padding: 20,
  },
  subtitle: {
    ...text.greyText,
    ...layout.marginTopS,
    marginBottom: sizeL,
    textAlign: 'center',
    ...font.fontSize(2),
    ...font.primary.regular,
    lineHeight: sizeLineHeight,
  },
  title: {
    marginTop: 24,
    ...font.primary.bold,
    ...font.fontSize(3),
    ...font.lineHeight(2),
  },
});

export default EditRules;
