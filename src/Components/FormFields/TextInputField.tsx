import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextStyle,
  KeyboardTypeOptions,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import ValidationMessage from './ValidationMessage';
import {layout, colors, font} from '~/Theme';
import {FormStoreValidation} from '~/Stores/FormStores';

const CharCount: React.FC<{
  currCount: number;
  maxLength: number;
}> = ({currCount, maxLength}) => (
  <Text
    style={{
      color: currCount === maxLength ? colors.greyText : colors.grey3,
      paddingTop: 5,
    }}>
    {currCount}/{maxLength}
  </Text>
);

export const Label: React.FC<{title: string; infoText?: string}> = ({
  title,
  infoText,
}) => (
  <View style={{flexDirection: 'row', marginBottom: 8}}>
    <Text style={styles.label}>{title}</Text>
    <Text style={styles.infoLabel}>{infoText}</Text>
  </View>
);

interface Props {
  validation: FormStoreValidation;
  value: string | number;
  onChangeText(text: string): void;
  onBlur?(): void;
  placeholderText: string;
  label: string;
  infoLabel?: string;
  showPassword?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  viewStyle?: ViewStyle;
  forwardRef?: React.RefObject<TextInput>;
  onSubmit?(): void;
  format?(text: string): string;
}

function validate(validation: FormStoreValidation, value: string | number) {
  const {
    name,
    formStore,
    validateRule,
    multiName,
    immediateValidation,
  } = validation;

  formStore.registerFormField(
    name,
    validateRule,
    value,
    multiName,
    immediateValidation,
  );
}

const TextInputField: React.FC<Props & TextInputProps> = ({
  validation,
  placeholderText,
  label,
  infoLabel,
  showPassword = false,
  multiline = false,
  numberOfLines = 0,
  keyboardType = 'default',
  maxLength = 0,
  style,
  viewStyle,
  ...props
}) => {
  const [focused, setFocused] = React.useState<boolean>(false);
  const [charsLeft, setCharsLeft] = React.useState<number>(0);

  const fieldValidation = React.useMemo(() => {
    if (validation) {
      return <ValidationMessage {...validation} />;
    }
    return null;
  }, [validation]);

  React.useEffect(() => {
    if (validation && value) {
      validate(validation, value);
      return () => {
        const {name, multiName} = validation;
        validation.formStore.removeFormField(name, parseInt(multiName));
      };
    }
  }, [validation, props.value]);

  const onChangeText = React.useCallback((text: string) => {
    const currText = props.format ? props.format(text) : text;
    setCharsLeft(currText.length);
    if (validation) {
      const {formStore, name, multiName} = validation;
      formStore.fieldChanged(name, currText, false, multiName);
    }
    props.onChangeText && props.onChangeText(currText);
  }, []);

  const onFocus = React.useCallback(() => {
    setFocused(true);
  }, []);

  const onBlur = React.useCallback(() => {
    setFocused(false);
    props.onBlur && props.onBlur();
    props.onSubmit && props.onSubmit();
  }, []);

  const textFieldContainerStyle = React.useMemo(() => {
    const _textFieldContainerStyle: TextStyle = {
      minHeight: 48,
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

    if (multiline) {
      _textFieldContainerStyle.textAlignVertical = 'top';
      const rowsNumber = numberOfLines || 4;
      const height = 32 * rowsNumber;
      _textFieldContainerStyle.minHeight = height;
      _textFieldContainerStyle.maxHeight = height;
    }
    return _textFieldContainerStyle;
  }, [validation, multiline]);

  const value = React.useMemo(
    () =>
      (validation &&
        validation.formStore
          .getFormField(validation.name, validation.multiName)
          ?.value?.toString()) ||
      props.value,
    [validation, props.value],
  );

  const renderTextField = () => (
    <View style={{alignSelf: 'stretch', paddingBottom: 5}}>
      {(label || infoLabel) && <Label title={label} infoText={infoLabel} />}
      <View style={textFieldContainerStyle}>
        <TextInput
          ref={props.forwardRef}
          {...props}
          maxLength={maxLength}
          multiline={multiline}
          style={{...styles.textfield, ...(style as TextStyle)}}
          placeholder={placeholderText}
          placeholderTextColor={colors.grey3}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry={showPassword}
          value={value}
        />
        {maxLength && <CharCount currCount={charsLeft} maxLength={maxLength} />}
      </View>
    </View>
  );

  return (
    <View style={{...layout.marginTopS, ...viewStyle}}>
      {validation?.topPosition && fieldValidation}
      {renderTextField()}
      {!validation?.topPosition && fieldValidation}
    </View>
  );
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
  } as TextStyle,
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

export default TextInputField;
