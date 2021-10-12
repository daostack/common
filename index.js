/**
 * @format
 */

import React from 'react';
import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import stores from './src/Stores';
import {ApolloProvider} from '@apollo/client';
import {apollo} from '~/Util/helpers/apolloHelper';
import {Provider} from 'mobx-react';
import CodePush from 'react-native-code-push';
import {Update} from '~/Components/Update/Update';
import Reactotron, {networking} from 'reactotron-react-native';

Reactotron.configure().use(networking()).connect();

LogBox.ignoreAllLogs(true);

const MobX = () => (
  <Update>
    {() => (
      <ApolloProvider client={apollo}>
        <Provider {...stores}>
          <App />
        </Provider>
      </ApolloProvider>
    )}
  </Update>
);

const AppBundle = CodePush({
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_SUSPEND,
  minimumBackgroundDuration: 15,
})(MobX);

AppRegistry.registerComponent(appName, () => AppBundle);
