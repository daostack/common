import AsyncStorage from '@react-native-community/async-storage';

import logger from '~/Services/Logger';

const strToNum = (str: string | null): number => Number(str);

type storageData = {
  isModalWasShown: string;
  visitCounter: number;
};

export const setStorageDataVisitScreen = async (
  key: string,
  value: storageData,
): Promise<void> => {
  try {
    const storageValue = {
      ...value,
      visitCounter: value.visitCounter.toString(),
    };
    const jsonValue = JSON.stringify(storageValue);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    logger.log(e);
  }
};

export const getStorageDataVisitScreen = async (
  key: string,
): Promise<storageData> => {
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
