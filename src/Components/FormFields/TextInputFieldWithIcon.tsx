import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import ValidationMessage from './ValidationMessage';
import {observer} from 'mobx-react';
import Icon, {IconNames} from '~/Assets/iconfont/Icon';
import {layout, colors, font, text, sizeS, sizeL} from '~/Theme';
import {formatNumber, unFormatNumber} from '~/Util/FormatUtil';
import {convertAmountToIls, isIsraelLocale} from '~/Util/locale';
import {FormStoreValidation} from '~/Stores/FormStores';
import {useStore} from '~/Stores';

const TextInputFieldWithIcon: React.FC<{
  validation: FormStoreValidation;
  value: string | number;

  fieldActionComponent: object;
  onTogglePress(): void;
  toggleName: string;
  onChangeText(text: string): void;
  onBlur(): void;
  placeholderText: string;
  label: React.ReactNode;
  infoLabel: string;
  infoMessage: string;
  password: boolean;
  multiline: boolean;
  numberOfLines: number;
  iconName: IconNames;
  iconEndName: IconNames;
  iconSize: number;
  iconEmptyColor: string;
  iconFillColor: string;
  iconStyle: object;
  subLabel: string;
  forwardRef: React.RefObject<TextInput>;
  viewStyle: ViewStyle;
  maxLength: number;
  disabledLabelStyle: TextStyle;
  disabledBackgroundStyle: ViewStyle;
}> = ({
  fieldActionComponent,
  onTogglePress,
  toggleName,
  placeholderText,
  label,
  infoLabel,
  infoMessage,
  password,
  multiline,
  numberOfLines,
  iconName,
  iconSize,
  iconEmptyColor,
  iconFillColor,
  iconStyle,
  iconEndName,
  // Validation management properties
  validation,
  subLabel,
  maxLength,
  disabledLabelStyle,
  disabledBackgroundStyle,
  viewStyle,
  ...otherProps
}) => {
  const {uiStore} = useStore();
  const [focused, setFocused] = React.useState<boolean>(false);
  const [dynamicWidth, setDynamicWidth] = React.useState<number>(50);
  const [prevTextLength, setPrevTextLength] = React.useState<number>(0);
  const [isDecimal, setIsDecimal] = React.useState<boolean>(false);

  const fieldValidation = React.useMemo(() => {
    if (validation) {
      const {name, formStore, validateRule} = validation;
      formStore.registerFormField(name, validateRule, otherProps.value);
      return <ValidationMessage {...validation} />;
    }
    return null;
  }, [validation]);

  const placeFieldActionComponent = fieldActionComponent;

  const onChangeText = (currText: string) => {
    const unformattedText = unFormatNumber(currText);
    const dotIndex = unformattedText.indexOf('.');

    // Dot contains regExp
    const regex = new RegExp(/\./g);
    let match;
    let matches = [];
    while ((match = regex.exec(unformattedText)) !== null) {
      matches.push(match[0]);
    }

    // Checking for multiple dots. Checking for no more than 2 numbers after the dot
    if (
      matches.length < 2 &&
      ((dotIndex > 0 && unformattedText.length <= dotIndex + 3) || dotIndex < 0)
    ) {
      if (validation) {
        const {formStore, name, multiName} = validation;
        formStore.fieldChanged(name, unformattedText, false, multiName);
      }
      otherProps.onChangeText && otherProps.onChangeText(unformattedText);
      // only update size when text length is increasing
      if (
        prevTextLength < unformattedText.length &&
        unformattedText.length > 3
      ) {
        updateSize(10);
      } else {
        setPrevTextLength(unformattedText.length);
      }
    }
  };

  const onFocus = React.useCallback(() => setFocused(true), []);

  const onBlur = React.useCallback(() => {
    setFocused(false);
    otherProps.onBlur && otherProps.onBlur();
  }, []);

  const updateSize = React.useCallback((value) => {
    const width = dynamicWidth + value;
    const newLength = prevTextLength + (value > 0 ? 1 : -1);
    setDynamicWidth(
      width > 50 ? width : 50, // don't decrease width below the initial 50 width
    );
    setPrevTextLength(newLength);
  }, []);

  const textFieldContainerStyle = React.useMemo(() => {
    const _textFieldContainerStyle: TextStyle = {
      ...styles.textfieldContainer,
      ...(validation &&
      validation.formStore.getFormField(validation.name, validation.multiName)
        ?.error
        ? {...styles.textfieldContainer, ...{borderColor: colors.error}}
        : {
            ...styles.textfieldContainer,
            ...{borderColor: focused ? colors.mainBlue : colors.grey4},
          }),
    };

    if (toggleName) {
      _textFieldContainerStyle.height = 100;
      _textFieldContainerStyle.position = 'relative';
    }
    if (multiline) {
      _textFieldContainerStyle.textAlignVertical = 'top';
      const rowsNumber = numberOfLines || 4;
      const height = 32 * rowsNumber;
      _textFieldContainerStyle.minHeight = height;
      _textFieldContainerStyle.maxHeight = height;
    }
    return _textFieldContainerStyle;
  }, [validation, multiline]);

  const fieldStyle: ViewStyle = React.useMemo(() => {
    if (toggleName) {
      return {
        width: dynamicWidth,
      };
    } else {
      return {flex: 1};
    }
  }, [toggleName]);

  const getValue = React.useCallback(() => {
    if (validation) {
      let currValue = validation.formStore.getFormField(
        validation.name,
        validation.multiName,
      )?.value;
      currValue =
        typeof currValue === 'object'
          ? currValue?.value?.toString()
          : currValue?.toString();

      currValue = currValue.replace(',', '');
      // if number, fix it to price format x,xxx (for currValue > 999)
      return +currValue ? formatNumber(currValue) : currValue;
    }
    return otherProps.value;
  }, []);

  const getConversionValue = React.useCallback(() => {
    let currValue = Number(
      validation?.formStore.getFormField(validation.name, validation.multiName)
        ?.value,
    );

    if (currValue > 0) {
      return uiStore.convertAmountToIls(currValue);
    }
  }, []);
  const toggleValueBtn = React.useMemo(() => {
    if (onTogglePress) {
      let toggleViewStyle: ViewStyle = {
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
      return (
        <View style={toggleViewStyle}>
          <View />
          <Text style={text.textFieldplaceholder}>{toggleName}</Text>
          <TouchableOpacity onPress={onTogglePress}>
            <Icon name="close" size={9} />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }, [onTogglePress]);

  const renderTextField = () => (
    <View style={{alignSelf: 'stretch'}}>
      <View style={{flexDirection: 'row'}}>
        <Text style={{...styles.label, ...disabledLabelStyle}}>{label}</Text>
        <Text style={styles.infoLabel}>{infoLabel}</Text>
      </View>
      {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
      <View style={{...textFieldContainerStyle, ...disabledBackgroundStyle}}>
        <View style={iconStyle}>
          <Icon
            name={iconName}
            size={iconSize}
            color={getValue() === '' ? iconEmptyColor : iconFillColor}
          />
        </View>
        <TextInput
          ref={otherProps.forwardRef}
          {...otherProps}
          maxLength={isDecimal ? maxLength + 3 : maxLength}
          multiline={multiline}
          style={{...fieldStyle, ...disabledLabelStyle}}
          placeholder={placeholderText}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyPress={({nativeEvent}) => {
            if (nativeEvent.key === 'Backspace') {
              updateSize(-10);
            }
            if (nativeEvent.key === 'Backspace' && isDecimal) {
              const inputValue = getValue();
              setIsDecimal(inputValue[inputValue.length - 1] !== '.');
            }
            if (nativeEvent.key === '.' || nativeEvent.key === ',') {
              setIsDecimal(true);
              onChangeText(`${getValue()}.`);
            }
          }}
          value={getValue()}
        />
        {toggleValueBtn}

        {toggleName && isIsraelLocale && (
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

  if (placeFieldActionComponent) {
    return (
      <View style={{...viewStyle}}>
        <View>
          <View>{renderTextField()}</View>
          <View>{placeFieldActionComponent}</View>
        </View>
        {fieldValidation}
        {infoMessage && <Text style={styles.infoMessage}>{infoMessage}</Text>}
      </View>
    );
  } else {
    return (
      <View style={{...viewStyle}}>
        {renderTextField()}
        {fieldValidation}
        {infoMessage && <Text style={styles.infoMessage}>{infoMessage}</Text>}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  textfieldContainer: {
    minHeight: 48,
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

export default observer(TextInputFieldWithIcon);
