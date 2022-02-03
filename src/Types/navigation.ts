import {StackActionType} from '@react-navigation/native';

interface NavigationProps {
  dispatch: (arg: StackActionType) => void;
  pop: () => void;
  goBack: () => void;
  setOptions: (value: any) => void;
}

export interface WithNavigationRef {
  navigation: {
    current: NavigationProps;
  };
}
export interface WithNavigation {
  navigation: NavigationProps;
}

export type RouteProps<T> = {
  params: T;
  key: string;
  name: string;
};

export type AddInvoicesRouteProps = RouteProps<{proposalId: string}>;
