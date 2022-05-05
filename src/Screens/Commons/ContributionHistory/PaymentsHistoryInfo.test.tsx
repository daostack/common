import React from 'react';
import {PaymentsHistoryInfo} from './PaymentsHistoryInfo';
import {render} from '@testing-library/react-native';
import {CurrencySymbols} from '~/Util/locale';

describe('PaymentsHistoryInfo', () => {
  const amount = 100;

  test('PaymentsHistoryInfo should render correctly', () => {
    const {getByText, toJSON} = render(<PaymentsHistoryInfo amount={amount} />);
    expect(
      getByText('To this day, I have contributed to this common'),
    ).not.toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });

  test('PaymentsHistoryInfo should set amount correctly', () => {
    const {getByText} = render(<PaymentsHistoryInfo amount={amount} />);
    expect(getByText(`${CurrencySymbols.SHEKEL}${amount}`)).not.toBeNull();
  });
});
