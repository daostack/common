import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Share from 'react-native-share';
import logger from '~/Services/Logger';
import {COMMON_OPTION_TYPES} from '~/Screens/Commons/components/onModalTypes';
import {colors, font, layout, text} from '~/Theme';
import {
  DYNAMIC_LINKS_TYPES,
  DYNAMIC_LINK_URI_PREFIX,
} from '~/Util/constants/dynamicLinks';
import {Common} from '~/Stores/Models/Common';
import dynamicLinks from '@react-native-firebase/dynamic-links';

interface Props {
  onAction: (action: string) => void;
  commonMembersCount: number;
  isFounderOrModerator: string;
  currCommon: Common;
  closeModal: () => void;
  isMember: boolean;
}

export const ModalCommonOptions = ({
  onAction,
  commonMembersCount,
  isFounderOrModerator,
  currCommon,
  closeModal,
  isMember,
}: Props) => {
  const insets = useSafeAreaInsets();
  const shareCommon = async () => {
    closeModal();
    try {
      const url = await dynamicLinks().buildShortLink({
        link: `${DYNAMIC_LINK_URI_PREFIX}/${DYNAMIC_LINKS_TYPES.COMMON}/${currCommon.id}`,
        domainUriPrefix: DYNAMIC_LINK_URI_PREFIX,
        social: {
          title: currCommon.name,
          descriptionText: currCommon.metadata.description,
          imageUrl: currCommon.image,
        },
      });
      const options = {
        url,
        title: currCommon.name,
        message: 'Download the Common app to join now.',
      };
      Share.open(options);
    } catch (err) {
      logger.log('Deep Linking works only in production');
    }
  };

  const onCommonWallet = () => {
    closeModal();
    // screen Common Wallet to be implemented
    // navigation.navigate(NAVIGATION_SCREENS.COMMON_WALLET);
  };

  return (
    <View style={[styles.body, {marginBottom: insets.bottom + 16}]}>
      <View style={styles.plug} />
      <Text style={styles.text}>Options</Text>
      <>
        <TouchableOpacity style={styles.optionBtn} onPress={shareCommon}>
          <Text style={styles.btnText}>Share Common</Text>
        </TouchableOpacity>
        {isMember && (
          <TouchableOpacity
            style={styles.optionBtn}
            onPress={() => onAction(COMMON_OPTION_TYPES.contributionHistory)}>
            <Text style={styles.btnText}>My Contributions</Text>
          </TouchableOpacity>
        )}
        {/* disabled till we get the screen */}
        {false && (
          <>
            <TouchableOpacity style={styles.optionBtn} onPress={onCommonWallet}>
              <Text style={styles.btnText}>Common Wallet</Text>
            </TouchableOpacity>
          </>
        )}
        {isMember && commonMembersCount > 1 && (
          <TouchableOpacity
            style={styles.optionBtn}
            onPress={() => onAction(COMMON_OPTION_TYPES.leave)}>
            <Text style={styles.btnText}>Leave Common</Text>
          </TouchableOpacity>
        )}
        {isFounderOrModerator && (
          <TouchableOpacity
            style={styles.optionBtn}
            onPress={() => onAction(COMMON_OPTION_TYPES.info)}>
            <Text style={styles.btnText}>Edit Agenda</Text>
          </TouchableOpacity>
        )}
        {isFounderOrModerator && commonMembersCount <= 1 && (
          <TouchableOpacity
            style={styles.optionBtn}
            onPress={() => onAction(COMMON_OPTION_TYPES.delete)}>
            <Text style={styles.btnOptionText}>Delete Common</Text>
          </TouchableOpacity>
        )}
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  sheetTextStyle: {
    ...text.greyText,
    ...text.centered,
  },
  body: {
    width: '100%',
  },
  optionBtn: {
    alignSelf: 'stretch',
    ...layout.content,
    ...layout.flexRow,
    ...layout.flexStart,
    paddingVertical: 22,
    paddingHorizontal: 16,
  },
  text: {
    ...font.primary.bold,
    fontSize: 20,
    lineHeight: 28,
    alignSelf: 'center',
    marginBottom: 24,
  },
  btnText: {
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 16,
    lineHeight: 20,
    color: colors.black,
  },
  btnOptionText: {
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 16,
    lineHeight: 20,
    color: colors.pinkishOrange,
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
});
