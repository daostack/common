import {makeAutoObservable} from 'mobx';
import {getConversionRate, Currency, getSymbol} from '~/Util/locale';
import {fromPromise} from 'mobx-utils';

export class CurrencyConverter {
  base: Currency;
  currency: Currency;
  amount: number;

  constructor(
    amount: number,
    base: Currency = 'USD',
    currency: Currency = 'ILS',
  ) {
    makeAutoObservable(this);
    this.amount = amount;
    this.base = base;
    this.currency = currency;
  }

  get conversionRate() {
    return fromPromise(
      getConversionRate(this.currency, this.base)
        .then((result) => result.data.rates[this.currency] as number)
        .catch((error) => {
          console.log('ILS Conversion Error', error);
        }),
    );
  }

  convert(amount: number) {
    return this.conversionRate.case({
      fulfilled: (conversionRate) => {
        if (conversionRate) {
          return `~${getSymbol(this.currency)}${Number(
            amount * conversionRate,
          ).toFixed(2)}`;
        }
        return 'unknown';
      },
      pending: () => '...loading',
      rejected: () => 'errored',
    });
  }

  get convertedAmount() {
    return this.convert(this.amount);
  }
}
