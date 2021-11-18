import React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';
import {BOTTOM_SHEET} from '~/Screens/BottomSheetScreens';
import {
  AppNavigationContainerRefWithCurrent,
  RootNavigatorParamList,
} from './types';

const config = {
  screens: {
    [NAVIGATION_SCREENS.COMMON_PROFILE]: '/common/:id',
    [NAVIGATION_SCREENS.PROPOSAL_SCREEN]: '/proposal/:id',
    [BOTTOM_SHEET.USER_PROFILE_SHEET_SCREEN]: '/user/:id',
    [NAVIGATION_SCREENS.DISCUSSIONS]: '/discussion/:id',
    [NAVIGATION_SCREENS.BROWSER]: '*',
  },
};

const linking = {
  prefixes: ['common://', 'com.daostack.common://', 'https://app.common.io'],
  config,
};

interface AppNavigationContainerProps {
  children(
    navigationRef: AppNavigationContainerRefWithCurrent,
  ): React.ReactElement<unknown>;
}

const useDynamicLinks = (
  _navigationRef: AppNavigationContainerRefWithCurrent,
) => {
  const handleDynamicLink = React.useCallback(
    (_link: FirebaseDynamicLinksTypes.DynamicLink) => {},
    [],
  );
  const handleForegroundLink = React.useCallback(
    (_link: FirebaseDynamicLinksTypes.DynamicLink | null) => {},
    [],
  );
  React.useEffect(() => dynamicLinks().onLink(handleDynamicLink), []);
  React.useEffect(() => {
    dynamicLinks().getInitialLink().then(handleForegroundLink);
  }, []);
};

export const AppNavigationContainer = ({
  children,
}: AppNavigationContainerProps) => {
  const navigationRef = useNavigationContainerRef<RootNavigatorParamList>();
  useDynamicLinks(navigationRef);

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      {children(navigationRef)}
    </NavigationContainer>
  );
};
