import React from 'react';
import {render} from '@testing-library/react-native';
import {NewCommonProfile} from '~/Screens/Commons/CommonProfile/NewCommonProfile';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({insets: null}),
}));
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  useRoute: () => ({
    params: {
      params: {
        commonId: 'test',
      },
    },
  }),
}));

jest.mock('../../../Util/hooks/useStore');

describe('RequestToJoinBtn', () => {
  test('NewCommonProfile should render correctly', () => {
    const {getByText, toJSON} = render(<NewCommonProfile />);
    expect(getByText('Members')).not.toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });
});
