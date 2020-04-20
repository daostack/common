import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import TextInputField from '../FormFields/TextInputField';
import ImageField from '../FormFields/ImageField';
import {observer, inject} from 'mobx-react';
import {layout, text} from '../../Theme';
import FirebaseService from '../../Services/FirebaseService';
const firebaseService = new FirebaseService();

class CreateCommonForm extends React.Component {
  static NAME = 'name';
  static BYLINE = 'byline';
  static DESCRIPTION = 'description';
  static LINKS = 'links';
  static FUNDING_GOAL = 'funding';
  static DEADLINE = 'deadline';
  static MINIMUM = 'minimun';
  static ACTION = 'action';
  static RULES = 'rules';
  static AVATAR = 'avatar';
  static IMAGE = 'image';

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
    return <View></View>;
  }
}

export default inject('createCommonFormStore')(observer(CreateCommonForm));
