import {Platform} from 'react-native';

export const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 100 : 60;

export const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : 0;
