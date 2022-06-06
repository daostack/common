import React from 'react';
import {render} from '@testing-library/react-native';
import {CommonTopTitles} from '~/Screens/Commons/CommonProfile/CommonHeader/CommonTopTitles';
import {commonMock} from '__mocks__/commonMock';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({insets: null}),
}));
jest.mock('@react-navigation/native');

describe('CommonTopTitles', () => {
  const hasPermission = 'true';
  const isMember = true;

  test('CommonTopTitles should render correctly', () => {
    const {getByText, toJSON} = render(
      <CommonTopTitles
        common={commonMock}
        hasPermission={hasPermission}
        isMember={isMember}
      />,
    );
    expect(getByText('Members')).not.toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });
});
