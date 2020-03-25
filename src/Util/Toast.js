import {useRef, useEffect} from 'react';
import {NativeModules, BackHandler} from 'react-native';
const {ToastHybrid} = NativeModules;

export default class Toast {
  constructor() {
    this.underlying = null;
    this.closed = false;
    this.timer = null;
  }
  static config(options = {}) {
    ToastHybrid.config(options);
  }
  static text(text, duration = 2000) {
    new Toast().text(text, duration);
  }
  static info(text) {
    new Toast().info(text);
  }
  static done(text) {
    new Toast().done(text);
  }
  static error(text) {
    new Toast().error(text);
  }
  static loading(text) {
    return new Toast().loading(text);
  }
  async ensure() {
    if (this.underlying !== null) {
      const key = await this.underlying;
      const underlying = ToastHybrid.ensure(key);
      this.underlying = underlying;
      return underlying;
    }
    const underlying = ToastHybrid.create();
    this.underlying = underlying;
    return underlying;
  }
  loading(text) {
    if (!this.closed) {
      this.clearTimeout();
      this.ensure().then(key => {
        this.clearTimeout();
        ToastHybrid.loading(key, text);
      });
    }
    return this;
  }
  clearTimeout() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
  text(text, duration = 2000) {
    return this.show(ToastHybrid.text, text, duration);
  }
  show(fn, text, duration) {
    if (!this.closed) {
      this.clearTimeout();
      this.ensure().then(key => {
        if (!this.closed) {
          fn(key, text);
          this.clearTimeout();
          this.timer = setTimeout(() => this.hide(), duration);
        } else {
          this.hide();
        }
      });
    }
    return this;
  }
  info(text, duration = 2000) {
    return this.show(ToastHybrid.info, text, duration);
  }
  done(text, duration = 2000) {
    return this.show(ToastHybrid.done, text, duration);
  }
  error(text, duration = 2000) {
    return this.show(ToastHybrid.error, text, duration);
  }

  hide() {
    this.clearTimeout();
    if (this.underlying !== null) {
      this.underlying.then(key => {
        ToastHybrid.hide(key);
      });
      this.underlying = null;
    }
  }

  shutdown() {
    this.closed = true;
    this.hide();
  }
}

export function useToast() {
  const toastRef = useRef(new Toast());
  useEffect(() => {
    const toast = toastRef.current;
    return () => {
    //   toast.shutdown();
    };
  }, []);
  useEffect(() => {
    function handleHardwareBack() {
      const toast = toastRef.current;
      if (toast.underlying !== null) {
        toast.hide();
        return true;
      }
      return false;
    }
    BackHandler.addEventListener('hardwareBackPress', handleHardwareBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleHardwareBack);
    };
  }, []);
  return toastRef.current;
}
