import auth from '@react-native-firebase/auth';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {inject, observer} from 'mobx-react';
import {object, shape, string} from 'prop-types';
import React, {useEffect, useState} from 'react';
import {Dimensions, SafeAreaView, StyleSheet, View} from 'react-native';
import ImageView from 'react-native-image-viewing';
import * as ModerationForm from '~/Components/Forms/ModerationForm';
import Loader from '~/Components/Loader';
import {ACTIONS, TITLES} from '~/Components/Moderation/constants';
import ModerationActionSuccessModal from '~/Components/Moderation/ModerationActionSuccessModal';
import ModerationModal from '~/Components/Moderation/ModerationModal';
import ModerationFormStore from '~/FormStores/ModerationFormStore';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import ModerationService from '~/Services/ModerationService';
import {colors, layout} from '~/Theme';
import {rootStorePropTypes} from '~/Types/propTypes';
import Toast from '~/Util/Toast.js';
import {DiscussionChat} from './DiscussionChat';
import {DiscussionHeader} from './DiscussionHeader';

const {width} = Dimensions.get('window');

const Discussions = ({
  navigation,
  route: {
    params: {commonId, discussionId, fromNotificationItem},
  },
  rootStore,
}) => {
  const discussionStore = rootStore.discussionStore;
  const authStore = rootStore.authStore;
  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;

  const currentUser = auth().currentUser;

  const dataState = discussionStore.getDiscussionById(discussionId);

  if (!commonId && dataState) {
    commonId = dataState.commonId;
  }
  const hasPermission = authStore.getPermission(
    commonId,
    authStore?.userInfo?.uid,
  );
  const [imageGalleryIndex, setImageGalleryIndex] = useState(-1);
  const [moderationFormStore] = useState(new ModerationFormStore());
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [showModerationSuccessModal, setShowModerationSuccessModal] =
    useState(false);
  const [action, setAction] = useState(ACTIONS.report);

  useEffect(() => {}, [commonId, discussionId, currentUser]);

  useEffect(() => {
    let unsubscribeFromDiscussionMessages = null;
    if (fromNotificationItem) {
      unsubscribeFromDiscussionMessages =
        rootStore.discussionMessageStore.subscribeToProposalDiscussionMessages(
          discussionId,
        );
    }

    return () => {
      unsubscribeFromDiscussionMessages && unsubscribeFromDiscussionMessages();
    };
  }, [discussionId]);

  const handleImageGallery = (index) => {
    setImageGalleryIndex(index);
  };

  /**
   * For discussionMessages
   * @param  {[type]} actionType [description]
   * @param  {[type]} messageId  [description]
   * @return {[type]}            [description]
   */
  const onModerate = async (actionType, messageId) => {
    setAction(actionType);
    if (messageId) {
      moderationFormStore.registerFormField(
        ModerationForm.ITEM_ID,
        'string',
        messageId,
      );
    }
    bottomSheetStore.hideBottomSheet();

    const resp = await ModerationService.onModerate(
      actionType,
      messageId,
      commonId,
      TITLES.discussionMessage,
    );

    resp === ACTIONS.report
      ? setShowModerationModal(true)
      : resp && setShowModerationSuccessModal(true);
  };

  const openMessageOptions = (message, itemType) => {
    bottomSheetStore.showBottomSheet(
      BOTTOM_SHEET_TEMPLATES.SCREEN_COMMON_PROFILE_OPTIONS,
      {
        onAction: (actionType) => onModerate(actionType, message.id),
        hasPermission,
        moderatorOptions: {
          item: message,
        },
      },
    );
  };

  const onReportContent = async () => {
    setShowModerationModal(false);
    Toast.loading('Reporting content...');
    bottomSheetStore.hideBottomSheet();
    await ModerationService.report(
      TITLES.discussionMessage,
      commonId,
      moderationFormStore.getFormFieldsJson(),
    );
    Toast.hide();
    Toast.success('Done');
    setShowModerationSuccessModal(true);
    moderationFormStore.clearFormStoreState();
  };

  if (!dataState) {
    return (
      <View style={{...styles.safeView, ...layout.content}}>
        <Loader />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeView}>
      <DiscussionHeader
        rootStore={rootStore}
        discussionId={discussionId}
        commonId={commonId}
        fromNotificationItem={fromNotificationItem}
        handleImageGallery={handleImageGallery}
      />
      <ModerationModal
        title={TITLES.comment}
        visible={showModerationModal}
        setShowModerationModal={() => setShowModerationModal(false)}
        moderationFormStore={moderationFormStore}
        onReportContent={() => onReportContent()}
        hasPermission={hasPermission}
      />
      <ModerationActionSuccessModal
        type={TITLES.comment.toLowerCase()}
        visible={showModerationSuccessModal}
        setShowModerationSuccessModal={() =>
          setShowModerationSuccessModal(false)
        }
        action={action}
      />
      <DiscussionChat
        commonId={commonId}
        discussionId={discussionId}
        fromNotificationItem={fromNotificationItem}
        isHeaderExpanded={dataState.isExpanded}
        openMessageOptions={openMessageOptions}
      />
      <ImageView
        images={
          dataState.images ? dataState.images.map((x) => ({uri: x.value})) : []
        }
        imageIndex={imageGalleryIndex}
        visible={imageGalleryIndex > -1}
        onRequestClose={() => setImageGalleryIndex(-1)}
        // FooterComponent={ImageGalleryFooter}
      />
    </SafeAreaView>
  );
};

Discussions.propTypes = {
  rootStore: rootStorePropTypes.isRequired,
  navigation: object,
  route: shape({
    params: shape({
      commonId: string,
      discussionId: string,
    }),
  }),
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default inject('rootStore')(observer(Discussions));
