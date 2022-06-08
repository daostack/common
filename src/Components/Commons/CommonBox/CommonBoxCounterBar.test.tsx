import React from 'react';
import {render} from '@testing-library/react-native';
import {CommonBoxCounterBar} from '~/Components/Commons/CommonBox/CommonBoxCounterBar';
import {commonMock} from '../../../../__mocks__/commonMock';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({insets: null}),
}));
jest.mock('@react-navigation/native');

describe('CommonBoxCounterBar', () => {
  test('CommonBoxCounterBar should render correctly', () => {
    const {toJSON} = render(<CommonBoxCounterBar common={commonMock} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
