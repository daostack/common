import {useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomRightButton} from '~/Components';
import {/*ACTIONS, */ TITLES} from '~/Components/Moderation/constants';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import DiscussionList from '~/Screens/Discussions/DiscussionList';
import ModerationFormStore from '~/Stores/FormStores/ModerationFormStore';
import {sizeL, text} from '~/Theme';
import {useStore} from '~/Util/hooks/useStore';
import * as ModerationForm from '~/Components/Forms/ModerationForm';
import ModerationService from '~/Services/ModerationService';
import {NAVIGATION_SCREENS} from '~/Navigation/routes.enum';
import {reporterName, timeReported} from '~/Components/Moderation/helper';

const moderationFormStore = new ModerationFormStore();

export const CommonDiscussions = observer(() => {
  const navigation = useNavigation();
  const route = useRoute();
  const rootStore = useStore('rootStore');
  const authStore = useStore('authStore');
  const discussionStore = useStore('discussionStore');
  const proposalStore = useStore('proposalStore');
  const userStore = useStore('userStore');
  const insets = useSafeAreaInsets();
  const {currCommon} = route.params;

  /*const [action, setAction] = useState(ACTIONS.report);
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [showModerationSuccessModal, setShowModerationSuccessModal] =
    useState(false);
  const [moderationType, setModerationType] = useState(TITLES.discussion);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);*/
  const hasPermission = authStore.getPermission(
    currCommon?.id,
    authStore?.userInfo?.uid,
  );

  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;

  const isMember = authStore.isDaoMember(currCommon?.members);
  const membershipRequestType = (itemTitle) =>
    itemTitle === TITLES.membershipRequest ? TITLES.proposals : itemTitle;

  useEffect(() => {
    let unsubscribeFromCommonProposals = null;
    let unsubscribeFromCommonDiscussions = null;
    if (currCommon?.id) {
      unsubscribeFromCommonProposals = proposalStore.subscribeToCommonProposals(
        currCommon?.id,
      );
      unsubscribeFromCommonDiscussions =
        discussionStore.subscribeToCommonDiscussions(currCommon?.id);
    }
    return () => {
      unsubscribeFromCommonProposals && unsubscribeFromCommonProposals();
      unsubscribeFromCommonDiscussions && unsubscribeFromCommonDiscussions();
    };
  }, [currCommon]);

  const openCommonOptions = (item = null, itemType = '') => {
    if (item) {
      moderationFormStore.clearFormStoreState();
      moderationFormStore.registerFormField(
        ModerationForm.ITEM_ID,
        'string',
        item.id,
      );
    }
    //setModerationType(itemType);

    bottomSheetStore.showBottomSheet(
      BOTTOM_SHEET_TEMPLATES.SCREEN_COMMON_PROFILE_OPTIONS(item, hasPermission),
      {
        onAction: item
          ? (actionType) =>
              onModerate(actionType, membershipRequestType(itemType), item.id)
          : (type) => onEdit(type),
        hasPermission,
        hasShare: true,
        moderatorOptions: {
          item,
          isMember,
        },
      },
    );
  };

  const showHiddenNote = ({hiddenItem, isModerator = false}, type) => {
    const {moderation} = hiddenItem;
    bottomSheetStore.showBottomSheet(
      BOTTOM_SHEET_TEMPLATES.HIDDEN_CONTENT_INFO,
      {
        userName: reporterName(
          userStore.getUserById(moderation.moderator),
          authStore.userInfo?.uid,
        ),
        date: timeReported(moderation.updatedAt),
        reasons: moderation.reasons,
        moderatorNote: moderation?.moderatorNote,
        type,
        isModerator,
      },
    );
  };

  const onModerate = async (actionType, itemType = '', itemId = null) => {
    //setAction(actionType);
    bottomSheetStore.hideBottomSheet();
    /*const resp = */ await ModerationService.onModerate(
      actionType,
      itemId,
      currCommon?.id,
      itemType.toLowerCase(),
    );

    /*resp === ACTIONS.report
      ? setShowModerationModal(true)
      : resp && setShowModerationSuccessModal(true);*/
  };

  const onEdit = (type) => {
    //setOptionsModalVisible(false);
    navigateTo(type);
  };

  const navigateTo = (type) => {
    navigation.navigate(NAVIGATION_SCREENS.EDIT_COMMON, {
      currCommon: currCommon,
      type: type,
    });
  };

  return (
    <View style={[{...styles.paleBackground}, {paddingTop: insets.top}]}>
      <Text style={text.h1BlackTitle}>Discussions</Text>
      <DiscussionList
        commonId={currCommon.id}
        openCommonOptions={(discussion) =>
          openCommonOptions(discussion, TITLES.discussion)
        }
        showHiddenNote={(hiddenDiscussion) =>
          showHiddenNote(hiddenDiscussion, TITLES.discussion)
        }
        isMember={isMember}
      />
      {isMember && (
        <BottomRightButton
          iconName="add-proposal-32"
          onPress={() =>
            navigation.navigate('NewDiscussion', {
              commonId: currCommon.id,
            })
          }
          bottom={30}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  paleBackground: {
    flex: 1,
    backgroundColor: '#fcfcfc',
    paddingHorizontal: sizeL,
  },
});
