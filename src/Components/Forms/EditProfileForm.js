import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import TextInputField from '../FormFields/TextInputField';
import ImageField from '../FormFields/ImageField';
import {inject, observer} from 'mobx-react';
import {layout, text, font, colors} from '~/Theme';
import {bool, object} from 'prop-types';
import {authStorePropTypes} from '~/Types/propTypes';
import {CountrySelectField} from '~/Components/FormFields/CountrySelectField';

class EditProfileForm extends React.Component {
  static FIELD_FIRST_NAME = 'firstName';
  static FIELD_LAST_NAME = 'lastName';
  static FIELD_COUNTRY = 'country';
  static FIELD_INTRO = 'intro';
  static FIELD_PROFILE_IMAGE = 'photoURL';

  render() {
    const {
      authStore,
      editProfileFormStore,
      isFirstOpening,
      ...otherProps
    } = this.props;

    return (
      <View
        {...otherProps}
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
          value={
            this.props.editProfileFormStore.getFormField(
              EditProfileForm.FIELD_PROFILE_IMAGE,
            )?.value || authStore.userInfo.photoURL
          }
          allowsEditing={true}
          title={'Select new avatar'}
          validation={{
            name: EditProfileForm.FIELD_PROFILE_IMAGE,
            formStore: this.props.editProfileFormStore,
            validateRule: 'string',
          }}
        />

        <View style={styles.emailContainer}>
          <Text style={text.ashleyjquimbacom}>{authStore.userInfo.email}</Text>
        </View>

        <TextInputField
          value={
            this.props.editProfileFormStore.getFormField(
              EditProfileForm.FIELD_FIRST_NAME,
            )?.value || authStore.userInfo.firstName
          }
          viewStyle={{alignSelf: 'stretch'}}
          label="First name"
          infoLabel="Required"
          placeholderText="First name"
          autoCapitalize="none"
          autoCorrect={false}
          validation={{
            name: EditProfileForm.FIELD_FIRST_NAME,
            formStore: this.props.editProfileFormStore,
            validateRule: 'required',
            displayName: 'first name',
          }}
        />

        <TextInputField
          value={
            this.props.editProfileFormStore.getFormField(
              EditProfileForm.FIELD_LAST_NAME,
            )?.value || authStore.userInfo.lastName
          }
          viewStyle={{alignSelf: 'stretch'}}
          label="Last name"
          infoLabel="Required"
          placeholderText="Last name"
          autoCapitalize="none"
          autoCorrect={false}
          validation={{
            name: EditProfileForm.FIELD_LAST_NAME,
            formStore: this.props.editProfileFormStore,
            validateRule: 'required',
            displayName: 'last name',
          }}
        />

        {isFirstOpening && (
          <CountrySelectField
            label="Country"
            value={
              this.props.editProfileFormStore.getFormField(
                EditProfileForm.FIELD_COUNTRY,
              )?.value || authStore.userInfo.country
            }
            validation={{
              name: EditProfileForm.FIELD_COUNTRY,
              formStore: this.props.editProfileFormStore,
              validateRule: 'required|string',
              displayName: 'country',
            }}
          />
        )}

        <TextInputField
          label="Intro"
          placeholderText="What are you most passionate about, really good at, or love"
          multiline={true}
          value={
            this.props.editProfileFormStore.getFormField(
              EditProfileForm.FIELD_INTRO,
            )?.value || authStore.userInfo.intro
          }
          validation={{
            name: EditProfileForm.FIELD_INTRO,
            formStore: this.props.editProfileFormStore,
            validateRule: 'string',
          }}
        />
      </View>
    );
  }
}

EditProfileForm.propTypes = {
  authStore: authStorePropTypes.isRequired,
  editProfileFormStore: object.isRequired,
  isFirstOpening: bool,
};

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
