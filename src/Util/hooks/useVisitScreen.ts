import {useState, useEffect, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import {
  setStorageDataVisitScreen,
  getStorageDataVisitScreen,
  StorageData,
} from '~/Util/asyncStorage';
import {STORAGE_KEYS} from '~/Util/constants/storageKeys.enum';
import logger from '~/Services/Logger';

interface Props {
  signedInUser: string;
  callback: Function;
  callbackDependencies: string[];
  callbackCondition: boolean;
  storageKey: STORAGE_KEYS;
  numberOfVisits: number;
}

export const useVisitScreen = ({
  signedInUser,
  callback,
  callbackDependencies,
  callbackCondition,
  storageKey,
  numberOfVisits,
}: Props) => {
  const [visitCounter, setVisitCounter] = useState(0);

  const handleCounter = async (
    storageDataVisitScreen: StorageData,
  ): Promise<void> => {
    if (storageDataVisitScreen.isCalled === 'false') {
      await setStorageDataVisitScreen(storageKey, {
        isCalled: 'false',
        visitCounter: storageDataVisitScreen.visitCounter + 1,
      });
      setVisitCounter(storageDataVisitScreen.visitCounter);
    } else {
      setVisitCounter(storageDataVisitScreen.visitCounter + 1);
    }
  };

  const checkNumberOfVisits = async (
    storageDataVisitScreen: StorageData,
  ): Promise<void> => {
    if (storageDataVisitScreen.visitCounter === numberOfVisits) {
      await setStorageDataVisitScreen(storageKey, {
        isCalled: 'true',
        visitCounter: storageDataVisitScreen.visitCounter + 1,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      const checkCountVisitScreen = async () => {
        try {
          const storageDataVisitScreen = await getStorageDataVisitScreen(
            storageKey,
          );
          if (storageDataVisitScreen) {
            await handleCounter(storageDataVisitScreen);
            await checkNumberOfVisits(storageDataVisitScreen);
          } else {
            await setStorageDataVisitScreen(storageKey, {
              isCalled: 'false',
              visitCounter: 1,
            });
            setVisitCounter(1);
          }
        } catch (e) {
          logger.log(e);
        }
      };

      signedInUser && checkCountVisitScreen();
    }, [signedInUser]),
  );

  useEffect(() => {
    if (visitCounter === numberOfVisits && callbackCondition) {
      callback();
    }
  }, [...callbackDependencies, visitCounter]);
};
