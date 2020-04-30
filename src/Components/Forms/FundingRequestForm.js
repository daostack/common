import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import TextInputField from '../FormFields/TextInputField';
import MultiImageField from '../FormFields/MultiImageField';

import ImageField from '../FormFields/ImageField';
import {observer, inject} from 'mobx-react';
import {layout, text, colors} from '../../Theme';
import FirebaseService from '../../Services/FirebaseService';
import AuthService from '../../Services/AuthService';

class FundingRequestForm extends React.Component {
  static FIELD_TITLE = 'Title';
  static FIELD_AMOUNT_REQUESTED = 'Amount requested';
  static FIELD_DESCRIPTION = 'Description';
  static FIELD_LINKS = 'Links';
  static FIELD_IMAGES = 'Images';

  state = {
    linkCount: 1,
  };

  formSkip() {}

  formSave = async e => {
    const {fundingRequestFormStore, userStore} = this.props;
    if (fundingRequestFormStore.isFormValid()) {
      const changedFields = fundingRequestFormStore.getChangedFormFieldsJson();

      let publicData = {};
      let authData = {};

      if (changedFields.displayName) {
        authData.displayName = changedFields.displayName;
      }
      if (changedFields.intro) {
        publicData.intro = changedFields.intro;
      }

      try {
        await FirebaseService.getInstance().editUser(
          userStore.userInfo.uid,
          publicData,
        );
        await AuthService.getInstance().updateUserData(authData);
      } catch (err) {
        console.log('Error -> ', err);
        fundingRequestFormStore.form.meta.submitError = `${err.toString()}  \n ${
          err.response
            ? `\nCode: ${err.response.data.code}  \nMessage: ${err.response.data.message}`
            : ''
        }`;
        fundingRequestFormStore.form.meta.isLoadingSubmit = false;
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
      fundingRequestFormStore,
      firstOpening,
      ...otherProps
    } = this.props;

    console.log('fundingRequestFormStore');
    console.log(fundingRequestFormStore);
    return (
      <View
        {...otherProps}
        style={{
          alignSelf: 'stretch',
          flexGrow: 1,
          marginTop: 15,
        }}>
        <TextInputField
          viewStyle={{alignSelf: 'stretch'}}
          label="Title"
          placeholderText="Briefly describe how you wish to spend these funds"
          autoCapitalize="none"
          multiline={true}
          numberOfLines={2}
          autoCorrect={false}
          validation={{
            name: FundingRequestForm.FIELD_TITLE,
            formStore: this.props.fundingRequestFormStore,
            validateRule: 'required',
          }}
        />

        <TextInputField
          viewStyle={{alignSelf: 'stretch'}}
          label="Amount requested"
          placeholderText="$"
          validation={{
            name: FundingRequestForm.FIELD_AMOUNT_REQUESTED,
            formStore: this.props.fundingRequestFormStore,
            validateRule: 'required',
          }}
        />

        <TextInputField
          label="Description"
          placeholderText="What exactly do you plan to do and how? How does it align with the common's agenda and goals?"
          multiline={true}
          numberOfLines={6}
          validation={{
            name: FundingRequestForm.FIELD_DESCRIPTION,
            formStore: this.props.fundingRequestFormStore,
            validateRule: 'required',
          }}
        />

        <Text style={{...text.h3Black, ...{textAlign: 'left'}}}>Links</Text>
        <Text
          style={{
            ...text.tapBarunselected,
            ...layout.marginTopS,
            ...{textAlign: 'left'},
          }}>
          Have any resources or links to support your offer?
        </Text>
        {/*
        {[...Array(this.state.linkCount).keys()].map(x => (
          <>
            <TextInputField
              key={x}
              value={''}
              viewStyle={{marginTop: x === 0 ? 0 : -30}}
              placeholderText="Title"
            />
            <TextInputField
              key={x}
              value={''}
              viewStyle={{marginTop: -25}}
              placeholderText="https://"
              autoCapitalize="none"
              autoCorrect={false}
              //onChangeText={isValid}
              validation={{
                name: `${FundingRequestForm.FIELD_LINKS}_${x}`,
                formStore: fundingRequestFormStore,
                validateRule: 'string|url',
              }}
            />
          </>
        ))}
        <TouchableOpacity>
          <Text
            style={styles.addLinkBtn}
            onPress={() =>
              this.setState({linkCount: this.state.linkCount + 1})
            }>
            Add Link
          </Text>
        </TouchableOpacity>
          */}

        <Text
          style={{
            ...text.h3Black,
            ...layout.marginTopL,
            ...{textAlign: 'left'},
          }}>
          Files
        </Text>

        <Text
          style={{
            ...text.h3Black,
            ...layout.marginTopL,
            ...{textAlign: 'left'},
          }}>
          Images
        </Text>

        <MultiImageField
          allowsEditing={true}
          title={'Add Image'}
          validation={{
            name: FundingRequestForm.FIELD_IMAGES,
            formStore: fundingRequestFormStore,
            validateRule: 'string',
          }}
        />

        <View style={styles.containerRow}>
          <TouchableOpacity
            style={{...layout.btnPrimary, ...layout.marginLeftS}}
            onPress={this.formSave}>
            <Text style={text.buttoncenterwhite}>Create Proposal</Text>
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
  addLinkBtn: {
    ...text.h3Black,
    color: colors.mainBlue,
    textAlign: 'left',
  },
});

export default inject('fundingRequestFormStore')(observer(FundingRequestForm));
