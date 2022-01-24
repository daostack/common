import React, {ReactElement, useEffect, useState} from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import DropDownPicker, {ValueType} from 'react-native-dropdown-picker';
import {colors, font, layout} from '~/Theme';
import ValidationMessage from './ValidationMessage';
import {countryList} from '~/Util/countries';

type Country = {
  value: string;
  name: string;
  label: string;
  payin: boolean;
  payout: boolean;
};

const countries = countryList.filter((country) => country.payout) as Country[];

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

export const CountryDropdownField = ({
  onChange,
  viewStyle,
  label,
  errorMessage,
}: Props): ReactElement => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<ValueType | null>(null);
  const [items, setItems] = useState(countries);

  useEffect(() => {
    if (Number.isInteger(value)) {
      onChange(value as string);
    }
  }, [value]);

  return (
    <View style={[styles.container, viewStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <DropDownPicker
        open={open}
        searchable
        value={value}
        items={items}
        placeholder=""
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        searchTextInputStyle={{
          borderWidth: 0,
          ...font.primary.regular,
          ...font.fontSize(2),
        }}
        searchPlaceholder="Country"
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
  container: {
    position: 'relative',
    zIndex: 1000000,
  },
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
