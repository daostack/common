import React from 'react';
import UseAcknowledgment from '../UseAcknowledgment';
import data from '../data';
import {render, fireEvent} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';

test('when user did not agree with the statement,  should keep next button disabled', () => {
  const {getByText} = render(
    <UseAcknowledgment onPressAgree={jest.fn()} />
  );
  const continueFundingButton = getByText(data.continueFunding);
  expect(continueFundingButton).toBeDisabled();
});

test('when user did agree with the statement, should enable next button', () => {
  const {getByText} = render(
    <UseAcknowledgment onPressAgree={jest.fn()} />
  );
  const continueFundingButton = getByText(data.continueFunding);
  expect(continueFundingButton).toBeDisabled();
  fireEvent.press(getByText(data.agreeWithAbove));
  expect(continueFundingButton).toBeEnabled();
});
