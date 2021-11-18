import {noop} from 'lodash';
import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Text,
  BackHandler,
  TextStyle,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {CallbackFn, OnCloseFn, OnShowFn} from './ToastDeviceEventEmitter';

export const DURATION = {
  LENGTH_SHORT: 500,
  FOREVER: 0,
};
const {height} = Dimensions.get('window');

const androidBackListener = () => true;

interface ToastViewProps {
  duration?: number;
  opacity?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  position?: 'top' | 'center' | 'bottom';
  positionValue?: number;
  textStyle?: TextStyle;
  defaultCloseDelay?: number;
  style?: ViewStyle;
}

interface UseToastViewReturn {
  ToastViewComponent: React.ReactElement | null;
  show: OnShowFn;
  close: OnCloseFn;
}

export const useToastView = ({
  duration = DURATION.LENGTH_SHORT,
  opacity = 1,
  fadeInDuration = 500,
  fadeOutDuration = 500,
  position = 'bottom',
  positionValue = 120,
  textStyle = styles.text,
  defaultCloseDelay,
  style: outerStyle,
}: ToastViewProps = {}): UseToastViewReturn => {
  const [text, setText] = React.useState('');
  const [isShow, setIsShow] = React.useState<boolean>(false);
  const opacityValue = React.useRef(new Animated.Value(opacity));

  const animation = React.useRef<{
    stop(): void;
    start(onFinished: () => void): void;
  }>();
  const timer = React.useRef<ReturnType<typeof setTimeout>>();
  const cb = React.useRef<() => void>();

  const tearDown = React.useCallback(() => {
    animation.current && animation.current.stop();
    timer.current && clearTimeout(timer.current);
  }, [animation.current, timer.current]);

  React.useEffect(() => tearDown);

  const close = React.useCallback(
    !isShow
      ? noop
      : (delay: number = duration) => {
          timer.current && clearTimeout(timer.current);
          timer.current = setTimeout(
            () => {
              animation.current = Animated.timing(opacityValue.current, {
                toValue: 0.0,
                duration: fadeOutDuration,
                useNativeDriver: true,
              });
              animation.current!.start(() => {
                setIsShow(false);
                if (cb.current && typeof cb.current === 'function') {
                  cb.current();
                }
                BackHandler.removeEventListener(
                  'hardwareBackPress',
                  androidBackListener,
                );
              });
            },
            delay === DURATION.FOREVER ? defaultCloseDelay || 250 : delay,
          );
        },
    [isShow],
  );

  const show: OnShowFn = React.useCallback(
    (
      newTextValue: string,
      delay: number = DURATION.LENGTH_SHORT,
      callback?: CallbackFn,
    ) => {
      cb.current = callback;
      BackHandler.addEventListener('hardwareBackPress', androidBackListener);

      setIsShow(true);
      setText(newTextValue);

      animation.current = Animated.timing(opacityValue.current, {
        toValue: opacity,
        duration: fadeInDuration,
        useNativeDriver: true,
      });

      animation.current?.start(() => {
        setIsShow(true);
        if (delay !== DURATION.FOREVER) {
          close();
        }
      });
    },
    [],
  );

  const style = React.useMemo((): Animated.AnimatedProps<
    StyleProp<ViewStyle>
  > => {
    const getPosition = () => {
      switch (position) {
        case 'top':
          return positionValue;
        case 'center':
          return height / 2;
        case 'bottom':
          return height - positionValue;
      }
    };

    const top = getPosition();
    return {
      ...styles.content,
      ...outerStyle,
      top,
      opacity: opacityValue.current,
    };
  }, [opacityValue, outerStyle, position]);

  const pointerEvents = React.useMemo(
    () => (duration === DURATION.FOREVER ? 'auto' : 'none'),
    [duration],
  );

  return {
    ToastViewComponent: isShow ? (
      <View style={styles.container} pointerEvents={pointerEvents}>
        <Animated.View style={style as StyleProp<ViewStyle>}>
          {React.isValidElement(text) ? (
            text
          ) : (
            <Text style={textStyle}>{text}</Text>
          )}
        </Animated.View>
      </View>
    ) : null,
    close,
    show,
  };
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    elevation: 999,
    alignItems: 'center',
    zIndex: 10000,
    height: height,
  },
  content: {
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 10,
  },
  text: {
    color: 'white',
  } as TextStyle,
});
