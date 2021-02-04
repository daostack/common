import axios from 'axios';
import * as RNLocalize from 'react-native-localize';

export const getLocale = () => RNLocalize.getCountry();

export const isIsraelLocale = () => RNLocalize.getCountry() === 'IL';

export const axiosInstance = axios.create({
  baseURL: 'https://api.exchangeratesapi.io/',
});

export const getCurrentConversionRate = async () =>
  axiosInstance.get('latest?symbols=ILS&base=USD');
