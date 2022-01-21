import React, {ReactElement, useEffect, useState} from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import DropDownPicker, {ValueType} from 'react-native-dropdown-picker';
import {colors, font} from '~/Theme';

const GENDER_OPTIONS = [
  {
    value: 0,
    label: 'Female',
  },
  {
    value: 1,
    label: 'Male',
  },
  {
    value: 2,
    label: 'Other',
  },
];

type Props = {
  onChange: (value: string) => void;
  label: string;
  viewStyle?: ViewStyle | ViewStyle[];
};

export const GenderSelectField = ({
  onChange,
  viewStyle,
  label,
}: Props): ReactElement => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<ValueType | null>(null);
  const [items, setItems] = useState(GENDER_OPTIONS);

  useEffect(() => {
    if (value) {
      onChange(value as string);
    }
  }, [value]);

  return (
    <View style={[styles.container, viewStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <DropDownPicker
        open={open}
        value={value}
        items={items}
        placeholder=""
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        arrowIconStyle={styles.arrowIconStyle}
        style={styles.dropdownInput}
        dropDownContainerStyle={styles.dropdownContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000000,
  },
  label: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.slate,
    alignSelf: 'flex-start',
    flex: 1,
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
