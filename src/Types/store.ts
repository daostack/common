import {ReactElement} from 'react';

export type BottomSheetStore = {
    showBottomSheet: () => void;
    hideBottomSheet: () => void;
    topSnap: number;
    template: ReactElement;
    increaseTopSnap: () => void;
    decreaseTopSnap: () => void;
}

export type AppLoaderStore = {
    showLoader: () => void;
    hideLoader: () => void;
    isLoading: boolean;
}

export type UiStore = {bottomSheetStore: BottomSheetStore, appLoaderStore: AppLoaderStore, conversionRate: number };

export type rootStore = {
    uiStore: UiStore
}
// TODO: Add all Store types
export type AppRootStore = {rootStore: rootStore}
