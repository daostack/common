import React from 'react';
import {SuccessfulSentModal} from './SuccessfulSentModal';
import {render, fireEvent} from '@testing-library/react-native';
import {Common} from '~/Stores/Models/Common';
import * as Navigation from '@react-navigation/native';

jest.mock('@react-navigation/native');

describe('SuccessfulSentModal', () => {
  const mockedNavigationDispatch = jest.fn();
  const mockedNavigationSetOptions = jest.fn();
  const common: Common = new Common({
    active: true,
    balance: 64100,
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
      zeroContribution: false,
    },
    name: 'Emcff',
    raised: 90540,
    register: 'registered',
    reservedBalance: 8190,
    rules: [],
    updatedAt: {nanoseconds: 94000000, seconds: 1652196547},
    createdAt: {nanoseconds: 94000000, seconds: 1652196547},
  });

  beforeAll(() => {
    jest.spyOn(Navigation, 'useNavigation').mockReturnValue({
      dispatch: mockedNavigationDispatch,
      setOptions: mockedNavigationSetOptions,
    });
  });

  test('SuccessfulSentModal should render correctly', () => {
    const {getByText, toJSON} = render(
      <SuccessfulSentModal isVisible={true} isMonthly={true} common={common} />,
    );
    expect(
      getByText(`Your monthly Contribution has been changed`),
    ).not.toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });

  test('SuccessfulSentModal should render "Contribution was sent" text if isMonthly=false', () => {
    const {getByText} = render(
      <SuccessfulSentModal
        isVisible={true}
        isMonthly={false}
        common={common}
      />,
    );
    expect(getByText('Contribution was sent')).not.toBeNull();
  });

  test('SuccessfulSentModal should navigation.dispatch if click on "OK" button', () => {
    const {getByText} = render(
      <SuccessfulSentModal
        isVisible={true}
        isMonthly={false}
        common={common}
      />,
    );

    const okButton = getByText('OK');
    fireEvent.press(okButton);

    expect(mockedNavigationDispatch).toHaveBeenCalledTimes(1);
  });
});
