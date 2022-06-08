import {NavigationRoutes} from '~/Navigation/routes.enum';

// need that to enable types for navigation routes
declare global {
  namespace ReactNavigation {
    interface RootParamList extends NavigationRoutes {}
  }
}
