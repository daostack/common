/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import stores from './src/Stores';
import {Provider} from 'mobx-react';
import CodePush from 'react-native-code-push';
import {Update} from '~/Components/Update/Update';

console.disableYellowBox = true;

const MobX = () => (
  <Update>
    {() => (
      <Provider {...stores}>
        <App/>
      </Provider>
    )}
  </Update>
);

const AppBundle = CodePush({
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_RESUME,
})(MobX);

AppRegistry.registerComponent(appName, () => AppBundle);
