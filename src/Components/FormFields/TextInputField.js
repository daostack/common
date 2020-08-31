import React from 'react';
import {TextInput, View, Text, StyleSheet} from 'react-native';
import ValidationMessage from './ValidationMessage';
import {observer} from 'mobx-react';
import {layout, colors, font} from '~/Theme';
import {string, func, bool, number, object} from 'prop-types';

const CharCount = ({currCount, maxLength}) => <Text style = {{color: currCount === maxLength ? colors.error : colors.grey3, paddingTop: 5}}>{currCount}/{maxLength}</Text>;

const Label = ({label, infoLabel}) => (
  <View style={{flexDirection: 'row', marginBottom: 8}}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.infoLabel}>{infoLabel}</Text>
  </View>);

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

  validate = ({validation, value}) => {
    const {name, formStore, validateRule,
      multiName, invisibleContainer = true,
      displayName, customErrorMessage} = validation;

    formStore.registerFormField(name, validateRule, value, multiName);
    this.fieldValidation = (
      <ValidationMessage
        displayName={displayName}
        customErrorMessage={customErrorMessage}
        formStore={formStore}
        name={name}
        invisibleContainer={invisibleContainer} />
    );
  }

  onChangeText = (text) => {
    const {formStore, name} = this.props.validation;
    this.setState({charsLeft: text.length});
    formStore.fieldChanged(name, text);
    this.props.onChangeText && this.props.onChangeText(text);
  };

  onFocus = (e) => {this.setState({onFocus: true});};

  onBlur = (e) => {
    const {formStore, name} = this.props.validation;
    this.setState({onFocus: false});
    formStore.fieldBlured(name);
    this.props.onBlur && this.props.onBlur(e);
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
      ...otherProps
    } = this.props;

    const {formStore, name} = validation;
    let styleTextfield = styles.textfieldContainer;
    let defaultMultilineProps = {minHeight: 48};

    styleTextfield = formStore.form.fields[name].error
      ? {...styles.textfieldContainer, ...{borderColor: colors.error}}
      : {...styles.textfieldContainer, ...{borderColor: this.state.onFocus ? colors.mainBlue : colors.grey4}};

    if (multiline) {
      const rowsNumber = numberOfLines || 4;
      const height = 32 * rowsNumber;
      styleTextfield = {...styleTextfield, textAlignVertical: 'top'};

      defaultMultilineProps = {
        minHeight: height,
        maxHeight: height,
      };
    }

    return (
      <View style={{alignSelf: 'stretch', paddingBottom: 5}}>
        {(label || infoLabel) && <Label {...{label, infoLabel}} />}
        <View style = {styleTextfield} >
          <TextInput
            ref={this.props.forwardRef}
            {...defaultMultilineProps}
            {...otherProps}
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
            value={
              validation
                ? validation.formStore.form.fields[
                  validation.name].value.toString()
                : value}/>
          {maxLength && <CharCount currCount={this.state.charsLeft} maxLength={maxLength} />}
        </View>
      </View>
    );
  }

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
  validation: object.isRequired,
  value: string,
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
};

const styles = StyleSheet.create({
  textfield: {
    flex: 1,
    alignSelf: 'stretch',
    color: colors.black,
    margin: 0,
    ...font.primary.regular,
    ...font.fontSize(2),
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
  textfieldContainer:
  {
    borderWidth: 1,
    borderRadius: 3,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
  },
  toggleViewStyle:
  {
    position: 'absolute',
    top: 28,
    right: 12,
    ...layout.content,
    padding: 0,
  },
});

export default observer(TextInputField);
