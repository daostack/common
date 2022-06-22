import {useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {BottomRightButton} from '~/Components';
import * as ModerationForm from '~/Components/Forms/ModerationForm';
import {ACTIONS, ENTITY_TYPES, TITLES} from '~/Components/Moderation/constants';
import {reporterName, timeReported} from '~/Components/Moderation/helper';
import ModerationActionSuccessModal from '~/Components/Moderation/ModerationActionSuccessModal';
import ModerationModal from '~/Components/Moderation/ModerationModal';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import {CommonHeader} from '~/Screens/Commons/CommonProfile/components/CommonHeader';
import ProposalsList from '~/Screens/Proposals/ProposalsList';
import ModerationService from '~/Services/ModerationService';
import ModerationFormStore from '~/Stores/FormStores/ModerationFormStore';
import {useStore} from '~/Util/hooks/useStore';
import Toast from '~/Util/Toast';

const moderationFormStore = new ModerationFormStore();

export const CommonProposals = observer(() => {
  const navigation = useNavigation();
  const route = useRoute();
  const authStore = useStore('authStore');
  const userStore = useStore('userStore');
  const uiStore = useStore('uiStore');
  const commonStore = useStore('commonStore');

  const commonId = route?.params?.commonId;
  const currCommon = commonStore.getCommonById(commonId)!;
  const isMember = authStore.isDaoMember(currCommon?.members);
  const bottomSheetStore = uiStore.bottomSheetStore;

  const [moderationType, setModerationType] = useState(TITLES.discussion);
  const [hasPermission, setHasPermission] = useState(
    authStore.getPermission(commonId, authStore?.userInfo?.uid),
  );
  const [action, setAction] = useState(ACTIONS.report);
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [showModerationSuccessModal, setShowModerationSuccessModal] =
    useState(false);

  const openCommonOptions = (item = null, itemType = '') => {
    if (item) {
      moderationFormStore.clearFormStoreState();
      moderationFormStore.registerFormField(
        ModerationForm.ITEM_ID,
        'string',
        item.id,
      );
    }
    setModerationType(itemType);

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

  const onModerate = async (actionType, itemType = '', itemId = null) => {
    setAction(actionType);
    bottomSheetStore.hideBottomSheet();
    const resp = await ModerationService.onModerate(
      actionType,
      itemId,
      commonId,
      itemType.toLowerCase(),
    );

    resp === ACTIONS.report
      ? setShowModerationModal(true)
      : resp && setShowModerationSuccessModal(true);
  };

  const membershipRequestType = (itemTitle) =>
    itemTitle === TITLES.membershipRequest ? TITLES.proposals : itemTitle;

  const onReportContent = async () => {
    setShowModerationModal(false);
    bottomSheetStore.hideBottomSheet();
    Toast.loading('Reporting content...');

    try {
      await ModerationService.report(
        membershipRequestType(moderationType).toLowerCase(),
        moderationFormStore.getFormFieldsJson(),
      );
      Toast.hide();
      Toast.success('Done');
      setShowModerationSuccessModal(true);
    } catch (error) {
      Toast.hide();
      Toast.error('Something went wrong');
    }
    moderationFormStore.clearFormStoreState();
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

  const getType = (title) =>
    title === TITLES.proposals ? TITLES.proposalText : title;

  return (
    <View style={styles.container}>
      <CommonHeader common={currCommon} title="Proposals" />
      <ProposalsList
        commonInfo={{
          name: currCommon.name,
          id: currCommon.id,
          balance: currCommon.balance,
        }}
        proposalFilter={{
          type: 'fundingRequest',
        }}
        openCommonOptions={(proposal) =>
          openCommonOptions(proposal, ENTITY_TYPES.proposals)
        }
        showHiddenNote={(hiddenProposal) =>
          showHiddenNote(hiddenProposal, TITLES.proposalText)
        }
        isMember={isMember}
        flatListStyle={styles.proposalsList}
        listContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={true}
      />
      <ModerationModal
        title={moderationType}
        visible={showModerationModal}
        setShowModerationModal={() => setShowModerationModal(false)}
        moderationFormStore={moderationFormStore}
        onReportContent={() => onReportContent()}
        hasPermission={hasPermission}
      />
      <ModerationActionSuccessModal
        type={getType(moderationType)}
        visible={showModerationSuccessModal}
        setShowModerationSuccessModal={() =>
          setShowModerationSuccessModal(false)
        }
        action={action}
      />
      {isMember && (
        <BottomRightButton
          iconName="create-proposal"
          onPress={() =>
            navigation.navigate('FundingProposal', {
              commonId: currCommon.id,
              common: currCommon,
              screenTitle: currCommon.name,
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
    backgroundColor: '#fcfcfc',
    flex: 1,
  },
  proposalsList: {
    paddingHorizontal: 24,
  },
  listContainer: {
    paddingTop: 24,
  },
});
