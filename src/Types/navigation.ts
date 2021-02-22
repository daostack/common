import {StackActionType} from '@react-navigation/native';

interface NavigationProps {
    dispatch: (arg: StackActionType) => void;
}

export interface WithNavigationRef {
    navigation: {
        current: NavigationProps
    }
}
export interface WithNavigation {
    navigation: NavigationProps
}
