import React from 'react';
import {MonthlyContributionItem} from './MonthlyContributionItem';
import {render} from '@testing-library/react-native';
import {SUBSCRIPTION_STATUSES} from '~/Util/constants';
import {CurrencySymbols} from '~/Util/locale';

describe('MonthlyContributionItem', () => {
  const dueDate = new Date('10-20-2022');
  const activeStatus = SUBSCRIPTION_STATUSES.ACTIVE;
  const paymentFailedStatus = SUBSCRIPTION_STATUSES.PAYMENT_FAILED;
  const formattedDate = '20 October 2022';
  const amount = 100;

  test('MonthlyContributionItem should render correctly', () => {
    const {getByText, toJSON} = render(
      <MonthlyContributionItem
        dueDate={dueDate}
        amount={amount}
        status={activeStatus}
      />,
    );
    expect(getByText('Monthly Contribution')).not.toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });

  test('MonthlyContributionItem should format date correctly', () => {
    const {getByText} = render(
      <MonthlyContributionItem
        dueDate={dueDate}
        amount={amount}
        status={activeStatus}
      />,
    );
    expect(getByText(`Next payment: ${formattedDate}`)).not.toBeNull();
  });

  test('MonthlyContributionItem should return 1 if amount = 100', () => {
    const {getByText} = render(
      <MonthlyContributionItem
        dueDate={dueDate}
        amount={amount}
        status={activeStatus}
      />,
    );
    expect(getByText(`${CurrencySymbols.SHEKEL}1/mo`)).not.toBeNull();
  });

  test('MonthlyContributionItem should return 0 if amount = undefined', () => {
    const {getByText} = render(
      <MonthlyContributionItem dueDate={dueDate} status={activeStatus} />,
    );
    expect(getByText(`${CurrencySymbols.SHEKEL}0/mo`)).not.toBeNull();
  });

  test('MonthlyContributionItem should return null if status: PAYMENT_FAILED', () => {
    const {toJSON} = render(
      <MonthlyContributionItem
        dueDate={dueDate}
        amount={amount}
        status={paymentFailedStatus}
      />,
    );
    expect(toJSON()).toBeNull();
  });
});
