import React from 'react';
import {View} from 'react-native';
import {observer, inject} from 'mobx-react';
import logger from '../../Services/Logger';
import {object} from 'prop-types';

class RequestToJoinForm extends React.Component {
  static FIELD_IMAGE = 'image';
  static FIELD_ABOUT_ME = 'about_me';
  static FIELD_LINKS = 'links';
  static FIELD_AMOUNT = 'amount';

  static FIELD_CARD_NAME = 'card_name';
  static FIELD_CARD_NUMBER = 'card_number';
  static FIELD_EXPIRATION_DATE = 'expiration_date';
  static FIELD_CVV = 'cvv';

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
    logger.log(requestToJoinFormStore);
    return <View />;
  }
}

RequestToJoinForm.propTypes = {
  requestToJoinFormStore: object,
};

export default inject('requestToJoinFormStore')(observer(RequestToJoinForm));
