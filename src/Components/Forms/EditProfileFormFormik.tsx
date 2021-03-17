import React, {ReactElement} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import {object, string} from 'yup';
import TextInputField from '../Formik/TextInputField';
import ImageField from '../FormFields/ImageField';
import {inject} from 'mobx-react';
import {layout, text, font, colors} from '~/Theme';
import {AuthStore} from '~/Types/store';
import {CountrySelectField} from '~/Components/Formik/CountrySelectField';

const validationSchema = object({
  firstName: string().required('validation.required'),
  lastName: string().required('validation.required'),
  photoURL: string(),
});

type Props = {
    authStore: AuthStore,
    isFirstOpening?: boolean,
}

function EditProfileForm({authStore,isFirstOpening}: Props): ReactElement {
//   static FIELD_FIRST_NAME = 'firstName';
//   static FIELD_LAST_NAME = 'lastName';
//   static FIELD_COUNTRY = 'country';
//   static FIELD_INTRO = 'intro';
//   static FIELD_PROFILE_IMAGE = 'photoURL';

  console.log('here');
    return (
        <Formik
            initialValues={{
            photoURL: authStore.userInfo.photoURL,
            firstName: authStore.userInfo.firstName,
            lastName: authStore.userInfo.lastName,
            country: authStore.userInfo.country,
            email: authStore.userInfo.email,
            intro: authStore.userInfo.intro,
            }}
        // validate={async (form: PersonalDetails): object => {
        //   try {
        //     await validationSchema.validate(
        //       {
        //         ...form,
        //         dateOfBirth: form.dateOfBirth ? moment.utc(form.dateOfBirth, 'DD/MM/YYYY').toDate() : null,
        //       },
        //       {abortEarly: false},
        //     );
        //     return {};
        //   } catch (error) {
        //     const t = error.inner.reduce(
        //       (obj: PersonalDetails, item: ValidationError) => ({
        //         ...obj,
        //         [item.path]: item.message,
        //       }),
        //       {},
        //     );
        //     return t;
        //   }
        // }}
        validationSchema={validationSchema}
        onSubmit={({firstName, lastName, dateOfBirth}): void => console.log('t')}
        >
        {({handleChange, handleSubmit, values, errors, touched}): ReactElement => {
          console.log('values', values.firstName);

        return (
      <View
        // {...otherProps}
        style={{
          alignSelf: 'stretch',
          flexGrow: 1,
          marginTop: 0,
        }}>
        {isFirstOpening && (
          <View style={{marginBottom: 32}}>
            <Text style={styles.title}>Complete your account</Text>
            <Text style={styles.subtitle}>
              Help the community to get to know you better
            </Text>
          </View>
        )}
        {/* <ImageField
          isAvatar={true}
          value={values.photoURL}
          allowsEditing={true}
          title={'Select new avatar'}
          validation={{
            name: EditProfileForm.FIELD_PROFILE_IMAGE,
            formStore: this.props.editProfileFormStore,
            validateRule: 'string',
          }}
        /> */}

        <View style={styles.emailContainer}>
          <Text style={text.ashleyjquimbacom}>{values.email}</Text>
        </View>

        <TextInputField
          value={values.firstName}
          viewStyle={{alignSelf: 'stretch'}}
          label="First name"
          infoLabel="Required"
          placeholderText="First name"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={handleChange('firstName')}
        />

        <TextInputField
          value={values.lastName}
          viewStyle={{alignSelf: 'stretch'}}
          label="Last name"
          infoLabel="Required"
          placeholderText="Last name"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={handleChange('lastName')}
        />

        {/* {isFirstOpening && ( */}
          <CountrySelectField
            label="Country"
            infoLabel="Required"
            value={values.country}
            onChange={handleChange('country')}
          />
        {/* )} */}

        <TextInputField
          label="Intro"
          infoLabel="Required"
          placeholderText="What are you most passionate about, really good at, or love"
          multiline={true}
          value={values.intro}
          onChangeText={handleChange('intro')}
        />
      </View>
      );}}
    </Formik>
    );
  }

const styles = StyleSheet.create({
  emailContainer: {
    ...layout.content,
    ...layout.marginBottomS,
    marginTop: 0,
  },
  title: {
    ...font.heading.bold,
    ...font.fontSize(5),
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: colors.grey3,
    ...font.fontSize(2),
    ...font.regular,
    paddingVertical: 5,
  },
});

export default inject('authStore')(EditProfileForm);
