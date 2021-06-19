import React, {ReactElement} from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import {text, layout, font, sizeL, sizeLineHeight} from '~/Theme';
import CommonImage from '~/Components/FormikForm/CommonImage';
import TextInputField from '~/Components/FormikForm/TextInputField';
const {width} = Dimensions.get('window');
import {object, string as yupString} from 'yup';
import {FormikProps} from 'formik';

export const validationSchema = object({
  image: yupString().required(),
  name: yupString().required().label('The first name'),
  tagLine: yupString().required().label('The last name'),
  about: yupString(),
});

export interface Values {
  image: string;
  name: string;
  tagLine: string;
  about: string;
}

const EditInfo = (formik: {formikProps: FormikProps<Values>}): ReactElement => {
  const {
    touched,
    errors,
    values,
    handleChange,
    handleBlur,
  } = formik.formikProps;

  return (
    <View style={styles.body}>
      <Text style={styles.subtitle}>
        Describe your cause and let the community learn more about your plans
        and goals
      </Text>

      <CommonImage
        width={width}
        commonName={values?.name}
        commonByLine={values?.tagLine}
        currImage={values?.image}
        onImageChanged={handleChange('image')}
      />

      <TextInputField
        errorMessage={errors && touched?.name && errors?.name}
        value={values?.name}
        viewStyle={{alignSelf: 'stretch'}}
        label="Name"
        infoLabel="Required"
        placeholderText="Name"
        onBlur={handleBlur('name')}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={handleChange('name')}
      />

      <TextInputField
        errorMessage={errors && touched.tagLine && errors.tagLine}
        value={values?.tagLine}
        viewStyle={{alignSelf: 'stretch'}}
        label="Tagline"
        infoLabel="Required"
        placeholderText="Tagline"
        onBlur={handleBlur('tagLine')}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={handleChange('tagLine')}
      />

      <TextInputField
        errorMessage={errors && touched.about && errors.about}
        value={values?.about}
        viewStyle={{alignSelf: 'stretch'}}
        label="About"
        infoLabel="Required"
        placeholderText="About"
        onBlur={handleBlur('about')}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={handleChange('about')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    ...layout.btnPrimary,
    width: '85%',
    alignSelf: 'center',
  },
  body: {
    ...layout.content,
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
});

export default EditInfo;
