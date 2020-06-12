import React from 'react';
import {TextInput, View, Text, StyleSheet} from 'react-native';
import ValidationMessage from './ValidationMessage';
import {observer} from 'mobx-react';
import {layout, colors, text} from '../../Theme';

class TextInputField extends React.Component {
  fieldValidation;
  innerLabel;
  placeFieldActionComponent;

  static defaultProps;

  constructor(props) {
    super(props);

    this.state = {
      onFocus: false,
    };

    const {validation, value, fieldActionComponent, innerLabel} = this.props;
    // Register form field for validation message component if name,formStore and validateRule props are provided
    if (validation) {
      const {name, formStore, validateRule, multiName} = validation;
      formStore.registerFormField(name, validateRule, value, multiName);
      this.fieldValidation = (
        <ValidationMessage formStore={formStore} name={name} />
      );
    }

    if (fieldActionComponent) {
      this.placeFieldActionComponent = fieldActionComponent;
    }
    if (innerLabel) {
      let toggleViewStyle = {
        position: 'absolute',
        top: 28,
        right: 12,
        ...layout.content,
        padding: 0,
      };

      this.innerLabel = (
        <View style={toggleViewStyle}>
          <Text style={text.textFieldplaceholder}>{innerLabel}</Text>
        </View>
      );
    }
  }

  onChangeText = text => {
    if (this.props.validation) {
      const {formStore, name} = this.props.validation;
      formStore.fieldChanged(name, text);
    }
    this.props.onChangeText && this.props.onChangeText(text);
  };

  onFocus = e => {
    this.setState({onFocus: true});
  };

  onBlur = e => {
    this.setState({onFocus: false});
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
      infoLabel,
      value,
      password,
      multiline,
      numberOfLines,
      keyboardType,
      innerLabel,
      // Validation management properties
      validation,

      ...otherProps
    } = this.props;

    let styleTextfield = styles.textfield;

    if (validation) {
      const {formStore, name} = validation;
      if (formStore.form.fields[name].error) {
        styleTextfield = {...styles.textfield, ...styles.textfieldError};
      }
    }
    if (this.state?.onFocus) {
      styleTextfield = {...styles.textfield, ...styles.textfieldFocus};
    }

    let defaultMultilineProps = {minHeight: 48};

    if (multiline) {
      let rowsNumber = numberOfLines;
      if (!numberOfLines) {
        rowsNumber = 4;
      }

      const height = 24 * rowsNumber;

      defaultMultilineProps = {
        minHeight: height,
        maxHeight: height,
      };
    }

    if (innerLabel) {
      styleTextfield = {...styleTextfield, paddingRight: 22};
    }

    return (
      <View style={{alignSelf: 'stretch'}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.infoLabel}>{infoLabel}</Text>
        </View>
        <TextInput
          ref={this.props.forwardRef}
          {...defaultMultilineProps}
          {...otherProps}
          multiline={multiline}
          style={styleTextfield}
          placeholder={placeholderText}
          onChangeText={this.onChangeText}
          keyboardType={keyboardType}
          onFocus={this.onFocus}
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
        {innerLabel && this.innerLabel}
      </View>
    );
  }

  renderPlaceholderForNotEditableField = editable => {
    if (editable === false) {
      return <Text>{this.props.placeholderText || ''}</Text>;
    }
  };

  render() {
    const {viewStyle, validation} = this.props;

    if (this.placeFieldActionComponent) {
      return (
        <View style={{...layout.marginTopS, ...viewStyle}}>
          {validation.topPosition ? this.fieldValidation : null}
          <View>
            <View>{this.renderTextField()}</View>
            <View>{this.placeFieldActionComponent}</View>
          </View>
          {validation.topPosition ? null : this.fieldValidation}
        </View>
      );
    } else {
      return (
        <View style={{...layout.marginTopS, ...viewStyle}}>
          {validation.topPosition ? this.fieldValidation : null}
          {this.renderTextField()}
          {validation.topPosition ? null : this.fieldValidation}
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
    //minHeight: 48,
    alignSelf: 'stretch',
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.grey4,
    paddingHorizontal: 12,
    margin: 0,
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
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.slate,
    alignSelf: 'flex-start',
  },
  infoLabel: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'italic',
    letterSpacing: 0,
    color: colors.paleblue,
    textAlign: 'right',
    flex: 1,
  },
});

export default observer(TextInputField);
