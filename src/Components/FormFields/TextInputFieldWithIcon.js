import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ValidationMessage from './ValidationMessage';
import {observer} from 'mobx-react';
import Icon from '../../Assets/iconfont/Icon';
import {layout, colors} from '../../Theme';

class TextInputFieldWithIcon extends React.Component {
  fieldValidation;
  toggleValueBtn;
  placeFieldActionComponent;

  static defaultProps;

  constructor(props) {
    super(props);

    this.state = {
      onFocus: false,
    };

    const {validation, value, fieldActionComponent, onTogglePress} = this.props;
    // Register form field for validation message component if name,formStore and validateRule props are provided
    if (validation) {
      const {name, formStore, validateRule} = validation;
      formStore.registerFormField(name, validateRule, value);
      this.fieldValidation = (
        <ValidationMessage formStore={formStore} name={name} />
      );
    }

    if (fieldActionComponent) {
      this.placeFieldActionComponent = fieldActionComponent;
    }
    if (onTogglePress) {
      this.toggleValueBtn = (
        <View
          style={{
            position: 'absolute',
            top: 7,
            left: 15,
            right: 15,
            bottom: 7,
            ...layout.content,
            padding: 0,
            alignItems: 'flex-end',
          }}>
          <TouchableOpacity onPress={onTogglePress}>
            <Icon name="close" size={12} />
          </TouchableOpacity>
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

      // Icon props
      iconName,
      iconSize,
      iconEmptyColor,
      iconFillColor,
      iconStyle,

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

      const height = 20 * rowsNumber;

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
        <View style={styleTextfield}>
          <View style={iconStyle}>
            <Icon
              name={iconName}
              size={iconSize}
              color={
                validation.formStore.form.fields[
                  validation.name
                ].value.toString() === ''
                  ? iconEmptyColor
                  : iconFillColor
              }
            />
          </View>
          <TextInput
            ref={this.props.forwardRef}
            {...defaultMultilineProps}
            {...otherProps}
            multiline={multiline}
            style={{flex: 1}}
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

// Set default props
TextInputFieldWithIcon.defaultProps = {
  password: false,
};

const styles = StyleSheet.create({
  textfield: {
    //minHeight: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'stretch',
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

export default observer(TextInputFieldWithIcon);
