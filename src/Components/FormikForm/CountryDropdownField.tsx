import React, {ReactElement, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
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
  errorMessage?: string | boolean;
};

function ErrorMessage({
  errorMessage,
}: Pick<Props, 'errorMessage'>): ReactElement {
  return <ValidationMessage errorMessage={errorMessage} />;
}

export const CountryDropdownField = ({
  onChange,
  label,
  errorMessage,
}: Props): ReactElement => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<ValueType | null>(null);
  const [items, setItems] = useState(countries);

  useEffect(() => {
    if (value) {
      onChange(value as string);
    }
  }, [value]);

  return (
    <>
      {label && <Text style={styles.label}>{label}</Text>}

      <DropDownPicker
        open={open}
        searchable
        value={value}
        items={items}
        placeholder=""
        closeOnBackPressed
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        listMode="SCROLLVIEW"
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
    </>
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
