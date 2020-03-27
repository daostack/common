/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import stores from './src/FormStores';
import {Provider} from 'mobx-react';

console.disableYellowBox = true;

const MobX = () => {
  return (
    <Provider {...stores}>
      <App />
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => MobX);
