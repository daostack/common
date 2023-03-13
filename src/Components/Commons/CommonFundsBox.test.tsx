import React from 'react';
import {render} from '@testing-library/react-native';
import {CommonFundsBox} from '~/Components/Commons/CommonFundsBox';
import {commonMock} from '../../../__mocks__/commonMock';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({insets: null}),
}));
jest.mock('@react-navigation/native');

describe('CommonFundsBox', () => {
  test('CommonFundsBox should render correctly', () => {
    const {getByText, toJSON} = render(<CommonFundsBox common={commonMock} />);
    expect(getByText('Available funds')).not.toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });
});
