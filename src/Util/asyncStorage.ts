import AsyncStorage from '@react-native-community/async-storage';

import logger from '~/Services/Logger';

const strToNum = (str: string | null): number => Number(str);

export const setCountVisitScreen = async (
  key: string,
  value: number,
): Promise<void> => {
  const count = value.toString();
  try {
    await AsyncStorage.setItem(key, count);
  } catch (e) {
    logger.log(e);
  }
};

export const getCountVisitScreen = async (key: string): Promise<number> => {
  try {
    const countVisitExploreCommons = await AsyncStorage.getItem(key);
    return strToNum(countVisitExploreCommons);
  } catch (e) {
    throw e;
  }
};
