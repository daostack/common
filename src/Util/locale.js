import axios from 'axios';
import * as RNLocalize from 'react-native-localize';

export const getLocale = () => RNLocalize.getCountry();

export const isIsraelLocale = getLocale() === 'IL';

export const axiosInstance = axios.create({
  baseURL: 'https://api.exchangeratesapi.io/v1/',
});

export const getCurrentConversionRate = async () =>
  axiosInstance.get(
    'latest?symbols=ILS&base=USD&access_key=d1e5b8e65f0785d209c347d68194bf0a',
  );

export const convertAmountToIls = (value, conversionRate) =>
  `~${CurrencySymbols.SHEKEL}${Number(value * conversionRate).toFixed(2)}`;

export const CurrencySymbols = {
  SHEKEL: '₪',
  USD: '$',
};
