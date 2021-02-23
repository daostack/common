import {observable, runInAction} from 'mobx';
import BottomSheetStore from './BottomSheetStore';
import RootStore from './RootStore';
import {getCurrentConversionRate} from '~/Util/locale';

export default class UIStore {
  rootStore: RootStore;
  bottomSheetStore: BottomSheetStore;

  @observable
  conversionRate: number = 0;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.bottomSheetStore = new BottomSheetStore();
    getCurrentConversionRate().then((result) => {
      runInAction(() => {
        this.conversionRate = result.data.rates.ILS;
      });
    });
  }
}
