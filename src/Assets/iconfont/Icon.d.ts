/* eslint-disable */

import { FunctionComponent } from 'react';
// Don't forget to install package: @types/react-native
import { ViewProps } from 'react-native';
import { GProps } from 'react-native-svg';

interface Props extends GProps, ViewProps {
  name: 'link' | 'file' | 'file-1' | 'boosted' | 'explanation' | 'proposal' | 'clcok-16' | 'contribution-24' | 'personal-info-24' | 'wallet-24' | 'delete' | 'dollar' | 'sort' | 'proposal-indication' | 'proposals-selected' | 'proposals' | 'history-selected' | 'history' | 'discussion-selected' | 'discussion' | 'share-32' | 'menu-horizontal' | 'donate-16' | 'add-picture' | 'group1' | 'alert' | 'wallet1' | 'account-place-holder2' | 'save1' | 'agenda' | 'dao-general-info' | 'funds' | 'style' | 'account-place-holder1' | 'approved' | 'declined' | 'close' | 'account-selected' | 'commons-selected' | 'check' | 'edit' | 'follow' | 'feed-selected' | 'group' | 'following' | 'menu' | 'report' | 'plus' | 'picture' | 'pencil' | 'save' | 'verification' | 'wallet' | 'left-arrow' | 'common' | 'right-arrow' | 'account-place-holder' | 'feed' | 'google' | 'account';
  size?: number;
  color?: string | string[];
}

export declare const Icon: FunctionComponent<Props>;

export default Icon;
