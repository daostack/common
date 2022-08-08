import {useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {BottomRightButton} from '~/Components';
import * as ModerationForm from '~/Components/Forms/ModerationForm';
import {/*ACTIONS,*/ TITLES} from '~/Components/Moderation/constants';
import {reporterName, timeReported} from '~/Components/Moderation/helper';
import {NAVIGATION_SCREENS} from '~/Navigation/routes.enum';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import {CommonHeader} from '~/Screens/Commons/CommonProfile/components/CommonHeader';
import {DiscussionList} from '~/Screens/Discussions/DiscussionList';
import ModerationService from '~/Services/ModerationService';
import ModerationFormStore from '~/Stores/FormStores/ModerationFormStore';
import {colors, font} from '~/Theme';
import {useStore} from '~/Util/hooks/useStore';

const moderationFormStore = new ModerationFormStore();

export const CommonDiscussions = observer(() => {
  const navigation = useNavigation();
  const route = useRoute();
  const authStore = useStore('authStore');
  const discussionStore = useStore('discussionStore');
  const proposalStore = useStore('proposalStore');
  const uiStore = useStore('uiStore');
  const commonStore = useStore('commonStore');
  const userStore = useStore('userStore');

  const commonId = route?.params?.commonId;
  const currCommon = commonStore.getCommonById(commonId)!;
  const hasPermission = authStore.getPermission(
    currCommon?.id,
    authStore?.userInfo?.uid,
  );

  const bottomSheetStore = uiStore.bottomSheetStore;

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
    /*const resp =*/ await ModerationService.onModerate(
      actionType,
      itemId,
      commonId,
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
    <View style={[{...styles.container}]}>
      <CommonHeader common={currCommon} title="Discussions" />
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
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc',
  },
  header: {
    backgroundColor: colors.iceBlue,
  },
  screenTitle: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    ...font.primary.regular,
    fontSize: 16,
    color: colors.mainBlue,
    fontWeight: 'bold',
  },
});
