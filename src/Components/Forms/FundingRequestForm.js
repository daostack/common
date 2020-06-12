import React from 'react';
import {View, Text} from 'react-native';
import TextInputField from '../FormFields/TextInputField';
import MultiImageField from '../FormFields/MultiImageField';
import MultiFileField from '../FormFields/MultiFileField';
import MultiLinkField from '../FormFields/MultiLinkField';

import {observer, inject} from 'mobx-react';
import {layout, text, colors} from '../../Theme';
import TextInputFieldWithIcon from '../../Components/FormFields/TextInputFieldWithIcon';

class FundingRequestForm extends React.Component {
  static FIELD_TITLE = 'title';
  static FIELD_AMOUNT_REQUESTED = 'amount_requested';
  static FIELD_DESCRIPTION = 'description';
  static FIELD_LINKS = 'links';
  static FIELD_IMAGES = 'images';
  static FIELD_FILES = 'files';

  state = {
    linkCount: 1,
  };

  formSkip() {}

  formSave = async e => {
    const {fundingRequestFormStore} = this.props;
    if (fundingRequestFormStore.isFormValid()) {
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
          infoLabel="Required"
          validation={{
            name: FundingRequestForm.FIELD_TITLE,
            formStore: this.props.fundingRequestFormStore,
            validateRule: 'required',
          }}
        />

        <TextInputFieldWithIcon
          iconName="dollar"
          iconSize={12}
          iconStyle={{paddingRight: 5}}
          iconEmptyColor={colors.grey3}
          iconFillColor={colors.grey}
          viewStyle={{alignSelf: 'stretch'}}
          label="Amount requested"
          infoLabel="Required"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="numeric"
          validation={{
            name: FundingRequestForm.FIELD_AMOUNT_REQUESTED,
            formStore: this.props.fundingRequestFormStore,
            validateRule: 'required|numeric',
          }}
        />

        <TextInputField
          infoLabel="Required"
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
            ...text.tapBarUnselected,
            ...layout.marginTopS,
            ...{textAlign: 'left'},
          }}>
          Have any resources or links to support your offer?
        </Text>

        <MultiLinkField
          allowsEditing={true}
          title="Title"
          validation={{
            name: FundingRequestForm.FIELD_LINKS,
            formStore: fundingRequestFormStore,
            validateRule: 'string|url',
          }}
        />

        <Text
          style={{
            ...text.h3Black,
            ...layout.marginTopXL,
            ...{textAlign: 'left'},
          }}>
          Files
        </Text>
        <Text
          style={{
            ...text.tapBarUnselected,
            ...layout.marginTopS,
            ...{textAlign: 'left'},
          }}>
          Anything you want to attach to this proposal?
        </Text>

        <MultiFileField
          allowsEditing={true}
          title={'Add File'}
          validation={{
            name: FundingRequestForm.FIELD_FILES,
            formStore: fundingRequestFormStore,
            validateRule: 'string',
          }}
        />

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
      </View>
    );
  }
}

export default inject('fundingRequestFormStore')(observer(FundingRequestForm));
