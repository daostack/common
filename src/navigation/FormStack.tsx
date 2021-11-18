import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import * as Screens from '~/Screens';

enum CREATE_COMMON_NAVIGATION_SCREENS {
  CREATE_STEP_1 = 'CreateStep1',
  CREATE_STEP_2 = 'CreateStep2',
  CREATE_STEP_3 = 'CreateStep3',
  CREATE_STEP_4 = 'CreateStep4',
};

const Stack = createStackNavigator();

export const CreateCommonNavigator: React.FC<{}> = ({ children }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
       name={CREATE_COMMON_NAVIGATION_SCREENS.CREATE_STEP_1}
       component={Screens.CreateStep1}
       options={{
         headerShown: false,
       }}
      >
    <Stack.Screen
      name={CREATE_COMMON_NAVIGATION_SCREENS.CREATE_STEP_2}
      component={Screens.CreateStep2}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name={CREATE_COMMON_NAVIGATION_SCREENS.CREATE_STEP_3}
      component={Screens.CreateStep3}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name={CREATE_COMMON_NAVIGATION_SCREENS.CREATE_STEP_4}
      component={Screens.CreateStep4}
      options={{
        headerShown: false,
      }}
    />
    </Stack.Navigator>
  );
};

