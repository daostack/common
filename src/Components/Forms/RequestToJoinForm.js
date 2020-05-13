import React from 'react';
import {View} from 'react-native';
import {observer, inject} from 'mobx-react';

class RequestToJoinForm extends React.Component {
  static FIELD_IMAGE = 'image';
  static FIELD_ABOUT_ME = 'about_me';
  static FIELD_LINKS = 'links';
  static FIELD_AMOUNT = 'amount';

  formSkip() {}

  formSave = () => {
    const {requestToJoinFormStore} = this.props;
    if (requestToJoinFormStore.isFormValid()) {
      // firebaseService
      //   .editUser(this.props.userId, completeAccountFormStore.getChangedFormFieldsJson())
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
    const {requestToJoinFormStore} = this.props;

    console.log('requestToJoinFormStore');
    console.log(requestToJoinFormStore);
    return <View />;
  }
}

export default inject('requestToJoinFormStore')(observer(RequestToJoinForm));
