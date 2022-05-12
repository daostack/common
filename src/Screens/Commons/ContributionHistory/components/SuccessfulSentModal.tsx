import {CommonActions, useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import BottomSheetModal from '~/Components/BottomSheetModal';
import {Common} from '~/Stores/Models/Common';
import {colors, font, layout, text} from '~/Theme';
import {sizeM} from '~/Theme/layout';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';

interface Props {
  isVisible: boolean;
  isMonthly: boolean;
  common: Common;
}

export const SuccessfulSentModal = observer(
  ({isVisible, common, isMonthly}: Props) => {
    const navigation = useNavigation();

    const resetNavigation = (): void => {
      navigation.dispatch(
        CommonActions.reset({
          index: 2,
          routes: [
            {
              name: NAVIGATION_SCREENS.COMMON_HOME,
            },
            {
              name: NAVIGATION_SCREENS.COMMON_PROFILE,
              params: {commonId: common.id, common},
            },
            {
              name: NAVIGATION_SCREENS.CONTRIBUTION_HISTORY,
              params: {
                common,
              },
            },
          ],
        }),
      );
    };

    return (
      <BottomSheetModal
        style={styles.bottomSheetContainer}
        isVisible={isVisible}
        onClose={resetNavigation}>
        <Pressable style={{width: '100%'}} onPress={resetNavigation}>
          <View style={styles.plug} />
        </Pressable>
        <View style={styles.contentContainer}>
          <FastImage
            style={styles.image}
            source={require('~/Assets/send.png')}
          />
          <Text style={styles.modalTitle}>
            {isMonthly
              ? `Your monthly Contribution ${'\n'} has been changed`
              : 'Contribution was sent'}
          </Text>
          <TouchableOpacity
            style={styles.modalRequestSentBtnPrimary}
            onPress={resetNavigation}>
            <Text style={text.buttonblack}>OK</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  bottomSheetContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  contentContainer: {
    height: 330,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    top: 0,
    height: 130,
    alignSelf: 'center',
    aspectRatio: 1,
  },
  modalRequestSentBtnPrimary: {
    ...layout.btnOutline,
    ...layout.marginTopL,
    flexGrow: 0,
    width: '100%',
  },
  modalTitle: {
    ...font.fontSize(4),
    textAlign: 'center',
    ...font.heading.bold,
    marginVertical: sizeM,
  },
  plug: {
    backgroundColor: colors.paleblue,
    width: 72,
    height: 6,
    borderRadius: 2,
    alignSelf: 'center',
  },
});
