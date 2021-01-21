import React from 'react';
import {TextInput, View, Text, StyleSheet, Platform} from 'react-native';
import ValidationMessage from './ValidationMessage';
import {observer} from 'mobx-react';
import {layout, colors, font} from '~/Theme';
import {string, func, bool, number, object, oneOfType} from 'prop-types';

const CharCount = ({currCount, maxLength}) => (
  <Text
    style={{
      color: currCount === maxLength ? colors.greyText : colors.grey3,
      paddingTop: 5,
    }}>
    {currCount}/{maxLength}
  </Text>
);

export const Label = ({label, infoLabel}) => (
  <View style={{flexDirection: 'row', marginBottom: 8}}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.infoLabel}>{infoLabel}</Text>
  </View>
);

class TextInputField extends React.Component {
  fieldValidation;

  constructor(props) {
    super(props);

    this.state = {
      onFocus: false,
      charsLeft: 0,
    };

    this.validate(this.props);
  }

  componentWillUnmount = () => {
    if (this.props.validation) {
      const {formStore, name, multiName} = this.props.validation;
      formStore.removeFormField(name, multiName);
    }
  };

  validate = ({validation, value}) => {
    const {
      name,
      formStore,
      validateRule,
      multiName,
      invisibleContainer = true,
      displayName,
      customErrorMessage,
      immediateValidation,
    } = validation;

    formStore.registerFormField(
      name,
      validateRule,
      value,
      multiName,
      immediateValidation,
    );
    this.fieldValidation = (
      <ValidationMessage
        displayName={displayName}
        customErrorMessage={customErrorMessage}
        formStore={formStore}
        name={name}
        multiName={multiName}
        invisibleContainer={invisibleContainer}
      />
    );
  };

  onChangeText = (text) => {
    const currText = this.props.format ? this.props.format(text) : text;
    const {formStore, name, multiName} = this.props.validation;
    this.setState({charsLeft: currText.length});
    formStore.fieldChanged(name, currText, false, multiName);
    this.props.onChangeText && this.props.onChangeText(currText);
  };

  onFocus = (e) => {
    this.setState({onFocus: true});
  };

  onBlur = (e) => {
    const {formStore, name, multiName} = this.props.validation;
    this.setState({onFocus: false});
    formStore.fieldBlured(name, multiName);
    this.props.onBlur && this.props.onBlur(e);
    this.props.onSubmit && this.props.onSubmit();
  };

  renderTextField = () => {
    const {
      placeholderText,
      label,
      infoLabel,
      value,
      password,
      multiline,
      numberOfLines,
      keyboardType,
      validation,
      maxLength,
      autofill,
      ...otherProps
    } = this.props;
    console.log('autofill', autofill);
    const {formStore, name, multiName} = validation;
    let styleTextfield = styles.textfieldContainer;
    let defaultMultilineProps = {minHeight: 48};
    const autoComplete = Platform.OS === 'ios' ? {'textContentType': autofill} : {'autoCompleteType': autofill};
    console.log('autoComplete', autoComplete);

    styleTextfield = formStore.getFormField(name, multiName).error
      ? {...styles.textfieldContainer, ...{borderColor: colors.error}}
      : {
          ...styles.textfieldContainer,
          ...{borderColor: this.state.onFocus ? colors.mainBlue : colors.grey4},
        };

    if (multiline) {
      const rowsNumber = numberOfLines || 4;
      const height = 32 * rowsNumber;
      styleTextfield = {...styleTextfield, textAlignVertical: 'top'};

      defaultMultilineProps = {
        minHeight: height,
        maxHeight: height,
      };
    }

    const getValue = () =>
      validation
        ? validation.formStore
            .getFormField(validation.name, validation.multiName)
            .value.toString()
        : value;

    return (
      <View style={{alignSelf: 'stretch', paddingBottom: 5}}>
        {(label || infoLabel) && <Label {...{label, infoLabel}} />}
        <View style={styleTextfield}>
          <TextInput
            ref={this.props.forwardRef}
            {...defaultMultilineProps}
            {...otherProps}
            {...autoComplete}
            maxLength={maxLength}
            multiline={multiline}
            style={styles.textfield}
            placeholder={placeholderText}
            placeholderTextColor={colors.grey3}
            onChangeText={this.onChangeText}
            keyboardType={keyboardType}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            secureTextEntry={this.state.showPassword}
            value={getValue()}
          />
          {maxLength && (
            <CharCount currCount={this.state.charsLeft} maxLength={maxLength} />
          )}
        </View>
      </View>
    );
  };

  render() {
    const {viewStyle, validation} = this.props;
    return (
      <View style={{...layout.marginTopS, ...viewStyle}}>
        {validation.topPosition && this.fieldValidation}
        {this.renderTextField()}
        {!validation.topPosition && this.fieldValidation}
      </View>
    );
  }
}

CharCount.propTypes = {
  currCount: number,
  maxLength: number,
};

Label.propTypes = {
  label: string,
  infoLabel: string,
};

TextInputField.propTypes = {
  //textContentType: string,
  validation: object.isRequired,
  value: oneOfType([string, number]),
  onChangeText: func,
  onBlur: func,
  placeholderText: string,
  label: string,
  infoLabel: string,
  password: string,
  multiline: bool,
  numberOfLines: number,
  keyboardType: string,
  maxLength: number,
  viewStyle: object,
  forwardRef: object,
  onSubmit: func,
  format: func,
  autofill: string,
};

const styles = StyleSheet.create({
  textfield: {
    flex: 1,
    alignSelf: 'stretch',
    color: colors.black,
    margin: 0,
    ...font.primary.regular,
    ...font.fontSize(2),
    textAlignVertical: 'top',
  },
  label: {
    ...font.primary.regular,
    ...font.fontSize(2),
    lineHeight: font.lineHeightForm,
    letterSpacing: 0,
    color: colors.slate,
    alignSelf: 'flex-start',
  },
  infoLabel: {
    marginBottom: 0,
    lineHeight: font.lineHeightForm,
    ...font.primary.italic,
    ...font.fontSize(2),
    color: colors.paleblue,
    textAlign: 'right',
    flex: 1,
  },
  textfieldContainer: {
    borderWidth: 1,
    borderRadius: 3,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default observer(TextInputField);
