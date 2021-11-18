import axios from 'axios';
import moment from 'moment';
import * as RNLocalize from 'react-native-localize';

export const getLocale = () => RNLocalize.getCountry();

export const isIsraelLocale = getLocale() === 'IL';

export const axiosInstance = axios.create({
  baseURL: 'https://api.exchangeratesapi.io/v1/',
});

export type Currency = 'ILS' | 'USD';

const symbolsLookup: Record<
  Currency,
  {symbol: string; side: 'left' | 'right'}
> = {
  ILS: {
    symbol: '₪',
    side: 'right',
  },
  USD: {
    symbol: '$',
    side: 'right',
  },
};

export const getSymbol = (currency: Currency) => symbolsLookup[currency];

export interface ExchangeRatesAPIResult<
  BASE extends Currency,
  RATE extends Currency
> {
  success: true;
  timestamp: number;
  base: BASE;
  date: moment.MomentInput;
  rates: Record<RATE, number>;
}

export const getConversionRate = async <
  SYMBOL extends Currency = 'ILS',
  RATE extends Currency = 'USD'
>(
  symbols: SYMBOL,
  base: RATE,
) =>
  axiosInstance.get<{
    success: true;
    timestamp: number;
    base: RATE;
    date: moment.MomentInput;
    rates: Record<RATE, number>;
  }>(
    `latest?symbols=${symbols}&base=${base}&access_key=d1e5b8e65f0785d209c347d68194bf0a`,
  );

export const getCurrentConversionRate = async (
  symbols: Currency = 'ILS',
  base: Currency = 'USD',
) =>
  axiosInstance.get(
    `latest?symbols=${symbols}&base=${base}&access_key=d1e5b8e65f0785d209c347d68194bf0a`,
  );

export const convertAmountToIls = (value: number, conversionRate: number) =>
  `~₪${Number(value * conversionRate).toFixed(2)}`;
