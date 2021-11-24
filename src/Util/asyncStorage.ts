import AsyncStorage from '@react-native-community/async-storage';

import logger from '~/Services/Logger';

const strToNum = (str: string | null): number => Number(str);

export interface StorageData {
  isCalled: string;
  visitCounter: number;
}

export const setStorageDataVisitScreen = async (
  key: string,
  value: StorageData,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    logger.log(e);
  }
};

export const getStorageDataVisitScreen = async (
  key: string,
): Promise<StorageData> => {
  try {
    const jsonStorageDataVisitScreen = await AsyncStorage.getItem(key);
    const storageDataVisitScreen =
      jsonStorageDataVisitScreen != null
        ? JSON.parse(jsonStorageDataVisitScreen)
        : null;
    return storageDataVisitScreen
      ? {
          ...storageDataVisitScreen,
          visitCounter: strToNum(storageDataVisitScreen.visitCounter),
        }
      : null;
  } catch (e) {
    throw e;
  }
};
