import {useNavigation} from '@react-navigation/core';
import {observer} from 'mobx-react';
import React from 'react';
import {BottomRightButton} from '~/Components';
import {BOTTOM_SHEET} from '~/Screens/BottomSheetScreens';
import {useStore} from '~/Stores';

export const AddCommonButton: React.FC = observer(() => {
  const navigation = useNavigation();
  const {
    authStore,
    uiStore: {bottomSheetStore},
  } = useStore();
  React.useEffect(() => {
    if (authStore.signedInUser) {
      navigation.navigate('CommonExplanation');
    }
  }, [authStore.signedInUser]);
  const onAddCommon = React.useCallback(() => {
    if (authStore.signedInUser) {
      navigation.navigate('CommonExplanation');
    } else {
      bottomSheetStore.showBottomSheet(BOTTOM_SHEET.LOGIN_SHEET_SCREEN, {
        message: 'Connect your account to join this Common',
      });
    }
  }, []);

  return <BottomRightButton onPress={onAddCommon} />;
});
