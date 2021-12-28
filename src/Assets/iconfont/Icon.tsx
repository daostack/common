/* tslint:disable */
/* eslint-disable */

import React, {FunctionComponent} from 'react';
import {ViewProps, Text} from 'react-native';
import {GProps} from 'react-native-svg';
import Iconlifebuoy32 from './Iconlifebuoy32';
import Iconshow from './Iconshow';
import Iconhidden from './Iconhidden';
import IconquestionMark from './IconquestionMark';
import IconcheckIconSelected from './IconcheckIconSelected';
import IconcheckMark from './IconcheckMark';
import IconcheckIcon from './IconcheckIcon';
import Iconacknowledgement116 from './Iconacknowledgement116';
import IconbillingDetails24Copy4 from './IconbillingDetails24Copy4';
import Iconclcok from './Iconclcok';
import Iconcountdown24 from './Iconcountdown24';
import Icontrajectory from './Icontrajectory';
import Iconaddpicture from './Iconaddpicture';
import Iconreject24 from './Iconreject24';
import Iconapproved24 from './Iconapproved24';
import Icondiscussion from './Icondiscussion';
import Iconhistory from './Iconhistory';
import Iconproposal from './Iconproposal';
import IcondiscussionSelected from './IcondiscussionSelected';
import IconsendMessage from './IconsendMessage';
import IconuserRejected from './IconuserRejected';
import IconhistorySelected from './IconhistorySelected';
import IconproposalSelected from './IconproposalSelected';
import IconuserApproved from './IconuserApproved';
import Iconcontribution161 from './Iconcontribution161';
import Iconcontribution24 from './Iconcontribution24';
import Iconagenda16 from './Iconagenda16';
import Iconagenda24 from './Iconagenda24';
import Iconwallet216 from './Iconwallet216';
import Iconwallet224 from './Iconwallet224';
import IconcreateProposal from './IconcreateProposal';
import Icondelete from './Icondelete';
import Iconfile from './Iconfile';
import Iconadd24 from './Iconadd24';
import IconaddProposal32 from './IconaddProposal32';
import IconfeedSelected from './IconfeedSelected';
import IconaccountSelected from './IconaccountSelected';
import IconcommonsSelected from './IconcommonsSelected';
import Iconfeed from './Iconfeed';
import Iconcommons from './Iconcommons';
import Iconaccount from './Iconaccount';
import IconappleLogo from './IconappleLogo';
import Iconaccount1 from './Iconaccount1';
import IconagendaOld16 from './IconagendaOld16';
import IconagendaOld24 from './IconagendaOld24';
import Iconapproved16 from './Iconapproved16';
import Iconagenda from './Iconagenda';
import Iconboosted from './Iconboosted';
import Iconcheck16 from './Iconcheck16';
import Iconcheck32 from './Iconcheck32';
import Iconclose from './Iconclose';
import IconcommonsOld from './IconcommonsOld';
import IconcommonsSelectedOld from './IconcommonsSelectedOld';
import IcondaoGeneralInfo16 from './IcondaoGeneralInfo16';
import Iconcontribution241 from './Iconcontribution241';
import IcondaoGeneralInfo24 from './IcondaoGeneralInfo24';
import Iconedit16 from './Iconedit16';
import Icondeclined16 from './Icondeclined16';
import Icondonate16 from './Icondonate16';
import Iconfile2 from './Iconfile2';
import Iconexplanation1 from './Iconexplanation1';
import Iconfollowing from './Iconfollowing';
import Iconfollowing16 from './Iconfollowing16';
import Iconfollow16 from './Iconfollow16';
import Iconfollow from './Iconfollow';
import Iconlink from './Iconlink';
import IconpersonalInfo241 from './IconpersonalInfo241';
import IconpersonalInfo16 from './IconpersonalInfo16';
import Iconmenu1 from './Iconmenu1';
import Iconpicture1 from './Iconpicture1';
import Iconreport16 from './Iconreport16';
import Iconsort1 from './Iconsort1';
import Iconstyle16 from './Iconstyle16';
import Iconwarning from './Iconwarning';
import Iconstyle24 from './Iconstyle24';
import Iconwallet24 from './Iconwallet24';
import Iconwallet16 from './Iconwallet16';
import Iconfile1 from './Iconfile1';
import Icondollar from './Icondollar';
import Iconsort from './Iconsort';
import Iconshare32 from './Iconshare32';
import IconmenuHorizontal from './IconmenuHorizontal';
import Iconalert from './Iconalert';
import IconaccountPlaceHolder2 from './IconaccountPlaceHolder2';
import Iconfunds from './Iconfunds';
import Iconstyle from './Iconstyle';
import IconaccountPlaceHolder1 from './IconaccountPlaceHolder1';
import Iconapproved from './Iconapproved';
import Icondeclined from './Icondeclined';
import Iconcheck from './Iconcheck';
import Iconedit from './Iconedit';
import Icongroup from './Icongroup';
import Iconreport from './Iconreport';
import Iconpicture from './Iconpicture';
import IconleftArrow from './IconleftArrow';
import Iconcommon from './Iconcommon';
import IconrightArrow from './IconrightArrow';
import IcondownArrow from './IcondownArrow';
import IconupArrow from './IconupArrow';
import Icongoogle from './Icongoogle';
import {IconShekel} from './IconShekel';

