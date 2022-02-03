import React, {ReactElement, useEffect, useState} from 'react';
import {StyleSheet, Text, View, ViewStyle, Platform} from 'react-native';
import DropDownPicker, {ValueType} from 'react-native-dropdown-picker';
import {colors, font, layout} from '~/Theme';
import ValidationMessage from './ValidationMessage';

const GENDER_OPTIONS = [
  {
    value: 0,
    label: 'Female',
  },
  {
    value: 1,
    label: 'Male',
  },
];

type Props = {
  onChange: (value: string) => void;
  label: string;
  viewStyle?: ViewStyle | ViewStyle[];
  errorMessage?: string | boolean;
};

function ErrorMessage({
  errorMessage,
}: Pick<Props, 'errorMessage'>): ReactElement {
  return <ValidationMessage errorMessage={errorMessage} />;
}

export const GenderSelectField = ({
  onChange,
  viewStyle,
  label,
  errorMessage,
}: Props): ReactElement => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<ValueType | null>(null);
  const [items, setItems] = useState(GENDER_OPTIONS);

  useEffect(() => {
    if (Number.isInteger(value)) {
      onChange(value as string);
    }
  }, [value]);

  return (
    <View style={[viewStyle, Platform.OS === 'android' ? {} : {zIndex: 10000}]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <DropDownPicker
        open={open}
        value={value}
        items={items}
        closeOnBackPressed
        placeholder=""
        listMode="SCROLLVIEW"
        zIndex={10000}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        arrowIconStyle={styles.arrowIconStyle}
        style={[
          styles.dropdownInput,
          errorMessage ? {borderColor: colors.error} : {},
        ]}
        dropDownContainerStyle={styles.dropdownContainer}
      />
      {errorMessage && (
        <View style={layout.marginTopXXS}>
          <ErrorMessage errorMessage={errorMessage} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.slate,
    alignSelf: 'flex-start',
  },
  arrowIconStyle: {
    width: 15,
    height: 15,
  },
  dropdownInput: {
    borderColor: '#eee',
    ...font.primary.regular,
    ...font.fontSize(2),
    borderRadius: 3,
    marginTop: 10,
  },
  dropdownContainer: {
    borderColor: '#eee',
  },
});
