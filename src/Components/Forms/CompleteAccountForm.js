import React from 'react';
import {View} from 'react-native';
import TextInputField from '../FormFields/TextInputField';
import {observer, inject} from 'mobx-react';

/*
export interface Props extends ViewProps {
  forgotPasswordSubmit: (e: GestureResponderEvent) => void;
  formStore: CompleteAccountForm;
}
*/

class CompleteAccountForm extends React.Component {
  static FIELD_NAME = 'name';
  static FIELD_INTRO = 'Intro';

  render() {
    const {formStore, ...otherProps} = this.props;

    return (
      <View {...otherProps} style={{alignSelf: 'stretch'}}>
        <TextInputField
          viewStyle={{alignSelf: 'stretch'}}
          label="Name"
          placeholderText="Firstname Lastname"
          autoCapitalize="none"
          autoCorrect={false}
          validation={{
            name: CompleteAccountForm.FIELD_NAME,
            formStore: this.props.completeAccountFormStore,
            validateRule: 'required|email',
          }}
        />
        <TextInputField
          label="Intro"
          placeholderText="What are you passionate about, really good at or love"
          validation={{
            name: CompleteAccountForm.FIELD_INTRO,
            formStore: this.props.completeAccountFormStore,
            validateRule: 'required',
          }}
        />
      </View>
    );
  }
}

export default inject('completeAccountFormStore')(
  observer(CompleteAccountForm),
);