export type IconNames =
  | 'lifebuoy-32'
  | 'show'
  | 'hidden'
  | 'questionMark'
  | 'checkIconSelected'
  | 'checkMark'
  | 'checkIcon'
  | 'acknowledgement-116'
  | 'billing-details-24-copy-4'
  | 'clcok'
  | 'countdown-24'
  | 'trajectory'
  | 'addpicture'
  | 'reject-24'
  | 'approved-24'
  | 'discussion'
  | 'history'
  | 'proposal'
  | 'discussion-selected'
  | 'send-message'
  | 'user-rejected'
  | 'history-selected'
  | 'proposal-selected'
  | 'user-approved'
  | 'contribution-161'
  | 'contribution-24'
  | 'agenda-16'
  | 'agenda-24'
  | 'wallet2-16'
  | 'wallet2-24'
  | 'create-proposal'
  | 'delete'
  | 'file'
  | 'add-24'
  | 'add-proposal-32'
  | 'feed-selected'
  | 'account-selected'
  | 'commons-selected'
  | 'feed'
  | 'commons'
  | 'account'
  | 'apple-logo'
  | 'account1'
  | 'agenda-old-16'
  | 'agenda-old-24'
  | 'approved-16'
  | 'agenda'
  | 'boosted'
  | 'check-16'
  | 'check-32'
  | 'close'
  | 'commons-old'
  | 'commons-selected-old'
  | 'dao-general-info-16'
  | 'contribution-241'
  | 'dao-general-info-24'
  | 'edit-16'
  | 'declined-16'
  | 'donate-16'
  | 'file2'
  | 'explanation1'
  | 'following'
  | 'following-16'
  | 'follow-16'
  | 'follow'
  | 'link'
  | 'personal-info-241'
  | 'personal-info-16'
  | 'menu1'
  | 'picture1'
  | 'report-16'
  | 'sort1'
  | 'style-16'
  | 'warning'
  | 'style-24'
  | 'wallet-24'
  | 'wallet-16'
  | 'file-1'
  | 'dollar'
  | 'sort'
  | 'share-32'
  | 'menu-horizontal'
  | 'alert'
  | 'account-place-holder2'
  | 'funds'
  | 'style'
  | 'account-place-holder1'
  | 'approved'
  | 'declined'
  | 'check'
  | 'edit'
  | 'group'
  | 'report'
  | 'picture'
  | 'left-arrow'
  | 'common'
  | 'right-arrow'
  | 'down-arrow'
  | 'up-arrow'
  | 'google'
  | 'shekel';

interface Props extends GProps, ViewProps {
  name: IconNames | string;
  size?: number;
  color?: string | string[];
}

