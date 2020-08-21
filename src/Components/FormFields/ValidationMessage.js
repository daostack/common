import React from 'react';

import { Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { colors, layout, font } from '../../Theme';

const styles = StyleSheet.create({
  errorMessage: {
    color: colors.error,
    ...layout.marginBottomS,
    ...font.primary.regular,
    ...font.fontSize(2),
  },
});
class ValidationMessage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let validationMessage = this.props.formStore.form.fields[this.props.name].error;
    let messageStyle = styles.errorMessage;

    if (this.props.displayName && validationMessage) {
      validationMessage = validationMessage.replace(this.props.name, this.props.displayName);
    }

    // console.log('this.props.customErrorMessage ->', this.props.customErrorMessage);

    if (this.props.customErrorMessage && validationMessage) {
      validationMessage = this.props.customErrorMessage;
    }

    if (!this.props.invisibleContainer) {
      messageStyle = { ...styles.errorMessage, ...{ minHeight: font.lineHeightForm } };
    }

    return validationMessage || !this.props.invisibleContainer ? (
      <Text style={messageStyle}>
        { validationMessage || ''}
      </Text>
    ) : null;
  }
}

export default observer(ValidationMessage);
