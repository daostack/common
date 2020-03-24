import React from 'react';
import {TextInput, View, Text, StyleSheet} from 'react-native';
import ValidationMessage from './ValidationMessage';
import {observer} from 'mobx-react';
import colors from '../../Theme/colors';
import layout from '../../Theme/layout';

/*
interface TextInputFieldProps extends TextInputProps {
  placeholderText?: string;
  onChangeText?: (e: string) => void;
  value?: string;
  password?: boolean;
  viewStyle?: ViewStyle;
  fieldActionComponent?: React.ReactElement;
  editable?: boolean;
  minHeight?: number | null;
  maxHeight?: number | null;

  // Validation management properties
  validation?: ValidationField;
}

*/

class TextInputField extends React.Component {
  fieldValidation;
  toggleValueBtn;
  placeFieldActionComponent;

  static defaultProps;

  constructor(props) {
    super(props);

    this.state = {
      showPassword: props.password,
    };

    const {validation, value, password, fieldActionComponent} = this.props;
    // Register form field for validation message component if name,formStore and validateRule props are provided
    if (validation) {
      const {name, formStore, validateRule} = validation;
      formStore.registerFormField(name, validateRule, value);
      this.fieldValidation = (
        <ValidationMessage formStore={formStore} name={name} />
      );
    }
    /*
    if (password) {
      this.toggleValueBtn = (
        <TogglePasswordButton
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
          }}
          onChange={toggle => this.setState({showPassword: toggle})}
        />
      );
    }
    */

    if (fieldActionComponent) {
      this.placeFieldActionComponent = fieldActionComponent;
    }
  }

  onChangeText = text => {
    if (this.props.validation) {
      const {formStore, name} = this.props.validation;
      formStore.fieldChanged(name, text);
    }
    this.props.onChangeText && this.props.onChangeText(text);
  };

  onBlur = e => {
    if (this.props.validation) {
      const {formStore, name} = this.props.validation;
      formStore.fieldBlured(name);
    }
    this.props.onBlur && this.props.onBlur(e);
  };

  renderTextField() {
    const {
      placeholderText,
      label,
      value,
      password,

      // Validation management properties
      validation,

      ...otherProps
    } = this.props;

    let styleTextfield = styles.textfield;

    const {formStore, name} = this.props.validation;
    if (formStore.form.fields[name].error) {
      styleTextfield = {...styles.textfield, ...textfieldError};
    }

    return (
      <View style={{alignSelf: 'stretch'}}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          {...otherProps}
          style={styleTextfield}
          //placeholderTextColor={{}}
          placeholder={placeholderText}
          onChangeText={this.onChangeText}
          onBlur={this.onBlur}
          secureTextEntry={this.state.showPassword}
          value={
            validation
              ? validation.formStore.form.fields[
                  validation.name
                ].value.toString()
              : value
          }
        />
        {this.toggleValueBtn}
      </View>
    );
  }

  renderPlaceholderForNotEditableField = editable => {
    if (editable == false) {
      return <Text>{this.props.placeholderText || ''}</Text>;
    }
  };

  render() {
    const {
      placeholderText,
      value,
      password,

      // Validation management properties
      validation,

      ...otherProps
    } = this.props;

    if (this.placeFieldActionComponent) {
      return (
        <View style={{...this.props.viewStyle}}>
          <View>
            <View>{this.renderTextField()}</View>
            <View>{this.placeFieldActionComponent}</View>
          </View>
          {this.fieldValidation}
        </View>
      );
    } else {
      return (
        <View style={{...this.props.viewStyle}}>
          {this.renderTextField()}
          {this.fieldValidation}
        </View>
      );
    }
  }
}

// Set default props
TextInputField.defaultProps = {
  password: false,
};

const styles = StyleSheet.create({
  textfield: {
    height: 48,
    alignSelf: 'stretch',
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.grey4,
    paddingHorizontal: 12,
    ...layout.marginTopS,
  },
  textfieldRegular: {
    borderColor: colors.grey4,
  },
  textfieldFocus: {
    borderColor: colors.mainBlue,
  },
  textfieldError: {
    borderColor: colors.error,
  },

  label: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.slate,
  },
});

export default observer(TextInputField);