export const Icon: FunctionComponent<Props> = ({name, ...rest}) => {
  switch (name) {
    case 'lifebuoy-32':
      return <Iconlifebuoy32 {...rest} />;
    case 'show':
      return <Iconshow {...rest} />;
    case 'hidden':
      return <Iconhidden {...rest} />;
    case 'questionMark':
      return <IconquestionMark {...rest} />;
    case 'checkIconSelected':
      return <IconcheckIconSelected {...rest} />;
    case 'checkMark':
      return <IconcheckMark {...rest} />;
    case 'checkIcon':
      return <IconcheckIcon {...rest} />;
    case 'acknowledgement-116':
      return <Iconacknowledgement116 {...rest} />;
    case 'billing-details-24-copy-4':
      return <IconbillingDetails24Copy4 {...rest} />;
    case 'clcok':
      return <Iconclcok {...rest} />;
    case 'countdown-24':
      return <Iconcountdown24 {...rest} />;
    case 'trajectory':
      return <Icontrajectory {...rest} />;
    case 'addpicture':
      return <Iconaddpicture {...rest} />;
    case 'reject-24':
      return <Iconreject24 {...rest} />;
    case 'approved-24':
      return <Iconapproved24 {...rest} />;
    case 'discussion':
      return <Icondiscussion {...rest} />;
    case 'history':
      return <Iconhistory {...rest} />;
    case 'proposal':
      return <Iconproposal {...rest} />;
    case 'discussion-selected':
      return <IcondiscussionSelected {...rest} />;
    case 'send-message':
      return <IconsendMessage {...rest} />;
    case 'user-rejected':
      return <IconuserRejected {...rest} />;
    case 'history-selected':
      return <IconhistorySelected {...rest} />;
    case 'proposal-selected':
      return <IconproposalSelected {...rest} />;
    case 'user-approved':
      return <IconuserApproved {...rest} />;
    case 'contribution-161':
      return <Iconcontribution161 {...rest} />;
    case 'contribution-24':
      return <Iconcontribution24 {...rest} />;
    case 'agenda-16':
      return <Iconagenda16 {...rest} />;
    case 'agenda-24':
      return <Iconagenda24 {...rest} />;
    case 'wallet2-16':
      return <Iconwallet216 {...rest} />;
    case 'wallet2-24':
      return <Iconwallet224 {...rest} />;
    case 'create-proposal':
      return <IconcreateProposal {...rest} />;
    case 'delete':
      return <Icondelete {...rest} />;
    case 'file':
      return <Iconfile {...rest} />;
    case 'add-24':
      return <Iconadd24 {...rest} />;
    case 'add-proposal-32':
      return <IconaddProposal32 {...rest} />;
    case 'feed-selected':
      return <IconfeedSelected {...rest} />;
    case 'account-selected':
      return <IconaccountSelected {...rest} />;
    case 'commons-selected':
      return <IconcommonsSelected {...rest} />;
    case 'feed':
      return <Iconfeed {...rest} />;
    case 'commons':
      return <Iconcommons {...rest} />;
    case 'account':
      return <Iconaccount {...rest} />;
    case 'apple-logo':
      return <IconappleLogo {...rest} />;
    case 'account1':
      return <Iconaccount1 {...rest} />;
    case 'agenda-old-16':
      return <IconagendaOld16 {...rest} />;
    case 'agenda-old-24':
      return <IconagendaOld24 {...rest} />;
    case 'approved-16':
      return <Iconapproved16 {...rest} />;
    case 'agenda':
      return <Iconagenda {...rest} />;
    case 'boosted':
      return <Iconboosted {...rest} />;
    case 'check-16':
      return <Iconcheck16 {...rest} />;
    case 'check-32':
      return <Iconcheck32 {...rest} />;
    case 'close':
      return <Iconclose {...rest} />;
    case 'commons-old':
      return <IconcommonsOld {...rest} />;
    case 'commons-selected-old':
      return <IconcommonsSelectedOld {...rest} />;
    case 'dao-general-info-16':
      return <IcondaoGeneralInfo16 {...rest} />;
    case 'contribution-241':
      return <Iconcontribution241 {...rest} />;
    case 'dao-general-info-24':
      return <IcondaoGeneralInfo24 {...rest} />;
    case 'edit-16':
      return <Iconedit16 {...rest} />;
    case 'declined-16':
      return <Icondeclined16 {...rest} />;
    case 'donate-16':
      return <Icondonate16 {...rest} />;
    case 'file2':
      return <Iconfile2 {...rest} />;
    case 'explanation1':
      return <Iconexplanation1 {...rest} />;
    case 'following':
      return <Iconfollowing {...rest} />;
    case 'following-16':
      return <Iconfollowing16 {...rest} />;
    case 'follow-16':
      return <Iconfollow16 {...rest} />;
    case 'follow':
      return <Iconfollow {...rest} />;
    case 'link':
      return <Iconlink {...rest} />;
    case 'personal-info-241':
      return <IconpersonalInfo241 {...rest} />;
    case 'personal-info-16':
      return <IconpersonalInfo16 {...rest} />;
    case 'menu1':
      return <Iconmenu1 {...rest} />;
    case 'picture1':
      return <Iconpicture1 {...rest} />;
    case 'report-16':
      return <Iconreport16 {...rest} />;
    case 'sort1':
      return <Iconsort1 {...rest} />;
    case 'style-16':
      return <Iconstyle16 {...rest} />;
    case 'warning':
      return <Iconwarning {...rest} />;
    case 'style-24':
      return <Iconstyle24 {...rest} />;
    case 'wallet-24':
      return <Iconwallet24 {...rest} />;
    case 'wallet-16':
      return <Iconwallet16 {...rest} />;
    case 'file-1':
      return <Iconfile1 {...rest} />;
    case 'dollar':
      return <Icondollar {...rest} />;
    case 'sort':
      return <Iconsort {...rest} />;
    case 'share-32':
      return <Iconshare32 {...rest} />;
    case 'menu-horizontal':
      return <IconmenuHorizontal {...rest} />;
    case 'alert':
      return <Iconalert {...rest} />;
    case 'account-place-holder2':
      return <IconaccountPlaceHolder2 {...rest} />;
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
    case 'check':
      return <Iconcheck {...rest} />;
    case 'edit':
      return <Iconedit {...rest} />;
    case 'group':
      return <Icongroup {...rest} />;
    case 'report':
      return <Iconreport {...rest} />;
    case 'picture':
      return <Iconpicture {...rest} />;
    case 'left-arrow':
      return <IconleftArrow {...rest} />;
    case 'common':
      return <Iconcommon {...rest} />;
    case 'right-arrow':
      return <IconrightArrow {...rest} />;
    case 'down-arrow':
      return <IcondownArrow {...rest} />;
    case 'up-arrow':
      return <IconupArrow {...rest} />;
    case 'google':
      return <Icongoogle {...rest} />;
    case 'shekel':
      return <IconShekel {...rest} />;
  }

  return null;
};

export default Icon;
