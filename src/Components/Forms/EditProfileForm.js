import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import TextInputField from '../FormFields/TextInputField';
import ImageField from '../FormFields/ImageField';
import {observer, inject} from 'mobx-react';
import {layout, text} from '../../Theme';
import FirebaseService from '../../Services/FirebaseService';
import AuthService from '../../Services/AuthService';

class EditProfileForm extends React.Component {
  static FIELD_NAME = 'displayName';
  static FIELD_INTRO = 'intro';
  static FIELD_PROFILE_IMAGE = 'profileImage';

  formSkip() {}

  formSave = async e => {
    const {editProfileFormStore, userStore} = this.props;
    if (editProfileFormStore.isFormValid()) {
      const changedFields = editProfileFormStore.getChangedFormFieldsJson();

      let publicData = {};
      let authData = {};

      if (changedFields.displayName)
        authData.displayName = changedFields.displayName;
      if (changedFields.intro) publicData.intro = changedFields.intro;

      try {
        await FirebaseService.getInstance().editUser(
          userStore.userInfo.uid,
          publicData,
        );
        await AuthService.getInstance().updateUserData(authData);
      } catch (err) {
        console.log('Error -> ', err);
        editProfileFormStore.form.meta.submitError = `${err.toString()}  \n ${
          err.response
            ? `\nCode: ${err.response.data.code}  \nMessage: ${err.response.data.message}`
            : ''
        }`;
        editProfileFormStore.form.meta.isLoadingSubmit = false;
        throw err;
      }

      if (this.props.onFormSubmit) {
        this.props.onFormSubmit(changedFields);
      }
    }
  };

  onFormClose = e => {
    const {onFormClose} = this.props;
    if (onFormClose) {
      onFormClose();
    }
  };

  render() {
    const {
      userStore,
      editProfileFormStore,
      firstOpening,
      ...otherProps
    } = this.props;

    console.log('editProfileFormStore');
    console.log(editProfileFormStore);
    return (
      <View
        {...otherProps}
        style={{
          alignSelf: 'stretch',
          flexGrow: 1,
          marginTop: 15,
        }}>
        <ImageField
          value={userStore.userInfo.profileImage}
          placeholderUrl={userStore.userInfo.photoURL}
          allowsEditing={true}
          title={'Select new avatar'}
          validation={{
            name: EditProfileForm.FIELD_PROFILE_IMAGE,
            formStore: this.props.editProfileFormStore,
            validateRule: 'string',
          }}
        />

        <View style={styles.emailContainer}>
          <Text style={text.ashleyjquimbacom}>{userStore.userInfo.email}</Text>
        </View>

        <TextInputField
          value={userStore.userInfo.displayName}
          viewStyle={{alignSelf: 'stretch'}}
          label="Name"
          placeholderText="Firstname Lastname"
          autoCapitalize="none"
          autoCorrect={false}
          validation={{
            name: EditProfileForm.FIELD_NAME,
            formStore: this.props.editProfileFormStore,
            validateRule: 'required',
          }}
        />

        <TextInputField
          label="Intro"
          placeholderText="What are you passionate about, really good at or love"
          multiline={true}
          value={userStore.userInfo.intro}
          validation={{
            name: EditProfileForm.FIELD_INTRO,
            formStore: this.props.editProfileFormStore,
            validateRule: 'required',
          }}
        />

        <View style={styles.containerRow}>
          {firstOpening ? (
            <TouchableOpacity
              style={{...layout.btnOutline, ...layout.marginRightS}}
              onPress={this.formSkip}>
              <Text style={text.buttonblue}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{...layout.btnOutline, ...layout.marginRightS}}
              onPress={this.onFormClose}>
              <Text style={text.buttonblue}>Cancel</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={{...layout.btnPrimary, ...layout.marginLeftS}}
            onPress={this.formSave}>
            <Text style={text.buttoncenterwhite}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 80,
  },
  emailContainer: {
    ...layout.content,
    ...layout.marginBottomXL,
    marginTop: 0,
  },
});

export default inject(
  'editProfileFormStore',
  'userStore',
)(observer(EditProfileForm));
