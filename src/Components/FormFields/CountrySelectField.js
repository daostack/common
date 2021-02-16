import React from 'react';
import {View} from 'react-native';
import {bool, func, object, oneOfType, shape, string} from 'prop-types';

import * as RNLocalize from 'react-native-localize';
import SearchableDropdown from 'react-native-searchable-dropdown';


import {countryList} from '~/Util/countries';
import {colors} from '../../Theme';

import TextInputFieldWithIcon from './TextInputFieldWithIcon';
import {Label} from './TextInputField';

const getCountryIndex = (countryArr, country) => countryArr.findIndex(
  (countryObj) => countryObj.value === country
);

export const CountrySelectField = ({onChange, ...props}) => {
  const countries = countryList.filter((country) => country.payin);

  const [ selectedCountryIndex, setSelectedCountryIndex ] = React.useState(getCountryIndex(countries, RNLocalize.getCountry()));
  const [selectedCountryIndex, setSelectedCountryIndex] = React.useState(
    getCountryIndex(countries, value || RNLocalize.getCountry()),
  );

  // Call the callback with the initial country value
  React.useEffect(() => {
    typeof onChange === 'function'
      && onChange(selectedCountry);
  }, []);

  const onCountrySelected = (country) => {
    setSelectedCountry(country.value);
    setSelectedCountryIndex(getCountryIndex(countries, country.value));

    if (props.validation) {
      const {formStore, name} = props.validation;

      formStore.fieldChanged(name, country.value, false);
    }

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
          editable={false}
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

CountrySelectField.propTypes = {
  onChange: func,
  validation: shape({
    name: string,
    formStore: object,
    displayName: string,
    validateRule: oneOfType([ string, object ]),
    invisibleContainer: bool,
    customErrorMessage: string,
  }),
  value: string,
  label: string,
  infoLabel: string,
};
