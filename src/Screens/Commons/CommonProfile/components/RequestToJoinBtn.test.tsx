import React from 'react';
import {render} from '@testing-library/react-native';
import {RequestToJoinBtn} from '~/Screens/Commons/CommonProfile/components/RequestToJoinBtn';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({insets: null}),
}));
jest.mock('@react-navigation/native');

describe('RequestToJoinBtn', () => {
  const requestToJoin = jest.fn();

  test('RequestToJoinBtn should render correctly', () => {
    const {getByText, toJSON} = render(
      <RequestToJoinBtn requestToJoin={requestToJoin} />,
    );
    expect(getByText('Request to join')).not.toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });
});
