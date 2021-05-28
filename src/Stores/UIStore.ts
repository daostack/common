import {observable, runInAction} from 'mobx';
import BottomSheetStore from './BottomSheetStore';
import AppLoaderStore from './AppLoaderStore';
import RootStore from './RootStore';
import {getCurrentConversionRate} from '~/Util/locale';

export default class UIStore {
  rootStore: RootStore;
  bottomSheetStore: BottomSheetStore;
  appLoaderStore: AppLoaderStore;

  @observable
  conversionRate: number = 0;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.bottomSheetStore = new BottomSheetStore();
    this.appLoaderStore = new AppLoaderStore();
    getCurrentConversionRate()
      .then((result) => {
        runInAction(() => {
          this.conversionRate = result.data.rates.ILS;
        });
      })
      .catch((error) => {
        console.log('ILS Conversion Error', error);
      });
  }
}
