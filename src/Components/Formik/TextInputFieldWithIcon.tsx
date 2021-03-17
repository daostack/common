import React, {ReactElement, ReactNode, useMemo, useState} from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import ValidationMessage from './ValidationMessage';
import {inject, observer} from 'mobx-react';
import Icon, {IconNames} from '~/Assets/iconfont/Icon';
import {layout, colors, font, text, sizeS, sizeL} from '~/Theme';
import {formatNumber, unFormatNumber} from '~/Util/FormatUtil';
import {convertAmountToIls, isIsraelLocale} from '~/Util/locale';
import {UiStore} from '~/Types/store';

export type TextInputFieldWithIconProps = {
  fieldActionComponent?: ReactNode;
  viewStyle?: ViewStyle;
  infoMessage?: string;
  name: string;
  invisibleContainer?: boolean;
  displayName: string;
  errorMessage?: string;
}

export type TextFieldProps = {
  value: string | {
    value: string;
    label: string;
  };
  onChangeText?:  (value: string) => void;
  onBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  placeholderText?: string;
  label: string | ReactNode;
  infoLabel: string;
  password?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  forwardRef?: React.RefObject<TextInput>;
  onSubmit?: () => void;
  format?: (value: string) => string;
  autofill?: any;
  isTopPosition?: boolean;
  error?: string;
  multiName?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  onTogglePress?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  toggleName?: string;
  iconName?: IconNames;
  iconEndName?: string;
  iconSize?: number;
  iconEmptyColor?: string;
  iconFillColor?: string;
  iconStyle?: ViewStyle;
  subLabel?: string;
  uiStore: UiStore;
  textContentType: string;
  isFocused: boolean;
  dynamicWidth: number;
}

