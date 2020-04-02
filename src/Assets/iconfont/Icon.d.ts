/* eslint-disable */

import { FunctionComponent } from 'react';
// Don't forget to install package: @types/react-native
import { ViewProps } from 'react-native';
import { GProps } from 'react-native-svg';

interface Props extends GProps, ViewProps {
  name: 'agenda' | 'dao-general-info' | 'funds' | 'style' | 'account-place-holder1' | 'approved' | 'declined' | 'close' | 'account-selected' | 'commons-selected' | 'check' | 'edit' | 'follow' | 'feed-selected' | 'group' | 'following' | 'menu' | 'report' | 'picture' | 'pencil' | 'save' | 'verification' | 'wallet' | 'left-arrow' | 'common' | 'right-arrow' | 'account-place-holder' | 'feed' | 'google' | 'account';
  size?: number;
  color?: string | string[];
}

export declare const Icon: FunctionComponent<Props>;

export default Icon;
