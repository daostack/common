import React, {ReactElement} from 'react';
import {View} from 'react-native';

import * as RNLocalize from 'react-native-localize';
import SearchableDropdown from 'react-native-searchable-dropdown';

import {countryList} from '~/Util/countries';
import {colors} from '../../Theme';

import TextInputFieldWithIcon, {TextInputFieldWithIconProps, TextFieldProps} from './TextInputFieldWithIcon';

import {Label} from './Label';

type Country = {
    value: string;
    name: string;
    payin: boolean;
    payout: boolean;
}

const getCountryIndex = (countryArr: Country[], country: string) => countryArr.findIndex(
  (countryObj: Country) => countryObj.value === country
);

type Props = TextInputFieldWithIconProps & TextFieldProps & {
    onChange?: (value: string) => void,
    value: string,
    label: string,
    infoLabel: string,
}

export const CountrySelectField = ({onChange, value, ...props}: Props): ReactElement => {
  const countries = countryList.filter((country) => country.payin) as Country[];

  const [selectedCountryIndex, setSelectedCountryIndex] = React.useState(
    getCountryIndex(countries, value || RNLocalize.getCountry()),
  );
  const [selectedCountry, setSelectedCountry] = React.useState(
    countries[selectedCountryIndex].value,
  );

  // Call the callback with the initial country value
  React.useEffect(() => {
    typeof onChange === 'function'
      && onChange(selectedCountry);
  }, []);

  const onCountrySelected = (country: Country): void => {
    setSelectedCountry(country.value);
    setSelectedCountryIndex(getCountryIndex(countries, country.value));

    typeof onChange === 'function'
      && onChange(country.value);
  };

  return (
    <View style={styles.container}>
      {(props.label || props.infoLabel) && (
        <Label label={props.label} infoLabel={props.infoLabel}/>
      )}

      <SearchableDropdown
        onItemSelect={onCountrySelected}
        itemStyle={styles.itemStyle}
        itemTextStyle={{color: 'black'}}
        itemsContainerStyle={styles.itemsContainerStyle}
        items={countries}
        defaultIndex={selectedCountryIndex}
        resetValue={false}
        textInputProps={{
          placeholder: countries[selectedCountryIndex].name,
          placeholderTextColor: 'black',
          underlineColorAndroid: 'transparent',
          style: styles.textInput,
        }}
        listProps={{nestedScrollEnabled: true}}
      />

      <View style={{display: 'none'}}>
        <TextInputFieldWithIcon
          value={selectedCountry}
          iconEndName="down-arrow"
          {...props}
        />
      </View>
    </View>
  );
};

const styles = {
  container: {
    position: 'relative',
  },

  iconContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
  },

  itemStyle: {
    padding: 15,
    marginTop: 2,
    backgroundColor: 'white',
    borderColor: colors.grey4,
    borderWidth: 1,
    borderRadius: 5,
  },
  itemsContainerStyle: {
    maxHeight: 200,
    borderColor: colors.grey4,
    borderWidth: 1,
    borderRadius: 4,
  },

  textInput: {
    padding: 15,
    borderWidth: 1,
    borderColor: colors.grey4,
    borderRadius: 4,
  },
};
