import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import BottomSheetModal from '~/Components/BottomSheetModal';
import {CommonBoxCounterBar} from '~/Components/Commons/CommonBox/CommonBoxCounterBar';
import {CommonFundsBox} from '~/Components/Commons/CommonFundsBox';
import {CommonDescription} from '~/Screens/Commons/CommonProfile/CommonDescription';
import {CommonTopTitles} from '~/Screens/Commons/CommonProfile/CommonHeader/CommonTopTitles';
import {MemberConfirmModal} from '~/Screens/Commons/CommonProfile/CommonModals/MemberConfirmModal';
import {CommonProfileFlatList} from '~/Screens/Commons/CommonProfile/CommonProfileFlatList';
import {RequestToJoinBtn} from '~/Screens/Commons/CommonProfile/components/RequestToJoinBtn';
import {ModalCommonOptions} from '~/Screens/Commons/CommonProfile/CommonModals/ModalCommonOptions';
import {ModalDeleteConfirmation} from './CommonModals/ModalDeleteConfirmation';
import {ModalLeaveConfirmation} from './CommonModals/ModalLeaveConfirmation';
import {COMMON_OPTION_TYPES} from '~/Screens/Commons/components/onModalTypes';
import {
  BillingDetailsFormStore,
  IntroduceYourselfFormStore,
  PaymentFormStore,
  PersonalContributionFormStore,
} from '~/Stores/FormStores/RequestToJoin';
import {Common} from '~/Stores/Models/Common';
import {colors, layout} from '~/Theme';
import {NAVIGATION_SCREENS} from '~/Navigation/routes.enum';
import {useStore} from '~/Util/hooks/useStore';
import Toast from '~/Util/Toast';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import {CommonGallery} from '~/Screens/Commons/CommonProfile/CommonGallery';
import {observer} from 'mobx-react';

interface RouteParams {
  commonId: string;
  currCommon: Common;
  showRequestSentModal: boolean;
  createdProposalId: string;
}

