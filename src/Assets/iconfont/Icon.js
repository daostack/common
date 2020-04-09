/* eslint-disable */

import React from 'react';

import IconaddPicture from './IconaddPicture';
import Icongroup1 from './Icongroup1';
import Iconalert from './Iconalert';
import Iconwallet1 from './Iconwallet1';
import IconaccountPlaceHolder2 from './IconaccountPlaceHolder2';
import Iconsave1 from './Iconsave1';
import Iconagenda from './Iconagenda';
import IcondaoGeneralInfo from './IcondaoGeneralInfo';
import Iconfunds from './Iconfunds';
import Iconstyle from './Iconstyle';
import IconaccountPlaceHolder1 from './IconaccountPlaceHolder1';
import Iconapproved from './Iconapproved';
import Icondeclined from './Icondeclined';
import Iconclose from './Iconclose';
import IconaccountSelected from './IconaccountSelected';
import IconcommonsSelected from './IconcommonsSelected';
import Iconcheck from './Iconcheck';
import Iconedit from './Iconedit';
import Iconfollow from './Iconfollow';
import IconfeedSelected from './IconfeedSelected';
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
import IconaccountPlaceHolder from './IconaccountPlaceHolder';
import Iconfeed from './Iconfeed';
import Icongoogle from './Icongoogle';
import Iconaccount from './Iconaccount';

export const Icon = ({ name, ...rest }) => {
  switch (name) {
    case 'add-picture':
      return <IconaddPicture {...rest} />;
    case 'group1':
      return <Icongroup1 {...rest} />;
    case 'alert':
      return <Iconalert {...rest} />;
    case 'wallet1':
      return <Iconwallet1 {...rest} />;
    case 'account-place-holder2':
      return <IconaccountPlaceHolder2 {...rest} />;
    case 'save1':
      return <Iconsave1 {...rest} />;
    case 'agenda':
      return <Iconagenda {...rest} />;
    case 'dao-general-info':
      return <IcondaoGeneralInfo {...rest} />;
    case 'funds':
      return <Iconfunds {...rest} />;
    case 'style':
      return <Iconstyle {...rest} />;
    case 'account-place-holder1':
      return <IconaccountPlaceHolder1 {...rest} />;
    case 'approved':
      return <Iconapproved {...rest} />;
    case 'declined':
      return <Icondeclined {...rest} />;
    case 'close':
      return <Iconclose {...rest} />;
    case 'account-selected':
      return <IconaccountSelected {...rest} />;
    case 'commons-selected':
      return <IconcommonsSelected {...rest} />;
    case 'check':
      return <Iconcheck {...rest} />;
    case 'edit':
      return <Iconedit {...rest} />;
    case 'follow':
      return <Iconfollow {...rest} />;
    case 'feed-selected':
      return <IconfeedSelected {...rest} />;
    case 'group':
      return <Icongroup {...rest} />;
    case 'following':
      return <Iconfollowing {...rest} />;
    case 'menu':
      return <Iconmenu {...rest} />;
    case 'report':
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
