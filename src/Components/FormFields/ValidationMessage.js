import React from 'react';

import {Text} from 'react-native';
import {observer} from 'mobx-react';
import {colors, layout} from '../../Theme';

class ValidationMessage extends React.Component {
  render() {
    return (
      <Text style={{color: colors.error, ...layout.marginBottomM}}>
        {this.props.formStore.form.fields[this.props.name].error || ''}
      </Text>
    );
  }
}

export default observer(ValidationMessage);
