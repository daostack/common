import React from 'react';
import {ContributionItem} from './ContributionItem';
import {fireEvent} from '@testing-library/react-native';
import {render} from '~/Util/test-utils';
import '@testing-library/jest-native/extend-expect';

// jest.mock('@react-native-community/google-signin', () => {});
// jest.mock('react-native-config', () => ({
//   ENV: 'staging',
// }));
// jest.mock('react-native-fbsdk-next', () => ({
//   Settings: {setAppID: jest.fn()},
// }));
// jest.mock('react-native-localize', () => ({
//   getLocales: jest.fn(),
//   getCountry: jest.fn(),
// }));
// jest.mock('@react-native-firebase/app', () => {});

describe('ContributionItem', () => {
  let createdDate: Date;
  const amount = 100;

  beforeAll(() => {
    createdDate = new Date();
  });

  test('ContributionItem should render correctly', () => {
    const {getByText, toJSON} = render(
      <ContributionItem createdAt={createdDate} amount={amount} />,
    );
    expect(getByText('One-time Contribution')).not.toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });
});
