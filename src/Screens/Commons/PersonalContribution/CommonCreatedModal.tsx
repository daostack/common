import dynamicLinks from '@react-native-firebase/dynamic-links';
import {
  CommonActions,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import React, {ReactElement} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import Share from 'react-native-share';
import SentTemplate from '~/Components/ModalTemplates/SentTemplate';
import logger from '~/Services/Logger';
import {colors, layout, text} from '~/Theme';
import {
  DYNAMIC_LINKS_TYPES,
  DYNAMIC_LINK_URI_PREFIX,
} from '~/Util/constants/dynamicLinks';

interface Props {
  isVisible: boolean;
  commonId: string;
  commonInfo: {
    name: string;
    description: string;
    image: string;
  };
}

export function CommonCreatedModal({
  isVisible,
  commonId,
  commonInfo,
}: Props): ReactElement {
  const navigation = useNavigation();

  const goToCommon = (): void => {
    const navigate = CommonActions.navigate({
      name: 'CommonProfile',
      params: {
        commonId: commonId.toLowerCase(),
      },
    });
    navigation?.popToTop();
    navigation.dispatch(navigate);
  };

  const shareCommon = async (): Promise<void> => {
    try {
      const {name, description, image} = commonInfo;
      const currCommonId = commonId.toLowerCase();
      const url = await dynamicLinks().buildShortLink({
        link: `${DYNAMIC_LINK_URI_PREFIX}/${DYNAMIC_LINKS_TYPES.COMMON}/${currCommonId}`,
        domainUriPrefix: DYNAMIC_LINK_URI_PREFIX,
        social: {
          title: name,
          descriptionText: description,
          imageUrl: image,
        },
      });
      const options = {
        url,
        title: "Let's make it happen",
        message: `${name} common`,
      };
      Share.open(options);
    } catch (err) {
      logger.log('Deep Linking works only in production');
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      avoidKeyboard={true}
      backdropColor={colors.white}
      backdropOpacity={1}
      style={{padding: 0}}>
      <SentTemplate
        isCommonCreation={true}
        title="Your journey starts now"
        description="Your Common is ready. Spread the word and invite others to join you. You can always share it later."
        onClose={() => navigation.dispatch(StackActions.popToTop())}>
        <View style={styles.shareContainer}>
          <TouchableOpacity
            style={styles.modalRequestSentBtnPrimary}
            onPress={shareCommon}>
            <Text style={text.buttoncenterwhite}>Share now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalRequestSentBtnOutline}
            onPress={goToCommon}>
            <Text style={text.buttonblue}>Go to Common</Text>
          </TouchableOpacity>
        </View>
      </SentTemplate>
    </Modal>
  );
}

const styles = StyleSheet.create({
  shareContainer: {
    flexDirection: 'column',
  },
  modalRequestSentBtnOutline: {
    ...layout.btnOutline,
    ...layout.marginTopL,
    flexGrow: 0,
    width: '100%',
    alignSelf: 'stretch',
  },
  modalRequestSentBtnPrimary: {
    ...layout.btnPrimary,
    ...layout.marginTopL,
    flexGrow: 0,
    width: '100%',
  },
});
