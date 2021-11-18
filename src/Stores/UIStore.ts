import {makeAutoObservable} from 'mobx';
import BottomSheetStore from './BottomSheet/BottomSheetStore';
import AppLoaderStore from './AppLoaderStore';

export default class UIStore {
  bottomSheetStore = new BottomSheetStore();
  appLoaderStore = new AppLoaderStore();

  constructor() {
    makeAutoObservable(this);
  }
}
