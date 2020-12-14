import React from 'react';
import {observable, action, decorate} from 'mobx';

class BottomSheetStore {
  template;
  topSnap;
  isVisible;
  constructor() {
    this.template = null;
    this.topSnap = 0;
    this.isVisible = false;
  }

  showBottomSheet = (currTemplate, props) => {
    let allProps = props;
    if (currTemplate.props) {
      allProps = {...currTemplate.props, ...props};
    }

    this.topSnap = currTemplate.topSnap;
    this.template = React.createElement(currTemplate.content, allProps);
    this.isVisible = true;
  };

  hideBottomSheet = () => {
    this.isVisible = false;
    this.topSnap = 0;
    this.template = null;
  };

  increseTopSnap = (increseVal) => {
    this.topSnap = this.topSnap + increseVal;
  };

  decreseTopSnap = (decreseVal) => {
    this.topSnap = this.topSnap - decreseVal;
  };
}

decorate(BottomSheetStore, {
  showBottomSheet: action,
  increseTopSnap: action,
  decreseTopSnap: action,
  topSnap: observable,
  template: observable,
  isVisible: observable,
});

export default BottomSheetStore;
