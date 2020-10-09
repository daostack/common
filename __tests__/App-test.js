/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import UserService from '../src/Services/UserService';
import logger from '~/Services/Logger';

it('getUser should return user', async () => {
  const user = async () => {
    logger.log('users: ', await UserService.getUser());
  };


  expect(user.length).toBeGreaterThan(0);
});

it('renders correctly', () => {
  renderer.create(<App />);
});
