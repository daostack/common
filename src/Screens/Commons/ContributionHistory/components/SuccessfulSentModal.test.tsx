import React from 'react';
import {SuccessfulSentModal} from './SuccessfulSentModal';
import {render, fireEvent} from '@testing-library/react-native';
import * as Navigation from '@react-navigation/native';
import {commonMock} from '__mocks__/commonMock';

jest.mock('@react-navigation/native');

describe('SuccessfulSentModal', () => {
  const mockedNavigationDispatch = jest.fn();
  const mockedNavigationSetOptions = jest.fn();

  beforeAll(() => {
    jest.spyOn(Navigation, 'useNavigation').mockReturnValue({
      dispatch: mockedNavigationDispatch,
      setOptions: mockedNavigationSetOptions,
    });
  });

  test('SuccessfulSentModal should render correctly', () => {
    const {getByText, toJSON} = render(
      <SuccessfulSentModal
        isVisible={true}
        isMonthly={true}
        common={commonMock}
      />,
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
        common={commonMock}
      />,
    );
    expect(getByText('Contribution was sent')).not.toBeNull();
  });

  test('SuccessfulSentModal should navigation.dispatch if click on "OK" button', () => {
    const {getByText} = render(
      <SuccessfulSentModal
        isVisible={true}
        isMonthly={false}
        common={commonMock}
      />,
    );

    const okButton = getByText('OK');
    fireEvent.press(okButton);

    expect(mockedNavigationDispatch).toHaveBeenCalledTimes(1);
  });
});