function TextField({onTogglePress, toggleName, error, multiline,
  placeholderText,
  label,
  infoLabel,
  value,
  numberOfLines,
  keyboardType,
  uiStore,
  // Icon props
  iconName,
  iconSize,
  iconEmptyColor,
  iconFillColor,
  iconStyle,
  iconEndName,
  // Validation management properties
  subLabel,
  textContentType,
  ...otherProps}: TextFieldProps): ReactElement {
  const [state, setState] = useState({
    isFocused: false,
    dynamicWidth: 50,
    prevTextLength: 0,
    showPassword: false,
  });

  const toggleViewStyle: ViewStyle = useMemo(() => {
    let toggleStyle: ViewStyle = {};
    if (onTogglePress) {
      toggleStyle = {
        position: 'absolute',
        top: 7,
        left: 15,
        right: 15,
        ...layout.content,
        padding: 0,
      };

      if (!toggleName) {
        toggleStyle = {...toggleStyle, ...{bottom: 7}};
      } else {
        toggleStyle = {
          ...toggleStyle,
          ...{
            ...layout.content,
            ...layout.flexRow,
            alignSelf: 'stretch',
            padding: 0,
            justifyContent: 'space-between',
          },
        };
      }
    }
    return toggleStyle;
  },[onTogglePress, toggleName]);

  const styleTextfield = useMemo(() => {
    let textFieldStyle = {};
    if (error) {
      textFieldStyle = {...styles.textfield, ...styles.textfieldError};
    }
    if (state.isFocused) {
      textFieldStyle = {...styles.textfield, ...styles.textfieldFocus};
    }

    if (toggleName) {
      textFieldStyle = {
        ...textFieldStyle,
        ...{height: 100, position: 'relative'},
      };
    }

    return textFieldStyle;
  },[error, state.isFocused, toggleName]);

  const fieldStyle = useMemo(() => {
    let style: ViewStyle = {};
    if (toggleName) {
      style = {
        width: state.dynamicWidth,
      };
    } else {
      style = {flex: 1};
    }

    return style;
  },[toggleName, state.dynamicWidth]);

  const defaultMultilineProps = useMemo(() => {
    let multilineProps: ViewStyle = {minHeight: 48};
  if (multiline) {
    let rowsNumber = numberOfLines || 4;

    const height = 20 * rowsNumber;
    multilineProps = {
      minHeight: height,
      maxHeight: height,
    };
  }

  return multilineProps;
  },[multiline]);

  const getValue = () => {
      let currValue = value;
      currValue =
        typeof currValue === 'object'
          ? currValue?.value?.toString()
          : currValue?.toString();

      currValue = currValue.replace(',', '');
      return +currValue ? formatNumber(currValue) : currValue;
  };

    function onChangeText(currText: any) {
    const unformattedText = unFormatNumber(currText);
    // if (this.props.validation) {
    //   const {formStore, name, multiName} = this.props.validation;
    //   formStore.fieldChanged(name, unformattedText, false, multiName);
    // }
    otherProps.onChangeText && otherProps.onChangeText(unformattedText);
    // only update size when text length is increasing
    if (
      state.prevTextLength < unformattedText.length &&
      unformattedText.length > 3
    ) {
      updateSize(10);
    } else {
      setState({...state,prevTextLength: unformattedText.length});
    }
  }

  function onFocus(): void {
    setState({...state,isFocused: true});
  }

  function onBlur(e: NativeSyntheticEvent<TextInputFocusEventData>): void {
    setState({...state,isFocused: false});
    otherProps.onBlur && otherProps.onBlur(e);
  }

  function updateSize(sizeValue: number): void {
    const width = state.dynamicWidth + sizeValue;
    const newLength = state.prevTextLength + (sizeValue > 0 ? 1 : -1);
    setState({
      ...state,
      dynamicWidth: width > 50 ? width : 50, // don't decrease width below the initial 50 width
      prevTextLength: newLength,
    });
  }

  const getConversionValue = () => {
    if (Number(value) > 0) {
      return convertAmountToIls(value, uiStore.conversionRate);
    }
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
            color={getValue() === '' ? iconEmptyColor : iconFillColor}
          />
        </View>
        <TextInput
          ref={otherProps.forwardRef}
          {...defaultMultilineProps}
          {...otherProps}
          multiline={multiline}
          textContentType={textContentType}
          style={fieldStyle}
          placeholder={placeholderText}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry={state.showPassword}
          onKeyPress={({nativeEvent}) => {
            if (nativeEvent.key === 'Backspace') {
              updateSize(-10);
            }
          }}
          value={getValue()}
        />
      {otherProps.onTogglePress &&  <View style={toggleViewStyle}>
          <View />
          <Text style={text.textFieldplaceholder}>{toggleName}</Text>
          <TouchableOpacity onPress={otherProps.onTogglePress}>
            <Icon name="close" size={9} />
          </TouchableOpacity>
        </View>}

        {toggleName && isIsraelLocale && unFormatNumber(getValue()) > 0 && (
          <View style={styles.conversionRateStyle}>
            <Text style={styles.rightText}>
              {convertAmountToIls(
                unFormatNumber(getValue()),
                uiStore.conversionRate,
              )}
            </Text>
          </View>
        )}

        {iconEndName && (
          <View style={iconStyle}>
            <Icon
              name={iconEndName}
              size={iconSize}
              color={getValue() === '' ? iconEmptyColor : iconFillColor}
            />
          </View>
        )}

        {iconName === 'dollar' && isIsraelLocale && (
          <Text style={styles.rightText}>{getConversionValue()}</Text>
        )}
      </View>
    </View>
  );
}

 function TextInputFieldWithIcon({fieldActionComponent, viewStyle, infoMessage, ...props}: TextInputFieldWithIconProps & TextFieldProps ): ReactElement {
      return (
        <View style={{...viewStyle}}>
          <View>
            <TextField {...props} />
            {fieldActionComponent && <View>{fieldActionComponent}</View>}
          </View>
          <ValidationMessage
            name={props.name}
            displayName={props.displayName}
            errorMessage={props.errorMessage}
            invisibleContainer={props.invisibleContainer}
          />
          {infoMessage && <Text style={styles.infoMessage}>{infoMessage}</Text>}
        </View>
      );
}

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
  conversionRateStyle: {
    position: 'absolute',
    bottom: 10,
    left: 15,
    right: 15,
    ...layout.content,
    padding: 0,
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
  rightText: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.grey2,
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

export default inject('uiStore')(observer(TextInputFieldWithIcon));

