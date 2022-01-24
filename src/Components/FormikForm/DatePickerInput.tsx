import {inject, observer} from 'mobx-react';
import moment from 'moment';
import React, {ReactElement, ReactNode, useMemo, useState} from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputFocusEventData,
  View,
  ViewStyle,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import TextInputMask from 'react-native-text-input-mask';
import Icon from '~/Assets/iconfont/Icon';
import {colors, font, layout} from '~/Theme';
import {unFormatNumber} from '~/Util/FormatUtil';
import ValidationMessage from './ValidationMessage';

const ICON_HIT_SLOP = {top: 15, bottom: 15, left: 15, right: 15};

export type DataPickerProps = {
  value: string;
  onChangeText?: (value: string) => void;
  onBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  label?: string | ReactNode;
  error?: string;
  viewStyle?: ViewStyle | ViewStyle[];
  errorMessage?: string | boolean;
};

function ErrorMessage({
  errorMessage,
}: Pick<DataPickerProps, 'errorMessage'>): ReactElement {
  return <ValidationMessage errorMessage={errorMessage} />;
}

function DatePickerInput({
  error,
  label,
  viewStyle,
  value,
  errorMessage,
  ...otherProps
}: DataPickerProps): ReactElement {
  const [state, setState] = useState({
    isFocused: false,
    dynamicWidth: 50,
    prevTextLength: 0,
    showPassword: false,
  });
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const styleTextfield = useMemo(() => {
    let textFieldStyle = styles.textfield;
    if (error) {
      textFieldStyle = {...styles.textfield, ...styles.textfieldError};
    }
    if (state.isFocused) {
      textFieldStyle = {...styles.textfield, ...styles.textfieldFocus};
    }

    return textFieldStyle;
  }, [error, state.isFocused]);

  function onChangeText(currText: any) {
    const unformattedText = unFormatNumber(currText);
    otherProps.onChangeText && otherProps.onChangeText(unformattedText);
    const changedDate = new Date(unformattedText);
    if (changedDate && unformattedText.length === 10) {
      changedDate.setDate(changedDate.getDate() + 1);
      setDate(changedDate);
    }
  }

  function onFocus(): void {
    setState({...state, isFocused: true});
  }

  function onBlur(e: NativeSyntheticEvent<TextInputFocusEventData>): void {
    setState({...state, isFocused: false});
    otherProps.onBlur && otherProps.onBlur(e);
  }

  return (
    <>
      <View style={[{alignSelf: 'stretch'}, viewStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View
          style={[
            styleTextfield,
            errorMessage ? {borderColor: colors.error} : {},
          ]}>
          <TextInputMask
            {...otherProps}
            onFocus={onFocus}
            onBlur={onBlur}
            textContentType="telephoneNumber"
            placeholder={'00/00/0000'}
            onChangeText={onChangeText}
            style={styles.fieldStyle}
            mask={'[00]/[00]/[0000]'}
            value={value}
          />
          <TextInput />

          <Pressable hitSlop={ICON_HIT_SLOP} onPress={() => setOpen(true)}>
            <Icon name="calendar" />
          </Pressable>
        </View>
        {errorMessage && (
          <View style={layout.marginTopXXS}>
            <ErrorMessage errorMessage={errorMessage} />
          </View>
        )}
      </View>
      <DatePicker
        modal
        androidVariant="iosClone"
        mode="date"
        open={open}
        maximumDate={new Date()}
        date={date}
        onConfirm={(dateValue: Date) => {
          setOpen(false);
          setDate(dateValue);
          onChangeText(moment(dateValue).format('MM/DD/YYYY'));
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  textfield: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.grey4,
    paddingHorizontal: 12,
    ...layout.marginTopS,
  },
  fieldStyle: {
    flex: 1,
    height: 48,
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
});

export default inject('uiStore')(observer(DatePickerInput));
