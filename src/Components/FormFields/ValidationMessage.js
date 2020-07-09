import React from 'react';

import {Text, StyleSheet} from 'react-native';
import {observer} from 'mobx-react';
import {colors, layout, font} from '../../Theme';

const styles = StyleSheet.create({
  errorMessage: {
    color: colors.error,
    ...layout.marginBottomM,
    ...font.primary.regular,
    ...font.fontSize(2),
  },
});
class ValidationMessage extends React.Component {
  render() {
    return (
      <Text style={styles.errorMessage}>
        {this.props.formStore.form.fields[this.props.name].error || ''}
      </Text>
    );
  }
}

export default observer(ValidationMessage);
