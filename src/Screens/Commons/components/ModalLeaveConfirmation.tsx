import {useNavigation} from '@react-navigation/native';
import React, {ReactElement} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Common} from '~/Stores/Models/Common';
import {colors, font, layout} from '~/Theme';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';
import {useStore} from '~/Util/hooks/useStore';
import Toast from '~/Util/Toast';

const screenWidth = Dimensions.get('window').width;

interface Props {
  currCommon: Common;
  onCancel: () => void;
  closeModal: () => void;
}

export const ModalLeaveConfirmation = ({
  currCommon,
  onCancel,
  closeModal,
}: Props): ReactElement => {
  const insets = useSafeAreaInsets();
  const commonStore = useStore('commonStore');
  const navigation = useNavigation();

  const onLeave = async () => {
    try {
      closeModal();
      Toast.loading('Leaving');
      await commonStore.leaveCommon(currCommon.id);
      navigation.navigate(NAVIGATION_SCREENS.EXPLORE);
      Toast.done('You left the Common');
    } catch (err) {
      closeModal();
      Toast.error('Could not leave the Common');
    }
  };

  return (
    <View style={[styles.body, {marginBottom: insets.bottom + 16}]}>
      <View style={styles.plug} />
      <Image
        source={require('~/Assets/illustrationsMediumEdit.png')}
        style={styles.image}
      />
      <Text style={styles.title}>
        Are you sure you want to Leave this Common?
      </Text>
      <Text style={styles.text}>
        By leaving the common you will loose your role and voting power. No more
        contributions will be charged
      </Text>
      <>
        <TouchableOpacity
          style={[styles.btn, styles.deleteBtn]}
          onPress={onLeave}>
          <Text style={styles.btnDeleteText}>Leave Common</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={onCancel}>
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 7,
  },
  plug: {
    backgroundColor: colors.paleblue,
    width: 72,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  image: {
    height: 116,
    aspectRatio: 1,
  },
  title: {
    ...font.primary.bold,
    fontSize: 20,
    lineHeight: 28,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  text: {
    ...font.primary.regular,
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 32,
    width: screenWidth * 0.75,
  },
  btn: {
    alignSelf: 'stretch',
    ...layout.content,
    ...layout.flexRow,
    ...layout.flexStart,
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 32,
    borderColor: colors.grey4,
    justifyContent: 'center',
  },
  deleteBtn: {
    marginBottom: 16,
  },
  btnText: {
    textAlign: 'center',
    ...font.primary.regular,
    fontSize: 16,
    lineHeight: 20,
    color: colors.black,
  },
  btnDeleteText: {
    textAlign: 'center',
    ...font.primary.regular,
    fontSize: 16,
    lineHeight: 20,
    color: colors.pinkishOrange,
  },
  bold: {
    ...font.primary.bold,
  },
});
