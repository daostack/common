import React, {useState, useMemo, ReactElement} from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Platform,
  TextStyle,
  ViewStyle,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import ValidationMessage from './ValidationMessage';
import {observer} from 'mobx-react';
import {layout, colors, font} from '~/Theme';
import {Label} from './Label';

type CharCountProps = {
  currCount: number;
  maxLength: number;
};

const CharCount = ({currCount, maxLength}: CharCountProps): ReactElement => (
  <Text
    style={{
      color: currCount === maxLength ? colors.greyText : colors.grey3,
      paddingTop: 5,
    }}>
    {currCount}/{maxLength}
  </Text>
);

type Props = {
  value: string | undefined;
  onChangeText?: (value: string) => void;
  onBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  placeholderText?: string;
  label?: string;
  infoLabel?: string;
  password?: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  viewStyle?: ViewStyle;
  forwardRef?: React.RefObject<TextInput>;
  onSubmit?: () => void;
  format?: (value: string) => string;
  autofill?: any;
  isTopPosition?: boolean;
  name?: string;
  multiName?: string;
  invisibleContainer?: boolean;
  displayName?: string;
  errorMessage?: string | boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
};

function TextInputField({
  placeholderText,
  label,
  infoLabel,
  value,
  multiline,
  numberOfLines,
  keyboardType,
  maxLength,
  autofill,
  isTopPosition = false,
  multiName,
  invisibleContainer = true,
  errorMessage,
  ...props
}: Props): ReactElement {
  const [isFocused, setFocused] = useState<boolean>(false);
  const [charsLeft, setCharsLeft] = useState<number>(0);

  const styleTextfield: TextStyle = useMemo(() => {
    let textStyle: TextStyle = errorMessage
      ? {...styles.textfieldContainer, ...{borderColor: colors.error}}
      : {
          ...styles.textfieldContainer,
          ...{borderColor: isFocused ? colors.mainBlue : colors.grey4},
        };

    if (multiline) {
      textStyle = {...textStyle, textAlignVertical: 'top'};
    }

    return textStyle;
  }, [errorMessage]);

  const defaultMultilineProps: ViewStyle = useMemo(() => {
    const rowsNumber = numberOfLines || 4;
    const height = 32 * rowsNumber;
    return multiline
      ? {
          minHeight: height,
          maxHeight: height,
        }
      : {minHeight: 48};
  }, [multiline]);

  const autoComplete = useMemo(
    () =>
      Platform.OS === 'ios'
        ? {textContentType: autofill}
        : {autoCompleteType: autofill},
    [autofill],
  );

  function ErrorMessage(): ReactElement {
    return (
      <ValidationMessage
        errorMessage={errorMessage}
        multiName={multiName}
        invisibleContainer={invisibleContainer}
      />
    );
  }

  function onChangeText(text: string): void {
    const currText = props.format ? props.format(text) : text;
    setCharsLeft(currText.length);
    props.onChangeText && props.onChangeText(text);
  }

  function onFocus(): void {
    setFocused(true);
  }

  function onBlur(e: NativeSyntheticEvent<TextInputFocusEventData>): void {
    setFocused(false);
    props.onBlur && props.onBlur(e);
    props.onSubmit && props.onSubmit();
  }

  return (
    <View style={{...layout.marginTopS, ...props.viewStyle}}>
      {isTopPosition && <ErrorMessage />}
      <View style={{alignSelf: 'stretch', paddingBottom: 5}}>
        {(label || infoLabel) && <Label label={label} infoLabel={infoLabel} />}
        <View style={styleTextfield}>
          <TextInput
            ref={props.forwardRef}
            {...defaultMultilineProps}
            {...props}
            {...autoComplete}
            maxLength={maxLength}
            multiline={multiline}
            style={styles.textfield}
            placeholder={placeholderText}
            placeholderTextColor={colors.grey3}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            onFocus={onFocus}
            onBlur={onBlur}
            secureTextEntry={false}
            value={value}
          />
          {maxLength && (
            <CharCount currCount={charsLeft} maxLength={maxLength} />
          )}
        </View>
      </View>
      {!isTopPosition && <ErrorMessage />}
    </View>
  );
}
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
