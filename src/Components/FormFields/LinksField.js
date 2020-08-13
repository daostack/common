import React from 'react';
import {TextInput, View, Text, StyleSheet} from 'react-native';
import ValidationMessage from './ValidationMessage';
import {observer} from 'mobx-react';
import {colors, layout, font} from '../../Theme';

class LinksField extends React.Component {
  fieldValidation;
  toggleValueBtn;
  placeFieldActionComponent;

  static defaultProps;

  constructor(props) {
    super(props);

    this.state = {
      onFocus: false,
    };

    const {validation, value, fieldActionComponent} = this.props;
    // Register form field for validation message component if name,formStore and validateRule props are provided
    if (validation) {
      const {name, formStore, validateRule, displayName, customErrorMessage} = validation;
      formStore.registerFormField(name, validateRule, value);
      this.fieldValidation = (
        <ValidationMessage customErrorMessage={customErrorMessage} displayName={displayName} formStore={formStore} name={name} />
      );
    }

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

      // Validation management properties
      validation,

      ...otherProps
    } = this.props;

    let styleTextfield = styles.textfield;

    const {formStore, name} = this.props.validation;
    if (formStore.form.fields[name].error) {
      styleTextfield = {...styles.textfield, ...styles.textfieldError};
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

    return (
      <View style={{alignSelf: 'stretch'}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.infoLabel}>{infoLabel}</Text>
        </View>
        <TextInput
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
        {this.toggleValueBtn}
      </View>
    );
  }

  renderPlaceholderForNotEditableField = editable => {
    if (editable === false) {
      return <Text>{this.props.placeholderText || ''}</Text>;
    }
  };

  render() {
    const {viewStyle} = this.props;

    if (this.placeFieldActionComponent) {
      return (
        <View style={{...viewStyle}}>
          <View>
            <View>{this.renderTextField()}</View>
            <View>{this.placeFieldActionComponent}</View>
          </View>
          {this.fieldValidation}
        </View>
      );
    } else {
      return (
        <View style={{...viewStyle}}>
          {this.renderTextField()}
          {this.fieldValidation}
        </View>
      );
    }
  }
}

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
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.slate,
    alignSelf: 'flex-start',
  },
  infoLabel: {
    ...font.primary.italic,
    ...font.fontSize(2),
    color: colors.paleblue,
    textAlign: 'right',
    flex: 1,
  },
});

export default observer(LinksField);
