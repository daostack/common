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
import Icon from '~/Assets/iconfont/Icon';
import {layout, colors, font, text, sizeS, sizeL} from '~/Theme';
import {string, func, bool, shape, oneOfType, object, number} from 'prop-types';

class TextInputFieldWithIcon extends React.Component {
  fieldValidation;
  toggleValueBtn;
  placeFieldActionComponent;

  static defaultProps;

  constructor(props) {
    super(props);

    this.state = {
      onFocus: false,
      dynamicWidth: 30,
    };

    const {
      validation,
      value,
      fieldActionComponent,
      onTogglePress,
      toggleName,
    } = this.props;

    // Register form field for validation message component if name,formStore and validateRule props are provided
    if (validation) {
      const {name, formStore, displayName, validateRule, invisibleContainer = true, customErrorMessage} = validation;
      formStore.registerFormField(name, validateRule, value);
      this.fieldValidation = (
        <ValidationMessage displayName={displayName} formStore={formStore} customErrorMessage={customErrorMessage} name={name} invisibleContainer={invisibleContainer}/>
      );
    }

    if (fieldActionComponent) {
      this.placeFieldActionComponent = fieldActionComponent;
    }
    if (onTogglePress) {
      let toggleViewStyle = {
        position: 'absolute',
        top: 7,
        left: 15,
        right: 15,
        ...layout.content,
        padding: 0,
      };

      if (!toggleName) {
        toggleViewStyle = {...toggleViewStyle, ...{bottom: 7}};
      } else {
        toggleViewStyle = {
          ...toggleViewStyle,
          ...{
            ...layout.content,
            ...layout.flexRow,
            alignSelf: 'stretch',
            padding: 0,
            justifyContent: 'space-between',
          },
        };
      }

      this.toggleValueBtn = (
        <View style={toggleViewStyle}>
          <View />
          <Text style={text.textFieldplaceholder}>{toggleName}</Text>
          <TouchableOpacity onPress={onTogglePress}>
            <Icon name="close" size={9} />
          </TouchableOpacity>
        </View>
      );
    }
  }

  onChangeText = (currText) => {
    if (this.props.validation) {
      const {formStore, name, multiName} = this.props.validation;
      formStore.fieldChanged(name, currText, false, multiName);
    }
    this.props.onChangeText && this.props.onChangeText(currText);
  };

  onFocus = (e) => {
    this.setState({onFocus: true});
  };

  onBlur = (e) => {
    this.setState({onFocus: false});
    if (this.props.validation) {
      const {formStore, name, multiName} = this.props.validation;
      formStore.fieldBlured(name, multiName);
    }
    this.props.onBlur && this.props.onBlur(e);
  };

  updateSize = (width) => {
    this.setState({dynamicWidth: width});
  };

  renderTextField() {
    const {
      placeholderText,
      label,
      infoLabel,
      infoMessage,
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
      iconEndName,

      // Validation management properties
      validation,
      subLabel,
      ...otherProps
    } = this.props;

    let styleTextfield = styles.textfield;

    const {formStore, name} = this.props.validation;
    if (formStore.getFormField(name).error) {
      styleTextfield = {...styles.textfield, ...styles.textfieldError};
    }
    if (this.state?.onFocus) {
      styleTextfield = {...styles.textfield, ...styles.textfieldFocus};
    }

    let fieldStyle = {};

    if (this.props.toggleName) {
      styleTextfield = {
        ...styleTextfield,
        ...{height: 100, position: 'relative'},
      };
      fieldStyle = {
        width: 20 + this.state.dynamicWidth,
      };
    } else {
      fieldStyle = {flex: 1};
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

    const getValue = () => {
      if (validation) {
        const currValue = validation.formStore.getFormField(validation.name, validation.multiName)?.value;
        return typeof (currValue) === 'object' ? currValue.value?.toString() : currValue?.toString();
      }
      return value;
    };

    return (
      <View style={{alignSelf: 'stretch'}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.infoLabel}>{infoLabel}</Text>
        </View>
        {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
        <View style={styleTextfield}>
          <View style={iconStyle}>
            <Icon
              name={iconName}
              size={iconSize}
              color={
                getValue() === ''
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
            style={fieldStyle}
            placeholder={placeholderText}
            onChangeText={this.onChangeText}
            keyboardType={keyboardType}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            secureTextEntry={this.state.showPassword}
            /* onContentSizeChange={e =>
              this.updateSize(e.nativeEvent.contentSize.width)
            } */
            value={getValue()}
          />
          {this.toggleValueBtn}

          {iconEndName && (
            <View style={iconStyle}>
              <Icon
                name={iconEndName}
                size={iconSize}
                color={
                  getValue() === ''
                    ? iconEmptyColor
                    : iconFillColor
                }
              />
            </View>
          )}
        </View>
      </View>
    );
  }

  renderPlaceholderForNotEditableField = (editable) => {
    if (editable === false) {
      return <Text>{this.props.placeholderText || ''}</Text>;
    }
  };

  render() {
    const {viewStyle, infoMessage} = this.props;

    if (this.placeFieldActionComponent) {
      return (
        <View style={{...viewStyle}}>
          <View>
            <View>{this.renderTextField()}</View>
            <View>{this.placeFieldActionComponent}</View>
          </View>
          {this.fieldValidation}
          {infoMessage && (
            <Text style={styles.infoMessage}>{infoMessage}</Text>)}
        </View>
      );
    } else {
      return (
        <View style={{...viewStyle}}>
          {this.renderTextField()}
          {this.fieldValidation}
          {infoMessage && (
            <Text style={styles.infoMessage}>{infoMessage}</Text>)}
        </View>
      );
    }
  }
}

// Set default props
TextInputFieldWithIcon.defaultProps = {
  password: false,
};

TextInputFieldWithIcon.propTypes = {
  validation: shape({
    name: string,
    formStore: object,
    displayName: string,
    validateRule: oneOfType([
      string,
      object,
    ]),
    invisibleContainer: bool,
    customErrorMessage: string,
  }),
  value: string,
  fieldActionComponent: object,
  onTogglePress: func,
  toggleName: string,
  onChangeText: func,
  onBlur: func,
  placeholderText: string,
  label: string,
  infoLabel: string,
  infoMessage: string,
  password: bool,
  multiline: bool,
  numberOfLines: number,
  keyboardType: string,
  iconName: string,
  iconEndName: string,
  iconSize: number,
  iconEmptyColor: string,
  iconFillColor: string,
  iconStyle: object,
  subLabel: string,
  forwardRef: object,
  viewStyle: object,
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
  subLabel: {
    marginVertical: sizeS,
    lineHeight: sizeL,
    ...font.primary.regular,
    color: colors.greySubtitle,
    ...font.fontSize(1),
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
    flex: 1,
  },
  infoLabel: {
    ...font.primary.italic,
    ...font.fontSize(2),
    letterSpacing: 0,
    color: colors.paleblue,
    textAlign: 'right',
  },
  infoMessage: {
    ...font.primary.italic,
    ...font.fontSize(2),
    marginTop: 3,
    letterSpacing: 0,
    color: colors.greySubtitle,
    flex: 1,
  },
});

export default observer(TextInputFieldWithIcon);
