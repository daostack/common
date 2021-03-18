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

  increaseTopSnap = (increseVal) => {
    this.topSnap = this.topSnap + increseVal;
  };

  decreaseTopSnap = (decreseVal) => {
    this.topSnap = this.topSnap - decreseVal;
  };

  setSnap = (snap) => {
    this.topSnap = snap;
  };
}

decorate(BottomSheetStore, {
  showBottomSheet: action,
  increaseTopSnap: action,
  decreaseTopSnap: action,
  setSnap: action,
  topSnap: observable,
  template: observable,
  isVisible: observable,
});

export default BottomSheetStore;
