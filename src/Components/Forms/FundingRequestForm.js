import React from 'react';
import {View, Text} from 'react-native';
import TextInputField from '../FormFields/TextInputField';
import MultiImageField from '../FormFields/MultiImageField';
import MultiFileField from '../FormFields/MultiFileField';
import MultiLinkField from '../FormFields/MultiLinkField';
import {layout, text, colors, font} from '~/Theme';
import TextInputFieldWithIcon from '~/Components/FormFields/TextInputFieldWithIcon';
import logger from '~/Services/Logger';
import {func, shape, object} from 'prop-types';
import {formatNumber} from '~/Util';

class FundingRequestForm extends React.Component {
  static FIELD_TITLE = 'title';
  static FIELD_AMOUNT_REQUESTED = 'amount_requested';
  static FIELD_DESCRIPTION = 'description';
  static FIELD_LINKS = 'links';
  static FIELD_IMAGES = 'images';
  static FIELD_FILES = 'files';

  formSave = async (e) => {
    const {fundingRequestFormStore} = this.props;
    if (fundingRequestFormStore.isFormValid()) {
      if (this.props.onFormSubmit) {
        this.props.onFormSubmit(/* changedFields */);
      }
    }
  };

  onFormClose = (e) => {
    const {onFormClose} = this.props;
    if (onFormClose) {
      onFormClose();
    }
  };

  render() {
    const {
      fundingRequestFormStore,
      common,
      ...otherProps
    } = this.props;

    logger.log('common.balance ->', common.balance);
    const balance = formatNumber(common.balance / 100);
    const balanceString = `${balance}${common.balance !== 0 ? ' or below $0' : ''}`;

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
          placeholderText="Briefly describe your proposal"
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
          label="Funding amount requested"
          placeholderText="0"
          infoLabel="Required"
          infoMessage={`Leave as $0 if no funds are requested. Common balance:$${balance}`}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="numeric"
          validation={{
            name: FundingRequestForm.FIELD_AMOUNT_REQUESTED,
            formStore: this.props.fundingRequestFormStore,
            validateRule: `required|numeric|max:${common.balance / 100}|min:0`,
            customErrorMessage: `The amount requested cannot be greater than the Common balance, which is $${balanceString}`,
          }}
        />

        <TextInputField
          infoLabel="Required"
          label="Description"
          placeholderText="What exactly do you plan to do and how? How does it align with the Common's agenda and goals?"
          multiline={true}
          numberOfLines={5}
          validation={{
            name: FundingRequestForm.FIELD_DESCRIPTION,
            formStore: this.props.fundingRequestFormStore,
            validateRule: 'required',
          }}
        />

        <Text style={{...text.h3Black, ...{textAlign: 'left'}}}>Related Links</Text>
        <Text
          style={{
            ...layout.marginTopS,
            ...font.primary.regular,
            ...font.fontSize(2),
            letterSpacing: 0,
            color: colors.slate,
          }}>
          Add links to resources and content related to your proposal
        </Text>

        <MultiLinkField
          link
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
            ...layout.marginTopS,
            ...font.primary.regular,
            ...font.fontSize(2),
            letterSpacing: 0,
            color: colors.slate,
          }}>
          Attach documents and files
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

FundingRequestForm.propTypes = {
  fundingRequestFormStore: shape({
    isFormValid: func,
  }),
  common: object,
  onFormSubmit: func,
  onFormClose: func,
};

export default FundingRequestForm;
