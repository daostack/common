import React from 'react';
import {ModalLeaveConfirmation} from './ModalLeaveConfirmation';
import {render} from '@testing-library/react-native';
import {commonMock} from '../../../../../__mocks__/commonMock';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({insets: null}),
}));
jest.mock('@react-navigation/native');

jest.mock('../../../../Util/hooks/useStore', () => ({
  useStore: jest.fn().mockReturnValue({
    leaveCommon: jest.fn(),
  }),
}));

describe('ModalLeaveConfirmation', () => {
  const onCancel = jest.fn();
  const closeModal = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('ModalLeaveConfirmation should render correctly', () => {
    const {getByText, toJSON} = render(
      <ModalLeaveConfirmation
        currCommon={commonMock}
        onCancel={onCancel}
        closeModal={closeModal}
      />,
    );
    expect(
      getByText('Are you sure you want to Leave this Common?'),
    ).not.toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });
});
