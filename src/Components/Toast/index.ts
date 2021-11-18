import React, {useEffect} from 'react';
import {DeviceEventEmitter} from 'react-native';
import {useToastView} from './useToastView';

export const DURATION = {
  LENGTH_SHORT: 500,
  FOREVER: 0,
};

export const ToastView: React.FC = () => {
  const {ToastViewComponent, close, show} = useToastView({
    style: {backgroundColor: 'transparent'},
    positionValue: 160,
  });

  useEffect(() => {
    const showListener = DeviceEventEmitter.addListener(
      'HUD',
      (content, isLoading = false) => {
        show(content, isLoading ? DURATION.FOREVER : 1500);
      },
    );
    const hideListener = DeviceEventEmitter.addListener('HideHUD', () => {
      close();
    });
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return ToastViewComponent;
};

export * from './Toast';
