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

export type DataPickerProps = {
  value: string;
  onChangeText?: (value: string) => void;
  onBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  label?: string | ReactNode;
  error?: string;
  viewStyle?: ViewStyle | ViewStyle[];
};

const ICON_HIT_SLOP = {top: 15, bottom: 15, left: 15, right: 15};

function DatePickerInput({
  error,
  label,
  viewStyle,
  value,
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
    if (changedDate) {
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
        <View style={styleTextfield}>
          <TextInputMask
            {...otherProps}
            onFocus={onFocus}
            onBlur={onBlur}
            textContentType="telephoneNumber"
            placeholder={'00/00/00'}
            onChangeText={onChangeText}
            style={styles.fieldStyle}
            mask={'[00]/[00]/[00]'}
            value={value}
          />
          <TextInput />

          <Pressable hitSlop={ICON_HIT_SLOP} onPress={() => setOpen(true)}>
            <Icon name="calendar" />
          </Pressable>
        </View>
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
          onChangeText(moment(dateValue).format('MM/DD/YY'));
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
    flex: 1,
  },
});

export default inject('uiStore')(observer(DatePickerInput));
