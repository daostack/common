
import React from 'react';
import {View} from 'react-native';
import {observer, inject} from 'mobx-react';

class CreateCommonForm extends React.Component {
  static NAME = 'name';
  static BYLINE = 'byline';
  static DESCRIPTION = 'description';
  static LINKS = 'links';
  static FUNDING_GOAL = 'funding';
  static DEADLINE = 'deadline';
  static MINIMUM = 'minimum';
  static ACTION = 'action';
  static RULES = 'rules';
  static AVATAR = 'avatar';
  static IMAGE = 'image';

  formSkip() {}

  formSave = () => {
    const {createCommonFormStore} = this.props;
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
    const {createCommonFormStore} = this.props;

    console.log('createCommonFormStore');
    console.log(createCommonFormStore);
    return <View />;
  }
}

export default inject('createCommonFormStore')(observer(CreateCommonForm));
