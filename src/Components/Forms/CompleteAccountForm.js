import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import TextInputField from '../FormFields/TextInputField';
import ImageField from '../FormFields/ImageField';
import {observer, inject} from 'mobx-react';
import {layout, text} from '../../Theme';
import FirebaseService from '../../Services/FirebaseService';
const firebaseService = new FirebaseService();

class CompleteAccountForm extends React.Component {
  static FIELD_NAME = 'name';
  static FIELD_INTRO = 'intro';
  static FIELD_PROFILE_IMAGE = 'profileImage';

  formSkip() {}

  formSave = () => {
    const {completeAccountFormStore, userId} = this.props;
    console.log('FORM SAVE -> ', completeAccountFormStore);
    if (completeAccountFormStore.isFormValid()) {
      firebaseService
        .editUser(
          this.props.userId,
          completeAccountFormStore.getChangedFormFieldsJson(),
        )
        .catch(err => {
          completeAccountFormStore.form.meta.submitError = `${err.toString()}  \n ${
            err.response
              ? `\nCode: ${err.response.data.code}  \nMessage: ${err.response.data.message}`
              : ''
          }`;
          completeAccountFormStore.form.meta.isLoadingSubmit = false;
          throw err;
        });
    }
  };

  render() {
    const {
      completeAccountFormStore,
      name,
      image,
      email,
      ...otherProps
    } = this.props;

    console.log('completeAccountFormStore');
    console.log(completeAccountFormStore);
    return (
      <View
        {...otherProps}
        style={{
          alignSelf: 'stretch',
          flexGrow: 1,
          marginTop: 15,
        }}>
        <ImageField
          value={null}
          placeholderUrl={image}
          validation={{
            name: CompleteAccountForm.FIELD_PROFILE_IMAGE,
            formStore: completeAccountFormStore,
            validateRule: 'string',
          }}
        />

        <View style={styles.emailContainer}>
          <Text style={text.ashleyjquimbacom}>{email}</Text>
        </View>

        <TextInputField
          value={name}
          viewStyle={{alignSelf: 'stretch'}}
          label="Name"
          placeholderText="Firstname Lastname"
          autoCapitalize="none"
          autoCorrect={false}
          validation={{
            name: CompleteAccountForm.FIELD_NAME,
            formStore: completeAccountFormStore,
            validateRule: 'required',
          }}
        />

        <TextInputField
          label="Intro"
          placeholderText="What are you passionate about, really good at or love"
          multiline={true}
          validation={{
            name: CompleteAccountForm.FIELD_INTRO,
            formStore: completeAccountFormStore,
            validateRule: 'required',
          }}
        />

        <View style={styles.containerRow}>
          <TouchableOpacity
            style={{...layout.btnOutline, ...layout.marginRightS}}
            onPress={this.formSkip}>
            <Text style={text.buttonblue}>Skip</Text>
          </TouchableOpacity>

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

export default inject('completeAccountFormStore')(
  observer(CompleteAccountForm),
);