export const NewCommonProfile = observer(() => {
  const navigation = useNavigation();
  const route = useRoute();
  const upperRequestToJoinBtnRef = useRef(null);

  const commonStore = useStore('commonStore');
  const authStore = useStore('authStore');
  const uiStore = useStore('uiStore');

  const [deleteScreenOn, setDeleteScreenOn] = useState(false);
  const [leaveScreenOn, setLeaveScreenOn] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [showRequestSentModal, setShowRequestSentModal] = useState(false);

  const params: RouteParams = route!.params;
  const currCommon: Common = commonStore.getCommonById(
    params?.commonId || params?.currCommon?.id,
  )!;
  const commonId = currCommon?.id;
  const [hasPermission, setHasPermission] = useState(
    authStore.getPermission(commonId, authStore.userInfo.uid),
  );
  const bottomSheetStore = uiStore.bottomSheetStore;
  const hasImages = false;

  const openCommonOptionsModal = () => {
    setOptionsModalVisible(true);
  };
  const onEdit = (type: string) => {
    setOptionsModalVisible(false);
    navigation.navigate('EditCommon', {
      currCommon,
      type,
    });
  };

  useEffect(() => {
    setShowRequestSentModal(params.showRequestSentModal);
    if (authStore.userInfo && authStore.isDaoMember(currCommon?.members)) {
      setIsMember(true);
    } else {
      setIsMember(false);
    }
    setHasPermission(
      authStore.getPermission(commonId, authStore?.userInfo?.uid),
    );
  }, [params.showRequestSentModal, authStore.userInfo, currCommon?.members]);

  const onDelete = async () => {
    try {
      setOptionsModalVisible(false);
      Toast.loading('Deleting');
      await commonStore.deleteCommon(commonId);
      navigation.navigate(NAVIGATION_SCREENS.EXPLORE);
      Toast.done('Your Common is deleted');
    } catch (err) {
      setOptionsModalVisible(false);
      Toast.error('Could not delete your Common');
    }
  };

  const onModalOptionsAction = (type: string) => {
    if (
      type === COMMON_OPTION_TYPES.info ||
      type === COMMON_OPTION_TYPES.rules
    ) {
      onEdit(type);
    } else if (type === COMMON_OPTION_TYPES.delete) {
      setDeleteScreenOn(true);
    } else if (type === COMMON_OPTION_TYPES.leave) {
      setLeaveScreenOn(true);
    } else if (type === COMMON_OPTION_TYPES.contributionHistory) {
      setOptionsModalVisible(false);
      navigation.navigate('ContributionHistory', {common: currCommon});
    }
  };

  const onModalCancel = () => {
    setDeleteScreenOn(false);
    setLeaveScreenOn(false);
  };

  const closeCommonOptionsModal = () => {
    setDeleteScreenOn(false);
    setLeaveScreenOn(false);
    setOptionsModalVisible(false);
  };

  const requestToJoin = () => {
    const introduceYourselfFormStore = new IntroduceYourselfFormStore();
    const paymentFormStore = new PaymentFormStore();
    const personalContributionFormStore = new PersonalContributionFormStore();
    const billingDetailsFormStore = new BillingDetailsFormStore();
    if (commonStore.myCommons.length > 0) {
      navigation.navigate('IntroductionStep', {
        formStores: {
          paymentFormStore,
          introduceYourselfFormStore,
          personalContributionFormStore,
          billingDetailsFormStore,
        },
        currCommon,
        skipFirstStep: false,
      });
    } else {
      if (authStore.userInfo) {
        navigation.navigate('FirstJoinCommon', {currCommon});
      } else {
        bottomSheetStore.showBottomSheet(
          BOTTOM_SHEET_TEMPLATES.LOGIN_SHEET_SCREEN,
          {
            goToNextScreen: () =>
              navigation.navigate('FirstJoinCommon', {currCommon}),
          },
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <CommonProfileFlatList
        openCommonOptionsModal={openCommonOptionsModal}
        currCommon={currCommon}
        isMember={isMember}>
        <>
          <CommonTopTitles
            common={currCommon}
            hasPermission={hasPermission}
            isMember={isMember}
          />
          <View style={styles.counterContainer}>
            <CommonBoxCounterBar common={currCommon} />
          </View>
          <View style={styles.summaryContainer}>
            <CommonFundsBox common={currCommon} />
          </View>
          {!isMember && (
            <View
              style={styles.upperActionButtonContainer}
              ref={upperRequestToJoinBtnRef}>
              <RequestToJoinBtn requestToJoin={requestToJoin} />
            </View>
          )}
          <CommonDescription currCommon={currCommon} />
          {hasImages && <CommonGallery />}
        </>
      </CommonProfileFlatList>
      <BottomSheetModal
        style={layout.optionsModal}
        isVisible={optionsModalVisible}
        onClose={closeCommonOptionsModal}>
        <>
          {!deleteScreenOn && !leaveScreenOn ? (
            <ModalCommonOptions
              currCommon={currCommon}
              commonMembersCount={currCommon?.members?.length}
              isFounderOrModerator={hasPermission}
              onAction={onModalOptionsAction}
              closeModal={closeCommonOptionsModal}
              isMember={isMember}
            />
          ) : deleteScreenOn ? (
            <ModalDeleteConfirmation
              onDelete={onDelete}
              onCancel={onModalCancel}
            />
          ) : (
            leaveScreenOn && (
              <ModalLeaveConfirmation
                currCommon={currCommon}
                closeModal={closeCommonOptionsModal}
                onCancel={onModalCancel}
              />
            )
          )}
        </>
      </BottomSheetModal>
      <MemberConfirmModal
        showRequestSentModal={showRequestSentModal}
        closeModal={() => setShowRequestSentModal(false)}
        createdProposalId={params.createdProposalId}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  upperActionButtonContainer: {
    paddingHorizontal: 15,
    marginTop: 18,
  },
  summaryContainer: {
    backgroundColor: colors.white,
  },
  counterContainer: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
  },
});
