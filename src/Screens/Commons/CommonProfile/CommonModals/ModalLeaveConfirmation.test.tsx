import React from 'react';
import {ModalLeaveConfirmation} from './ModalLeaveConfirmation';
import {render, fireEvent} from '@testing-library/react-native';
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

  test('OnLeave works correctly', async () => {
    const leaveCommon = jest.fn();
    const {getByText} = render(
      <ModalLeaveConfirmation
        currCommon={commonMock}
        onCancel={onCancel}
        closeModal={closeModal}
      />,
    );
    const button = getByText('Leave Common');
    fireEvent.press(button);
    expect(closeModal).toHaveBeenCalledTimes(1);
    //await expect(leaveCommon()).resolves.toBeUndefined();
  });
});
