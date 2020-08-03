import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import TextInputField from '../FormFields/TextInputField';
import ImageField from '../FormFields/ImageField';
import {observer, inject} from 'mobx-react';
import {layout, text} from '../../Theme';
import AuthService from '../../Services/AuthService';
import {filterObjectByKeys} from '../../Util';
import colors from '../../Theme/colors';

class EditProfileForm extends React.Component {
  static FIELD_FIRST_NAME = 'firstName';
  static FIELD_LAST_NAME = 'lastName';
  static FIELD_INTRO = 'intro';
  static FIELD_PROFILE_IMAGE = 'photoURL';

  formSave = async e => {
    const {editProfileFormStore} = this.props;
    if (editProfileFormStore.isFormValid()) {
      const changedFields = editProfileFormStore.getChangedFormFieldsJson();

      let authData = filterObjectByKeys(changedFields, [
        EditProfileForm.FIELD_FIRST_NAME,
        EditProfileForm.FIELD_LAST_NAME,
        EditProfileForm.FIELD_PROFILE_IMAGE,
      ]);
      let publicData = filterObjectByKeys(changedFields, [
        EditProfileForm.FIELD_INTRO,
      ]);

      try {
        await AuthService.getInstance().updateUserData(authData, publicData);
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

    return (
      <View
        {...otherProps}
        style={{
          alignSelf: 'stretch',
          flexGrow: 1,
          marginTop: 15,
        }}>
        <ImageField
          isAvatar={true}
          value={userStore.userInfo.photoURL}
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
          value={userStore.userInfo.firstName}
          viewStyle={{alignSelf: 'stretch'}}
          label="First name"
          infoLabel="Required"
          placeholderText="First name"
          autoCapitalize="none"
          autoCorrect={false}
          validation={{
            name: EditProfileForm.FIELD_FIRST_NAME,
            formStore: this.props.editProfileFormStore,
            validateRule: 'required'
          }}
        />

        <TextInputField
          value={userStore.userInfo.lastName}
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
          }}
        />

        <TextInputField
          label="Intro"
          placeholderText="I work on a DAO project at iteratec and am interested in DAOs, coops as well as crypto and blockchain in general."
          multiline={true}
          value={userStore.userInfo.intro}
          validation={{
            name: EditProfileForm.FIELD_INTRO,
            formStore: this.props.editProfileFormStore,
            validateRule: 'string',
          }}
        />

        <View style={styles.containerRow}>
          {firstOpening ? (
            <TouchableOpacity
              style={{...layout.btnOutline, ...layout.marginRightS}}
              onPress={this.onFormClose}>
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
    ...layout.marginBottomS,
    marginTop: 0,
  },
});

export default inject(
  'editProfileFormStore',
  'userStore',
)(observer(EditProfileForm));
