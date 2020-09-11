class logger {

	log = (...message) => __DEV__ && console.log(this.inputToString(message));

	error = (...error) => __DEV__ && console.error(this.inputToString(error));

	info = (...info) => __DEV__ && console.info(this.inputToString(info));

	warn = (...warning) => __DEV__ && console.warn(this.inputToString(warning));

  inputToString = (input) => (
    input.length === 1
      ? input[0]
      : input.map((arg) => (
        arg = typeof arg === 'object'
          ? JSON.stringify(arg)
          : arg
      )).join(' ')
  )

}

export default new logger();



