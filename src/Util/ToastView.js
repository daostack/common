import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Text,
  ViewPropTypes as RNViewPropTypes,
  BackHandler,
} from 'react-native';

import {number, oneOf} from 'prop-types';
const ViewPropTypes = RNViewPropTypes || View.propTypes;
export const DURATION = {
  LENGTH_SHORT: 500,
  FOREVER: 0,
};

const {height} = Dimensions.get('window');

export default class ToastView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      text: '',
      opacityValue: new Animated.Value(this.props.opacity),
    };
  }

  show = (text, duration, callback) => {
    this.duration = typeof duration === 'number' ? duration : DURATION.LENGTH_SHORT;
    this.callback = callback;
    BackHandler.addEventListener('hardwareBackPress', this.androidBackListener);
    this.setState({
      isShow: true,
      text: text,
    });

    this.animation = Animated.timing(
      this.state.opacityValue,
      {
        toValue: this.props.opacity,
        duration: this.props.fadeInDuration,
      }
    );
    this.animation.start(() => {
      this.isShow = true;
      if (duration !== DURATION.FOREVER) {this.close();}
    });
  }

  close = (duration) => {
    let delay = typeof duration === 'undefined' ? this.duration : duration;

    if (delay === DURATION.FOREVER) {delay = this.props.defaultCloseDelay || 250;}

    if (!this.isShow && !this.state.isShow) {return;}
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.animation = Animated.timing(
        this.state.opacityValue,
        {
          toValue: 0.0,
          duration: this.props.fadeOutDuration,
        }
      );
      this.animation.start(() => {
        this.setState({
          isShow: false,
        });
        this.isShow = false;
        if (typeof this.callback === 'function') {
          this.callback();
        }
        BackHandler.removeEventListener('hardwareBackPress', this.androidBackListener);
      });
    }, delay);
  }

  androidBackListener = () => true;

  componentWillUnmount() {
    this.animation && this.animation.stop();
    this.timer && clearTimeout(this.timer);
  }

  getPosition = () => {
    switch (this.props.position) {
    case 'top':
      return this.props.positionValue;
    case 'center':
      return height / 2;
    case 'bottom':
      return height - this.props.positionValue;
    }
  }

  render() {
    return (this.state.isShow
      && <View
        style={styles.container}
        pointerEvents= {this.duration === DURATION.FOREVER ? 'auto' : 'none'}>
        <Animated.View
          style={[styles.content, {opacity: this.state.opacityValue}, this.props.style, {top: this.getPosition()}]}>
          {React.isValidElement(this.state.text) ? this.state.text : <Text style={this.props.textStyle}>{this.state.text}</Text>}
        </Animated.View>
      </View>);
  }
}

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
  },
});

ToastView.propTypes = {
  style: ViewPropTypes.style,
  position: oneOf([
    'top',
    'center',
    'bottom',
  ]),
  textStyle: Text.propTypes.style,
  positionValue: number,
  fadeInDuration: number,
  fadeOutDuration: number,
  opacity: number,
  defaultCloseDelay: number,
};

ToastView.defaultProps = {
  position: 'bottom',
  textStyle: styles.text,
  positionValue: 120,
  fadeInDuration: 500,
  fadeOutDuration: 500,
  opacity: 1,
};
