import * as React from 'react';
import { StyleSheet, I18nManager, View, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing as OldEasing,
  // @ts-ignore
  EasingNode,
} from 'react-native-reanimated';
import {text, layout, colors, sizeXS, sizeS, sizeM, sizeL, sizeXL, sizeXXL} from '../../Theme';

import memoize from './memoize';


const Easing = EasingNode || OldEasing;

const { multiply, Extrapolate } = Animated;

// @ts-ignore
const interpolate = Animated.interpolateNode || Animated.interpolate;

export default class TabBarIndicator extends React.Component {
  componentDidMount() {
    this.fadeInIndicator();
  }

  componentDidUpdate() {
    this.fadeInIndicator();
  }

  fadeInIndicator = () => {
    const { navigationState, layout, width, getTabWidth } = this.props;

    if (
      !this.isIndicatorShown &&
      width === 'auto' &&
      layout.width &&
      // We should fade-in the indicator when we have widths for all the tab items
      navigationState.routes.every((_, i) => getTabWidth(i))
    ) {
      this.isIndicatorShown = true;

      Animated.timing(this.opacity, {
        duration: 150,
        toValue: 1,
        easing: Easing.in(Easing.linear),
      }).start();
    }
  };

  isIndicatorShown = false;

  opacity = new Animated.Value(this.props.width === 'auto' ? 0 : 1);

  getTranslateX = memoize(
    ( position,routes,getTabWidth ) => {
      const inputRange = routes.map((_, i) => i);

      // every index contains widths at all previous indices
      const outputRange = routes.reduce((acc, _, i) => {
        if (i === 0) {return [0];}
        return [...acc, acc[i - 1] + getTabWidth(i - 1)];
      }, []);

      const translateX = interpolate(position, {
        inputRange,
        outputRange,
        extrapolate: Extrapolate.CLAMP,
      });

      return multiply(translateX, I18nManager.isRTL ? -1 : 1);
    }
  );

  getWidth = memoize(
    ( position, routes, getTabWidth ) => {
      const inputRange = routes.map((_, i) => i);
      const outputRange = inputRange.map(getTabWidth);

      return interpolate(position, {
        inputRange,
        outputRange,
        extrapolate: Extrapolate.CLAMP,
      });
    }
  );

  render() {
    const {
      position,
      navigationState,
      getTabWidth,
      width,
      style,
      layout,
    } = this.props;
    const { routes } = navigationState;

    const translateX =
      routes.length > 1 ? this.getTranslateX(position, routes, getTabWidth) : 0;

    const indicatorWidth =
      width === 'auto'
        ? routes.length > 1
          ? this.getWidth(position, routes, getTabWidth)
          : getTabWidth(0)
        : width;

    return (
      <Animated.View
        style={[
          styles.indicator,
          // If layout is not available, use `left` property for positioning the indicator
          // This avoids rendering delay until we are able to calculate translateX
          { width: indicatorWidth },

          layout.width
            ? { transform: [{ translateX }] }
            : { left: `${(100 / routes.length) * navigationState.index}%` },
          width === 'auto' ? { opacity: this.opacity } : null,
          style,
        ]}
      >
        <View style={styles.indicatorDot}/>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 26,
    ...layout.content,
    padding: 0,
  },
  indicatorDot: {
    backgroundColor: colors.mainBlue,
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: sizeS,
    marginBottom: sizeS,
  },
});
