import React from 'react';
import {render} from '@testing-library/react-native';
import {AgendaTopTitles} from '~/Screens/Commons/CommonProfile/CommonAgenda/AgendaHeader/AgendaTopTitles';
import {commonMock} from '../../../../../../__mocks__/commonMock';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({insets: null}),
}));
jest.mock('@react-navigation/native');

describe('AgendaTopTitles', () => {
  const hasPermission = 'true';
  const isMember = true;

  test('AgendaTopTitles should render correctly', () => {
    const {getByText, toJSON} = render(
      <AgendaTopTitles
        common={commonMock}
        hasPermission={hasPermission}
        isMember={isMember}
      />,
    );
    expect(getByText('Members')).not.toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });
});
