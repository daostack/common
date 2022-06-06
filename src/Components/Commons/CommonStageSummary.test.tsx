import React from 'react';
import {render} from '@testing-library/react-native';
import {CommonStageSummary} from '~/Components/Commons/CommonStageSummary';
import {commonMock} from '__mocks__/commonMock';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({insets: null}),
}));
jest.mock('@react-navigation/native');

describe('CommonStageSummary', () => {
  test('CommonStageSummary should render correctly', () => {
    const {getByText, toJSON} = render(
      <CommonStageSummary common={commonMock} />,
    );
    expect(getByText('Available funds')).not.toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });
});
