class logger {

	off = () => __DEV__ = true;

  log = (...message) => __DEV__ && console.log(...message);

  error = (...error) => __DEV__ && console.error(...error);

  info = (...info) => __DEV__ && console.info(...info);

  warn = (...warning) => __DEV__ && console.warn(...warning);
}

export default new logger();



