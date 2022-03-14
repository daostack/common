import {CommonActions, useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import MembershipRequest from '~/Screens/Commons/RequestToJoin/MembershipRequest';
import CommonService from '~/Services/CommonService';
import {STEP_HEADER_BAR_HEIGHT} from '~/Util/constants/header';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';
import {DOT_INFO_PERSONAL_CONTRIBUTION} from '~/Util/constants/stepperNavigation';
import {useStore} from '~/Util/hooks/useStore';
import Toast from '~/Util/Toast';
import {PersonalPaymentDetailsRouteProps} from '../Profile/CommonMembers/types';

const {height} = Dimensions.get('window');

const PersonalPaymentDetailsStep = () => {
  const {
    uiStore: {bottomSheetStore},
    cardStore,
  } = useStore('rootStore');
  const navigation = useNavigation();
  const router = useRoute<PersonalPaymentDetailsRouteProps>();

  const {
    formStores,
    common,
    iFrameLink,
    cardId,
    contributionData,
  } = router.params;

  const insets = useSafeAreaInsets();

  let currCard = cardStore.getCardById(cardId);

  const personalContributionFormStore =
    formStores.personalContributionFormStore;

  const push = async () => {
    try {
      const formData = {
        ...personalContributionFormStore.getFormFieldsJson(),
      } as {amount: number};

      currCard = cardStore.getCardById(cardId);

      Toast.done('Success');
      Toast.hide();

      if (currCard?.token) {
        navigation.dispatch(
          CommonActions.navigate({
            name: NAVIGATION_SCREENS.FULL_SCREEN_CREATION_LOADER,
            params: {
              title: 'Creating your membership request',
            },
          }),
        );
        const createCommonResponse = await CommonService.createCommon(common);
        const data = {
          funding: formData.amount * 100,
          commonId: createCommonResponse.data.id,
        };
        // const createRequestToJoinResponse = await ProposalService.createRequestToJoin(
        //   {
        //     ...data,
        //     description: 'test',
        //     cardId: cardId,
        //   },
        // );
        // if (createRequestToJoinResponse.status === 200) {
        //   const proposalId = createRequestToJoinResponse.data.id;
        //   const navigate = CommonActions.navigate({
        //     name: 'CommonProfile',
        //     params: {
        //       showRequestSentModal: true,
        //       createdProposalId: proposalId,
        //       commonId: data.commonId,
        //     },
        //   });
        //   navigation.dispatch(navigate);
        // } else {
        //   Toast.hide();
        //   showErrorPopUp(bottomSheetStore, createRequestToJoinResponse);
        // }
      }
    } catch (e) {
      Toast.hide();
      navigation?.pop(3);
      bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.BACKEND_ERROR, {
        subTitle: "We couldn't create your common",
        error: e,
      });
    }
  };

  return (
    <StepDotLayout
      navigation={navigation}
      stepDotHeaderTitle="Payment Details"
      navTitle={common.name}
      currentIndex={2}
      headerDotsInfo={DOT_INFO_PERSONAL_CONTRIBUTION}
      layoutTitle={<MembershipRequest />}>
      <View
        style={[
          styles.container,
          {
            height:
              height / 2 + insets.top + insets.bottom + STEP_HEADER_BAR_HEIGHT,
          },
        ]}>
        <WebView
          scalesPageToFit={false}
          source={{uri: iFrameLink}}
          onLoadEnd={() => {
            Toast.done('All done!');
          }}
        />
      </View>
    </StepDotLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default observer(PersonalPaymentDetailsStep);
