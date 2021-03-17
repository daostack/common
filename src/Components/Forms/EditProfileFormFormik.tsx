import React, {ReactElement} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import {object, string} from 'yup';
import TextInputField from '../Formik/TextInputField';
import ImageField from '../Formik/ImageField';
import {inject} from 'mobx-react';
import {layout, text, font, colors} from '~/Theme';
import {AuthStore} from '~/Types/store';
import {CountrySelectField} from '~/Components/Formik/CountrySelectField';

const validationSchema = object({
  firstName: string().required().label('The first name'),
  lastName: string().required().label('The last name'),
  photoURL: string(),
  intro: string().label('The intro'),
});

type Props = {
    authStore: AuthStore,
    isFirstOpening?: boolean,
}

function EditProfileForm({authStore,isFirstOpening}: Props): ReactElement {
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
        validationSchema={validationSchema}
        onSubmit={({firstName, lastName, dateOfBirth}): void => console.log('t')}
        >
        {({handleChange, handleBlur, values, errors, touched}): ReactElement => {
          console.log('values.intro',values.intro);
          return (
      <View
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
        <ImageField
          isAvatar={true}
          value={values.photoURL}
          allowsEditing={true}
          title={'Select new avatar'}
          onChangeImage={handleChange('photoURL')}
          name="photoURL"
        />

        <View style={styles.emailContainer}>
          <Text style={text.ashleyjquimbacom}>{values.email}</Text>
        </View>

        <TextInputField
          errorMessage={errors && touched.firstName && errors.firstName}
          value={values.firstName}
          viewStyle={{alignSelf: 'stretch'}}
          label="First name"
          infoLabel="Required"
          placeholderText="First name"
          onBlur={handleBlur('firstName')}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={handleChange('firstName')}
        />

        <TextInputField
          errorMessage={errors && touched.lastName && errors.lastName}
          value={values.lastName}
          viewStyle={{alignSelf: 'stretch'}}
          label="Last name"
          infoLabel="Required"
          placeholderText="Last name"
          autoCapitalize="none"
          autoCorrect={false}
          onBlur={handleBlur('lastName')}
          onChangeText={handleChange('lastName')}
        />

        {/* {isFirstOpening && ( */}
          <CountrySelectField
            label="Country"
            infoLabel="Required"
            value={values.country}
            onBlur={handleBlur('country')}
            onChange={handleChange('country')}
          />
        {/* )} */}

        <TextInputField
          errorMessage={errors && touched.intro && errors.intro}
          label="Intro"
          placeholderText="What are you most passionate about, really good at, or love"
          autoCapitalize="none"
          autoCorrect={false}
          multiline={true}
          onBlur={handleBlur('lastName')}
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
    ...font.primary.regular,
    paddingVertical: 5,
  },
});

export default inject('authStore')(EditProfileForm);
