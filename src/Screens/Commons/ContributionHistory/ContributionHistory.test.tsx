import React from 'react';
import * as Navigation from '@react-navigation/native';
import ContributionHistory from './ContributionHistory';
import {render, fireEvent} from '@testing-library/react-native';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';
import {CurrencySymbols} from '~/Util/locale';

jest.mock('../../../Util/hooks/useStore', () => ({
  useStore: jest.fn().mockReturnValue({
    getCommonOneTimePayments: jest.fn().mockImplementation(() => [
      {
        id: 1,
        amount: {
          amount: 1000,
        },
        createdAt: new Date('2020-01-01'),
      },
    ]),
    getCommonTotalPaymentsAmount: jest.fn().mockReturnValue(2500),
    getCommonLastSubscriptions: jest.fn().mockImplementation((commonId) => {
      if (!commonId) {
        return null;
      }

      return {
        dueDate: new Date('2020-01-01'),
        amount: 1500,
        status: 'Active',
      };
    }),
  }),
}));
jest.mock('@react-navigation/native');

describe('ContributionHistory', () => {
  const totalPaymentAmount = 2500;
  const mockedNavigationDispatch = jest.fn();
  const mockedNavigationSetOptions = jest.fn();

  beforeAll(() => {
    jest.spyOn(Navigation, 'useNavigation').mockReturnValue({
      dispatch: mockedNavigationDispatch,
      setOptions: mockedNavigationSetOptions,
    });
  });

  beforeEach(() => {
    jest.spyOn(Navigation, 'useRoute').mockReturnValue({
      params: {
        common: {
          name: 'Common Name',
          id: 1,
        },
      },
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('ContributionHistory should render correctly', () => {
    const {getByText, toJSON} = render(<ContributionHistory />);
    expect(getByText('History')).not.toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });

  test('ContributionHistory should set navigation Title correctly', () => {
    render(<ContributionHistory />);
    expect(mockedNavigationSetOptions).toHaveBeenCalledWith({
      title: 'Common Name',
    });
  });

  test('ContributionHistory should not render "MonthlyContributionItem" and "Change my monthly contribution" button if activeSubscription=null', () => {
    jest.spyOn(Navigation, 'useRoute').mockReturnValue({
      params: {
        common: {
          name: 'Common Name',
          id: 0,
        },
      },
    } as any);
    const {queryByText} = render(<ContributionHistory />);
    expect(queryByText('Monthly Contribution')).toBeNull();
    expect(queryByText('Change my monthly contribution')).toBeNull();
  });

  test('ContributionHistory should render "MonthlyContributionItem" and "Change my monthly contribution" button if activeSubscription!=null', () => {
    const {queryByText} = render(<ContributionHistory />);
    expect(queryByText('Monthly Contribution')).not.toBeNull();
    expect(queryByText('Change my monthly contribution')).not.toBeNull();
  });

  test('ContributionHistory click on MonthlyContributionItem should navigate to "NAVIGATION_SCREENS.MONTHLY_CONTRIBUTION_CHARGES"', () => {
    const {getByText} = render(<ContributionHistory />);
    const button = getByText('Monthly Contribution');
    fireEvent.press(button);
    expect(mockedNavigationDispatch).toHaveBeenCalledTimes(1);
    expect(mockedNavigationDispatch).toHaveBeenCalledWith(
      Navigation.CommonActions.navigate({
        name: NAVIGATION_SCREENS.MONTHLY_CONTRIBUTION_CHARGES,
        params: {
          commonName: 'Common Name',
          commonId: 1,
        },
      }),
    );
  });

  test('ContributionHistory should divide the amount by 100', () => {
    const {getAllByText} = render(<ContributionHistory />);
    expect(
      getAllByText(`${CurrencySymbols.SHEKEL}${totalPaymentAmount / 100}`),
    ).not.toBeNull();
  });
});
