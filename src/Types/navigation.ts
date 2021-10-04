import {StackActionType, CommonActions} from '@react-navigation/native';

export interface NavigationProps {
  dispatch: (arg: any) => void;
  navigate: (arg: any, arg2?: any) => void;
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
