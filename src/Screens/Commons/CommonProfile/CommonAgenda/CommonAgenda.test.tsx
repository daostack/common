import React from 'react';
import {render} from '@testing-library/react-native';
import {CommonAgenda} from '~/Screens/Commons/CommonProfile/CommonAgenda/CommonAgenda';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({insets: null}),
}));
jest.mock('@react-navigation/native');

describe('RequestToJoinBtn', () => {
  test('CommonAgenda should render correctly', () => {
    const {toJSON} = render(<CommonAgenda />);
    expect(toJSON()).toMatchSnapshot();
  });
});
