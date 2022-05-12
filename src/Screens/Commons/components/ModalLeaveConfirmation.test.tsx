import React from 'react';
import {ModalLeaveConfirmation} from './ModalLeaveConfirmation';
import {render} from '@testing-library/react-native';
import {Common} from '~/Stores/Models/Common';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({insets: null}),
}));
jest.mock('@react-navigation/native');
jest.mock('react-native-intercom', () => jest.fn());

describe('ModalLeaveConfirmation', () => {
  const currCommon: Common = {
    active: true,
    balance: 64100,
    byline: undefined,
    fundingGoalDeadline: 1606897465,
    id: '02314122-6b05-4563-a8ce-4a10e97b72da',
    image:
      'https://firebasestorage.googleapis.com/v0/b/common-daostack.appspot.com/o/public_img%2Fcover_template_02.png?alt=media',
    links: [],
    members: [],
    metadata: {
      action: 'boo',
      byline: '',
      contributionType: 'one-time',
      description: 'go yaniv go go',
      founderId: '97d5y9WXk1fEZv767j1ejKuHevi1',
      minFeeToJoin: 2400,
    },
    name: 'Emcff',
    raised: 90540,
    register: 'registered',
    reservedBalance: 8190,
    rules: [],
    updatedAt: {nanoseconds: 94000000, seconds: 1652196547},
  };
  const onCancel = jest.fn();
  const closeModal = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('ModalLeaveConfirmation should render correctly', () => {
    const {getByText, toJSON} = render(
      <ModalLeaveConfirmation
        currCommon={currCommon}
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
