import React from 'react';
import {View} from 'react-native';
import {bool, func, number, object, oneOfType, shape, string} from 'prop-types';

import RNPickerSelect from 'react-native-picker-select';
import * as RNLocalize from 'react-native-localize';

import Icon from '../../Assets/iconfont/Icon';
import TextInputFieldWithIcon from './TextInputFieldWithIcon';

import {countryList} from '../../Util/countries';
import {colors} from '../../Theme';
import {Label} from './TextInputField';


export const CountrySelectField = ({defaultCountry, onChange, ...props}) => {
  const selectRef = React.useRef();
  const [selectedCountry, setSelectedCountry] = React.useState(defaultCountry || RNLocalize.getCountry());

  React.useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(selectedCountry);
    }
  }, [selectedCountry]);

  const onCountryChange = (value, index) => {
    setSelectedCountry(value);
  };

  const renderIcon = () => (
    <Icon name="down-arrow"/>
  );

  return (
    <View style={styles.container}>
      {(props.label || props.infoLabel) && (
        <Label label={props.label} infoLabel={props.infoLabel}/>
      )}

      <RNPickerSelect
        ref={selectRef}
        style={styles.select}
        onValueChange={onCountryChange}
        value={selectedCountry}
        items={countryList}
        Icon={renderIcon}
      />

      <View style={{display: 'none'}}>
        <TextInputFieldWithIcon
          editable={false}
          key={selectedCountry}
          value={countryList[countryList.findIndex((x) => x.value === selectedCountry)].value}
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

  select: {
    inputIOS: {
      fontSize: 16,
      paddingVertical: 14,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: colors.grey4,
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: colors.grey4,
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    iconContainer: {
      top: 15,
      right: 12,
    },
  },
};

CountrySelectField.propTypes = {
  onChange: func,
  validation: shape({
    name: string,
    formStore: object,
    displayName: string,
    validateRule: oneOfType([
      string,
      object,
    ]),
    invisibleContainer: bool,
    customErrorMessage: string,
  }),
  value: string,
  fieldActionComponent: object,
  onTogglePress: func,
  toggleName: string,
  onChangeText: func,
  onBlur: func,
  placeholderText: string,
  label: string,
  infoLabel: string,
  password: bool,
  multiline: bool,
  numberOfLines: number,
  keyboardType: string,
  iconName: string,
  iconSize: number,
  iconEmptyColor: string,
  iconFillColor: string,
  iconStyle: object,
  subLabel: string,
  forwardRef: object,
  viewStyle: object,
  defaultCountry: string,
};
