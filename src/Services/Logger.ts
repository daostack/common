class logger {
  log = (...message: any) => __DEV__ && console.log(...message);

  error = (...error: any) => __DEV__ && console.error(...error);

  info = (...info: any) => __DEV__ && console.info(...info);

  warn = (...warning: any) => __DEV__ && console.warn(...warning);
}

export default new logger();
