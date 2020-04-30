import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import TextInputField from '../FormFields/TextInputField';
import ImageField from '../FormFields/ImageField';
import {observer, inject} from 'mobx-react';
import {layout, text} from '../../Theme';
import FirebaseService from '../../Services/FirebaseService';
const firebaseService = new FirebaseService();

class CreateCommonForm extends React.Component {
  static FIELD_NAME = 'name';
  static FIELD_BYLINE = 'byline';
  static FIELD_DESCRIPTION = 'description';
  static FIELD_LINKS = 'links';
  static FIELD_FUNDING_GOAL = 'funding';
  static FIELD_DEADLINE = 'deadline';
  static FIELD_MINIMUM = 'minimum';
  static FIELD_ACTION = 'action';
  static FIELD_RULES = 'rules';
  static FIELD_AVATAR = 'avatar';
  static FIELD_AVATAR = 'image';

  formSkip() {}

  formSave = () => {
    const {createCommonFormStore, userId} = this.props;
    if (createCommonFormStore.isFormValid()) {
      // firebaseService
      //   .editUser(userId, completeAccountFormStore.getChangedFormFieldsJson())
      //   .catch(err => {
      //     completeAccountFormStore.form.meta.submitError = `${err.toString()}  \n ${
      //       err.response
      //         ? `\nCode: ${err.response.data.code}  \nMessage: ${err.response.data.message}`
      //         : ''
      //     }`;
      //     completeAccountFormStore.form.meta.isLoadingSubmit = false;
      //     throw err;
      //   });
    }
  };

  render() {
    const {
      createCommonFormStore,
      name,
      image,
      email,
      ...otherProps
    } = this.props;

    console.log('createCommonFormStore');
    console.log(createCommonFormStore);
    return <View />;
  }
}

export default inject('createCommonFormStore')(observer(CreateCommonForm));
