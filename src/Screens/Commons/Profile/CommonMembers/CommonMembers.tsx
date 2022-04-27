import React, {useState, ReactElement} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  ScrollView,
  View,
  Dimensions,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {TabView} from 'react-native-tab-view';
import {observer, inject} from 'mobx-react';

import * as ModerationForm from '~/Components/Forms/ModerationForm';
import CommonMembersList from '../CommonMembersList';
import CommonTabBar from '../../../CommonTabBar';
import {PROPOSAL_TYPE, PROPOSAL_STAGE} from '~/Config';
import {STORE_KEYS} from '~/Util/constants/storeKeys';
import {CommonMembersRouteProps, CommonMembersProps} from './types';
import {History} from './Components/History';
import {Pending} from './Components/Pending';
import {styles} from './styles';
import ModerationActionSuccessModal from '~/Components/Moderation/ModerationActionSuccessModal';
import ModerationModal from '~/Components/Moderation/ModerationModal';
import ModerationService from '~/Services/ModerationService';
import ModerationFormStore from '~/Stores/FormStores/ModerationFormStore';
import Toast from '~/Util/Toast';
import {ACTIONS, ENTITY_TYPES, TITLES} from '~/Components/Moderation/constants';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';

const initialLayout = {width: Dimensions.get('window').width};

const getTabName = (objectName: string, count: number): string =>
  `${objectName} (${count ? count : 0})`;

const CommonMembers = ({rootStore}: CommonMembersProps) => {
  const proposalStore = rootStore.proposalStore;
  const commonStore = rootStore.commonStore;
  const router = useRoute<CommonMembersRouteProps>();
  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;

  const {commonId, hasPermission, showHiddenNote, isMember} = router.params;
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [showModerationSuccessModal, setShowModerationSuccessModal] = useState(
    false,
  );
  const [moderationFormStore] = useState(new ModerationFormStore());
  const [index, setIndex] = useState(0);
  const pendingCount = proposalStore.getCommonProposals(commonId, {
    stage: PROPOSAL_STAGE.Active,
    type: PROPOSAL_TYPE.Join,
  }).length;
  const historyCount = proposalStore.getCommonProposals(commonId, {
    stage: PROPOSAL_STAGE.History,
    type: PROPOSAL_TYPE.Join,
  }).length;
  const membersCount = commonStore.getCommonById(commonId)?.members.length;

  const routes = [
    {
      key: 'members',
      title: getTabName('Members', membersCount),
    },
    {key: 'pending', title: getTabName('Pending', pendingCount)},
    {key: 'history', title: getTabName('History', historyCount)},
  ];

  const renderScene = ({
    route,
  }: {
    route: {key: string; title: string};
  }): ReactElement | null => {
    switch (route.key) {
      case 'members':
        return <CommonMembersList commonId={commonId} />;
      case 'pending':
        return (
          <Pending
            commonId={commonId}
            hasPermission={hasPermission}
            openCommonOptions={openCommonOptions}
            showHiddenNote={showHiddenNote}
            isMember={isMember}
          />
        );
      case 'history':
        return <History commonId={commonId} />;
      default:
        return null;
    }
  };

  const openCommonOptions = (item = null) => {
    if (item) {
      moderationFormStore.clearFormStoreState();
      moderationFormStore.registerFormField(
        ModerationForm.ITEM_ID,
        'string',
        item.id,
      );
    }

    bottomSheetStore.showBottomSheet(
      BOTTOM_SHEET_TEMPLATES.SCREEN_COMMON_PROFILE_OPTIONS(item, hasPermission),
      {
        onAction: (type) => onEdit(type, item),
        hasPermission,
        moderatorOptions: {
          item,
          isMember,
        },
      },
    );
  };

  const onEdit = async (type, item) => {
    if (type === ACTIONS.report) {
      bottomSheetStore.hideBottomSheet();
      setShowModerationModal(true);
    } else if (type === ACTIONS.hide) {
      bottomSheetStore.hideBottomSheet();
      await ModerationService.onModerate(
        ACTIONS.hide,
        item.id,
        commonId,
        ENTITY_TYPES.proposals.toLowerCase(),
      );
    } else if (type === ACTIONS.show) {
      bottomSheetStore.hideBottomSheet();
      await ModerationService.onModerate(
        ACTIONS.show,
        item.id,
        commonId,
        ENTITY_TYPES.proposals.toLowerCase(),
      );
    }
  };

  const onReportContent = async () => {
    setShowModerationModal(false);
    Toast.loading('Reporting content...');
    bottomSheetStore.hideBottomSheet();
    try {
      await ModerationService.report(
        TITLES.discussionMessage,
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

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ModerationModal
        visible={showModerationModal}
        setShowModerationModal={() => setShowModerationModal(false)}
        moderationFormStore={moderationFormStore}
        onReportContent={() => onReportContent()}
        hasPermission={hasPermission}
      />
      <ModerationActionSuccessModal
        visible={showModerationSuccessModal}
        setShowModerationSuccessModal={() =>
          setShowModerationSuccessModal(false)
        }
        action={ACTIONS.report}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          nestedScrollEnabled={true}
          directionalLockEnabled={true}>
          <View style={styles.sectionContainer}>
            <Text style={styles.title}>Members</Text>
          </View>

          <View style={styles.sectionTabView}>
            <TabView
              navigationState={{index, routes}}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={initialLayout}
              renderTabBar={CommonTabBar}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default inject('rootStore')(
  observer((props: Omit<CommonMembersProps, STORE_KEYS>) => (
    <CommonMembers {...(props as CommonMembersProps)} />
  )),
);
