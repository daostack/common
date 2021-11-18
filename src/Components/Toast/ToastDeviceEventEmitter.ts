import React from 'react';
import {DeviceEventEmitter} from 'react-native';

export type CallbackFn = () => void;

export type OnShowFn = (
  newTextValue: string,
  delay?: number,
  callback?: CallbackFn,
) => void;
export type OnCloseFn = (delay?: number) => void;

export const showHud = (v: React.ReactElement) => {
  DeviceEventEmitter.emit('HUD', v);
};

export const showLoading = (v: React.ReactElement) => {
  DeviceEventEmitter.emit('HUD', v, true);
};

export const showListener = (onShow: OnShowFn) =>
  DeviceEventEmitter.addListener('HUD', onShow);

export const hideListener = (onClose: OnCloseFn) =>
  DeviceEventEmitter.addListener('HideHUD', onClose);
