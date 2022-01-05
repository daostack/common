import {makeAutoObservable} from 'mobx';
import React from 'react';

class BottomSheetStore {
  template: any;
  topSnap;
  isVisible;
  constructor() {
    makeAutoObservable(this);
    this.template = null;
    this.topSnap = 0;
    this.isVisible = false;
  }

  showBottomSheet = (currTemplate: any, props: any) => {
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

  increaseTopSnap = (increseVal: number) => {
    this.topSnap = this.topSnap + increseVal;
  };

  decreaseTopSnap = (decreseVal: number) => {
    this.topSnap = this.topSnap - decreseVal;
  };

  setSnap = (snap: number) => {
    this.topSnap = snap;
  };
}

export default BottomSheetStore;
