import React from 'react';
import {render} from '@testing-library/react-native';
import {CommonFundsBox} from '~/Components/Commons/CommonFundsBox';
import {commonMock} from '../../../__mocks__/commonMock';
import {CurrencySymbols} from '~/Util/locale';
import {formatMoney} from '~/Util/FormatUtil';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({insets: null}),
}));
jest.mock('@react-navigation/native');

describe('CommonFundsBox', () => {
  const balance = commonMock.balance;
  const raised = commonMock.raised;

  test('CommonFundsBox should render correctly', () => {
    const {getByText, toJSON} = render(<CommonFundsBox common={commonMock} />);
    expect(getByText('Available funds')).not.toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });
  test('Available funds should be in the right format', () => {
    const {getByText} = render(<CommonFundsBox common={commonMock} />);
    expect(
      getByText(`${CurrencySymbols.SHEKEL}${formatMoney(balance / 100)}`),
    ).not.toBeNull();
  });
  test('Total raised should be in the right format', () => {
    const {getByText} = render(<CommonFundsBox common={commonMock} />);
    expect(
      getByText(`${CurrencySymbols.SHEKEL}${formatMoney(raised / 100)}`),
    ).not.toBeNull();
  });
});
