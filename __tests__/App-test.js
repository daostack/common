/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import FirebaseService from '../src/Services/FirebaseService';

it("getUser should return user", async () => {

  const user = async () => {
    console.log('users: ', await FirebaseService.getUser())
  };

  console.log('USERS >>>', user);

  expect(user.length).toBeGreaterThan(0);
});


it('renders correctly', () => {
  renderer.create(<App />);
});

