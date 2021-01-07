import React from 'react';
import {View} from 'react-native';
import {bool, func, object, oneOfType, shape, string} from 'prop-types';

import SearchableDropdown from 'react-native-searchable-dropdown';
import * as RNLocalize from 'react-native-localize';

import TextInputFieldWithIcon from './TextInputFieldWithIcon';

import {countryList} from '../../Util/countries';
import {colors} from '../../Theme';
import {Label} from './TextInputField';

export const CountrySelectField = ({onChange, ...props}) => {
  const [countryIndex, setCountryIndex] = React.useState(0);
  const [selectedCountries, setSelectedCountries] = React.useState([
    countryList[0],
  ]);

  React.useEffect(() => {
    getCountryIndex(RNLocalize.getCountry());
  }, []);

  const getCountryIndex = (country) => {
    const index = countryList.findIndex(
      (countryObj) => countryObj.value === country,
    );
    onChange && onChange(country);
    setCountryIndex(index || 0);
  };

  return (
    <View style={styles.container}>
      {(props.label || props.infoLabel) && (
        <Label label={props.label} infoLabel={props.infoLabel} />
      )}

      <SearchableDropdown
        onItemSelect={(item) => {
          const items = [item, ...selectedCountries];
          getCountryIndex(item.value);
          setSelectedCountries(items);
        }}
        itemStyle={styles.itemStyle}
        itemTextStyle={{color: 'black'}}
        itemsContainerStyle={styles.itemsContainerStyle}
        items={countryList.filter((country) => country.payin)}
        defaultIndex={countryIndex}
        resetValue={false}
        textInputProps={{
          placeholder: countryList[countryIndex].name,
          placeholderTextColor: 'black',
          underlineColorAndroid: 'transparent',
          style: styles.textInput,
        }}
        listProps={{nestedScrollEnabled: true}}
      />

      <View style={{display: 'none'}}>
        <TextInputFieldWithIcon
          editable={false}
          key={countryIndex}
          value={countryList[countryIndex].value}
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
    validateRule: oneOfType([string, object]),
    invisibleContainer: bool,
    customErrorMessage: string,
  }),
  value: string,
  label: string,
  infoLabel: string,
};
