import React, {ReactElement} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {colors, text, layout, font, sizeL, sizeLineHeight} from '~/Theme';
import MultiTitleValueField from '~/Components/FormikForm/MultiTitleValueField';

import {object, string, array} from 'yup';
import {FormikProps} from 'formik';
import {CommonRule} from '~/Graphql/Common/CommonType';

export const validationSchema = object({
  rules: array().of(
    object().shape(
      {
        title: string().when('value', {
          is: (value: any) => value !== undefined,
          then: string().max(80, 'Max 28 chars').required('Field is required'),
          otherwise: string().max(80, 'Max 28 chars'),
        }),
        value: string().when('title', {
          is: (value: any) => value !== undefined,
          then: string().required('Field is required'),
          otherwise: string(),
        }),
      },
      ['title', 'value'],
    ),
  ),
});

export interface Values {
  rules: Array<CommonRule>;
}

const EditRules = (formik: {
  formikProps: FormikProps<Values>;
}): ReactElement => {
  const {values} = formik.formikProps;

  return (
    <View style={styles.body}>
      <Text style={styles.subtitle}>Define your rules of conduct</Text>

      <View style={styles.divider} />

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

      <MultiTitleValueField
        rule
        allowsEditing={true}
        title="Rule title"
        placeholderValueText="Rule description"
        multiline={true}
        addMultiFieldBtnName="Add Rule"
        currRules={values.rules}
        formik={formik}
      />
    </View>
  );
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
  divider: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: colors.grey4,
  },
});

export default EditRules;
