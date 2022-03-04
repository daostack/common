import {CommonActions, useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import {omit} from 'lodash';
import {bool, func, object, shape, string} from 'prop-types';
import React, {useEffect} from 'react';
import {Dimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import ProposalService from '~/Services/ProposalService';
import {rootStorePropTypes} from '~/Types/propTypes';
import {showErrorPopUp} from '~/Util';
import {DOT_INFO_PERSONAL_CONTRIBUTION} from '~/Util/constants/stepperNavigation';
import {STEP_HEADER_BAR_HEIGHT} from '~/Util/constants/header';
import Toast from '~/Util/Toast';
import MembershipRequest from '~/Screens/Commons/RequestToJoin/MembershipRequest';
import CommonService from '~/Services/CommonService';
import {useStore} from '~/Util/hooks/useStore';

const {height} = Dimensions.get('window');

const PersonalPaymentDetailsStep = ({
  route: {
    params: {formStores, common, iFrameLink, cardId},
  },
}) => {
  const {
    authStore: {userInfo},
    uiStore: {bottomSheetStore},
    cardStore,
  } = useStore('rootStore');
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

  let currCard = cardStore.getCardById(cardId);

  useEffect(() => {
    const unsubscribeFromCard = cardStore.subscribeToCard(cardId);
    return () => {
      unsubscribeFromCard && unsubscribeFromCard();
    };
  }, [userInfo]);

  useEffect(() => {
    if (currCard?.token) {
      push();
    }
  }, [currCard?.token]);

  const personalContributionFormStore =
    formStores.personalContributionFormStore;

  const push = async () => {
    try {
      const formData = {
        ...personalContributionFormStore.getFormFieldsJson(),
      };

      currCard = cardStore.getCardById(cardId);

      Toast.done('Success');
      Toast.hide();

      if (currCard.token) {
        navigation.navigate({
          name: 'FullScreenCreationLoader',
          params: {
            title: 'Creating your membership request',
          },
        });

        const createCommonResponse = await CommonService.createCommon(
          omit(common, ['metadata', 'minFeeToJoinFormatted']),
        );

        const data = {
          funding: formData.amount * 100,
          commonId: createCommonResponse.data.id,
        };
        const createRequestToJoinResponse = await ProposalService.createRequestToJoin(
          {
            ...data,
            description: 'test',
            cardId: cardId,
          },
        );
        if (createRequestToJoinResponse.status === 200) {
          const proposalId = createRequestToJoinResponse.data.id;

          const navigate = CommonActions.navigate({
            name: 'CommonProfile',
            params: {
              showRequestSentModal: true,
              createdProposalId: proposalId,
              commonId: data.commonId,
            },
          });

          navigation.dispatch(navigate);
        } else {
          Toast.hide();
          showErrorPopUp(bottomSheetStore, createRequestToJoinResponse);
        }
      }
    } catch (e) {
      Toast.hide();
      navigation.pop();
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
        style={{
          height:
            height / 2 + insets.top + insets.bottom + STEP_HEADER_BAR_HEIGHT,
          width: '100%',
        }}>
        <WebView
          scalesPageToFit={false}
          source={{uri: iFrameLink}}
          onLoadEnd={(syntheticEvent) => {
            Toast.done('All done!');
          }}
        />
      </View>
    </StepDotLayout>
  );
};

PersonalPaymentDetailsStep.propTypes = {
  navigation: object,
  route: shape({
    params: shape({
      skipFirstStep: bool,
      currDaoId: string,
      refreshFeed: func,
    }),
  }),
  paymentFormStore: shape({
    isFormValid: func,
    getFormFieldsJson: func,
    isFormActionEnabled: func,
  }),
  introduceYourselfFormStore: shape({
    getFormFieldsJson: func,
  }),
  personalContributionFormStore: shape({
    getFormFieldsJson: func,
    form: object,
  }),
  rootStore: rootStorePropTypes,
};

export default observer(PersonalPaymentDetailsStep);
