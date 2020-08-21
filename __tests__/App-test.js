/**
 * @format
 */

import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App';

// Note: test renderer must be required after react-native.
import FirebaseService from '../src/Services/FirebaseService';

it('getUser should return user', async () => {
  const user = async () => {
    console.log('users: ', await FirebaseService.getUser());
  };

  expect(user.length).toBeGreaterThan(0);
});

it('renders correctly', () => {
  renderer.create(<App />);
});
