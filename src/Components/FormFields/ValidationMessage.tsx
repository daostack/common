import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {observer} from 'mobx-react';
import {colors, layout, font} from '~/Theme';
import {FormStoreValidation} from '~/Stores/FormStores';

const ValidationMessage: React.FC<FormStoreValidation> = (props) => {
  let validationMessage = props.formStore.getFormField(
    props.name,
    props.multiName,
  )?.error;
  let messageStyle = styles.errorMessage;

  if (props.displayName && validationMessage) {
    validationMessage = validationMessage.replace(
      props.name,
      props.displayName,
    );
  }

  if (props.customErrorMessage && validationMessage) {
    validationMessage = props.customErrorMessage;
  }

  if (!props.invisibleContainer) {
    messageStyle = {
      ...styles.errorMessage,
      ...{minHeight: font.lineHeightForm},
    };
  }

  return validationMessage || !props.invisibleContainer ? (
    <Text style={messageStyle}>{validationMessage || ''}</Text>
  ) : null;
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
