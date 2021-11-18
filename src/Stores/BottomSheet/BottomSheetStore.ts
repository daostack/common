import React from 'react';
import {makeAutoObservable} from 'mobx';
import {BOTTOM_SHEET} from '~/Screens/BottomSheetScreens';
import {HiddenContentInfoProps} from '~/Screens/BottomSheetScreens/HiddenContentInfo';
import {timeReported} from '~/Components/Moderation/Reported';
import {EditType, IModerationEntity} from '~/Types';
import {getUserById} from '../data-sources';
import {BottomSheetTemplates} from './BottomSheetTemplate';

class BottomSheetStore {
  template: React.ReactElement | null = null;
  topSnap = 0;
  isVisible = false;

  constructor() {
    makeAutoObservable(this);
  }

  showBottomSheet = (type: BOTTOM_SHEET, props: Record<string, any> = {}) => {
    const template = BottomSheetTemplates[type];
    let allProps = props;
    if ('props' in template) {
      allProps = {...template.props, ...props};
    }

    this.topSnap = template.topSnap;
    this.template = React.createElement(template.content, allProps);
    this.isVisible = true;
  };

  // showHiddenNote = (props: HiddenContentInfoProps) => {
  //   this.showBottomSheet(BOTTOM_SHEET.HIDDEN_CONTENT_INFO, props);
  // };

  showHiddenNote = (
    moderation: IModerationEntity,
    type: EditType,
    isModerator: boolean,
  ) => {
    this.showBottomSheet(BOTTOM_SHEET.HIDDEN_CONTENT_INFO, {
      userName: getUserById(moderation.moderator).reporterName,
      date: timeReported(moderation),
      reasons: moderation.reasons,
      moderatorNote: moderation.note || '',
      type,
      isModerator,
    });
  };

  hideBottomSheet = () => {
    this.isVisible = false;
    this.topSnap = 0;
    this.template = null;
  };

  increaseTopSnap = (increaseVal: number) => {
    this.topSnap = this.topSnap + increaseVal;
  };

  decreaseTopSnap = (decreaseVal: number) => {
    this.topSnap = this.topSnap - decreaseVal;
  };

  setSnap = (snap: number) => {
    this.topSnap = snap;
  };
}

export default BottomSheetStore;
