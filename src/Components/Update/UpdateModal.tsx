import axios from 'axios';
import compareVersions from 'compare-versions';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getVersion} from 'react-native-device-info';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomSheetModal from '~/Components/BottomSheetModal';
import {metadataUrl} from '~/Config';
import {colors, font, layout} from '~/Theme';

interface Props {
  moderatorOptions: null;
  onAction: (action: string) => void;
  hasPermission: boolean;
  commonMembersCount: number;
  isFounderOrModerator: boolean;
}

export const UpdateModal = ({}: Props) => {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const {data: metadataResponse} = await axios.get(
          `${metadataUrl()}/app`,
        );

        const requiresNewerVersion = compareVersions.compare(
          getVersion(),
          metadataResponse.oldestSupportedVersion,
          '<',
        );

        setModalVisible(!requiresNewerVersion);
      } catch (e) {
        console.warn(
          'An error occurred while trying to retrieve the latest app version',
          e,
        );
      }
    })();
  }, []);

  const closeCommonOptionsModal = () => {
    setModalVisible(false);
  };

  return (
    <BottomSheetModal
      style={styles.optionsModal}
      isVisible={modalVisible}
      onClose={closeCommonOptionsModal}>
      <View style={[styles.body, {marginBottom: insets.bottom + 16}]}>
        <View style={styles.plug} />
        <Image source={require('~/Assets/launch.png')} style={styles.image} />
        <Text style={styles.title}>New version available</Text>
        <Text style={styles.text}>Update for better experience</Text>
        <TouchableOpacity style={styles.btn} onPress={closeCommonOptionsModal}>
          <Text style={styles.btnDeleteText}>Done</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
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
  },
  image: {
    height: 145,
    aspectRatio: 1,
  },
  title: {
    ...font.heading.newBold,
    fontSize: 20,
    lineHeight: 24,
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  text: {
    ...font.primary.regular,
    fontSize: 16,
    lineHeight: 19.2,
    textAlign: 'center',
    marginBottom: 24,
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
    backgroundColor: colors.mainBlue,
    justifyContent: 'center',
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
    color: colors.white,
  },
  bold: {
    ...font.primary.bold,
  },
  optionsModal: {
    borderRadius: 27,
    padding: 16,
  },
});
