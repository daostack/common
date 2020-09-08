import AsyncStorage from '@react-native-community/async-storage';

export default class Cache {

  static set = async (key, value) => {
    try {
      let storeValue = value;
      if (typeof (value) === 'object') {
        storeValue = JSON.stringify(value);
      }
      await AsyncStorage.setItem(key, storeValue);
    } catch (e) {
      throw e;
    }
  }

  static get = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value != null ? JSON.parse(value) : null;
    } catch (e) {
      throw e;
    }
  }

  static getAsync = (key) => {
    try {
      return AsyncStorage.getItem(key);
    } catch (e) {
      throw e;
    }
  }
}
