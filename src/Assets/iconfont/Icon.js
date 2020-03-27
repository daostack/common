/* eslint-disable */

import React from 'react';

import Iconapproved from './Iconapproved';
import Icondeclined from './Icondeclined';
import Iconclose from './Iconclose';
import IconaccountSelected from './IconaccountSelected';
import IconcommonsSelected from './IconcommonsSelected';
import Iconcheck from './Iconcheck';
import Iconedit from './Iconedit';
import Iconfollow from './Iconfollow';
import IconfeedSelected from './IconfeedSelected';
import Iconfollow from './Iconfollow';
import Iconfollowing from './Iconfollowing';
import Icongroup from './Icongroup';
import Iconfollowing from './Iconfollowing';
import Iconmenu from './Iconmenu';
import Iconreport from './Iconreport';
import Iconpicture from './Iconpicture';
import Iconpencil from './Iconpencil';
import Iconsave from './Iconsave';
import Iconverification from './Iconverification';
import Iconwallet from './Iconwallet';
import IconleftArrow from './IconleftArrow';
import Iconcommon from './Iconcommon';
import IconrightArrow from './IconrightArrow';
import IconleftArrow16 from './IconleftArrow16';
import IconaccountPlaceHolder from './IconaccountPlaceHolder';
import Iconfeed from './Iconfeed';
import Icongoogle from './Icongoogle';
import Iconaccount from './Iconaccount';

export const Icon = ({ name, ...rest }) => {
  switch (name) {
    case 'approved-':
      return <Iconapproved {...rest} />;
    case 'declined-':
      return <Icondeclined {...rest} />;
    case 'close':
      return <Iconclose {...rest} />;
    case 'account-selected':
      return <IconaccountSelected {...rest} />;
    case 'commons-selected':
      return <IconcommonsSelected {...rest} />;
    case 'check-':
      return <Iconcheck {...rest} />;
    case 'edit-':
      return <Iconedit {...rest} />;
    case 'follow':
      return <Iconfollow {...rest} />;
    case 'feed-selected':
      return <IconfeedSelected {...rest} />;
    case 'follow-':
      return <Iconfollow {...rest} />;
    case 'following-':
      return <Iconfollowing {...rest} />;
    case 'group':
      return <Icongroup {...rest} />;
    case 'following':
      return <Iconfollowing {...rest} />;
    case 'menu':
      return <Iconmenu {...rest} />;
    case 'report-':
      return <Iconreport {...rest} />;
    case 'picture':
      return <Iconpicture {...rest} />;
    case 'pencil':
      return <Iconpencil {...rest} />;
    case 'save':
      return <Iconsave {...rest} />;
    case 'verification':
      return <Iconverification {...rest} />;
    case 'wallet':
      return <Iconwallet {...rest} />;
    case 'left-arrow':
      return <IconleftArrow {...rest} />;
    case 'common':
      return <Iconcommon {...rest} />;
    case 'right-arrow':
      return <IconrightArrow {...rest} />;
    case 'left-arrow-16':
      return <IconleftArrow16 {...rest} />;
    case 'account-place-holder':
      return <IconaccountPlaceHolder {...rest} />;
    case 'feed':
      return <Iconfeed {...rest} />;
    case 'google':
      return <Icongoogle {...rest} />;
    case 'account':
      return <Iconaccount {...rest} />;
  }

  return null;
};

export default Icon;
