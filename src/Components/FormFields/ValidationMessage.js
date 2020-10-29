import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {observer} from 'mobx-react';
import {colors, layout, font} from '~/Theme';
import {string, bool, object, shape} from 'prop-types';

class ValidationMessage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let validationMessage = this.props.formStore.getFormField(this.props.name, this.props.multiName).error;
    let messageStyle = styles.errorMessage;

    if (this.props.displayName && validationMessage) {
      validationMessage = validationMessage.replace(this.props.name, this.props.displayName);
    }

    if (this.props.customErrorMessage && validationMessage) {
      validationMessage = this.props.customErrorMessage;
    }

    if (!this.props.invisibleContainer) {
      messageStyle = {...styles.errorMessage, ...{minHeight: font.lineHeightForm}};
    }

    return validationMessage || !this.props.invisibleContainer ? (
      <Text style={messageStyle}>
        { validationMessage || ''}
      </Text>
    ) : null;
  }
}

ValidationMessage.propTypes = {
  formStore: shape({
    form: shape({
      fields: object,
    }),
  }),
  name: string,
  multiName: string,
  displayName: string,
  customErrorMessage: string,
  invisibleContainer: bool,
};

const styles = StyleSheet.create({
  errorMessage: {
    color: colors.error,
    ...layout.marginBottomS,
    ...font.primary.regular,
    ...font.fontSize(2),
  },
});

export default observer(ValidationMessage);
