import React from 'react';
import {render} from '@testing-library/react-native';
import {NewCommonProfile} from '~/Screens/Commons/CommonProfile/NewCommonProfile';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({insets: null}),
}));
jest.mock('@react-navigation/native');

describe('RequestToJoinBtn', () => {
  test('NewCommonProfile should render correctly', () => {
    const {getByText, toJSON} = render(<NewCommonProfile />);
    expect(getByText('Members')).not.toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });
});
