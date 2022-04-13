import {CommonActions} from '@react-navigation/native';
import {inject} from 'mobx-react';
import {observer} from 'mobx-react-lite';
import {bool, func, object, shape, string} from 'prop-types';
import React, {useEffect} from 'react';
import {Dimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import ProposalService from '~/Services/ProposalService';
import {rootStorePropTypes} from '~/Types/propTypes';
import {escapeUrl, showErrorPopUp} from '~/Util';
import {STEP_HEADER_BAR_HEIGHT} from '~/Util/constants/header';
import Toast from '~/Util/Toast';
import MembershipRequest from '../MembershipRequest';

const {height} = Dimensions.get('window');

const PaymentDetailsStep = ({
  navigation,
  route: {
    params: {
      formStores,
      skipFirstStep,
      currCommon,
      commonId,
      refreshFeed,
      iFrameLink,
      cardId,
    },
  },
  rootStore,
}) => {
  const userInfo = rootStore.authStore.userInfo;
  const cardStore = rootStore.cardStore;
  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;

  const insets = useSafeAreaInsets();

  let currCard = cardStore.getCardById(cardId);

  useEffect(() => {
    let unsubscribeFromCard = null;
    if (userInfo?.uid) {
      unsubscribeFromCard = cardStore.subscribeToUserCards(userInfo.uid);
    }
    return () => {
      unsubscribeFromCard && unsubscribeFromCard();
    };
  }, [userInfo]);

  useEffect(() => {
    if (currCard?.token) {
      push();
    }
  }, [currCard?.token]);

  const introduceYourselfFormStore = formStores.introduceYourselfFormStore;
  const personalContributionFormStore =
    formStores.personalContributionFormStore;

  const push = async () => {
    try {
      const formData = {
        ...introduceYourselfFormStore.getFormFieldsJson(),
        ...personalContributionFormStore.getFormFieldsJson(),
      };

      const data = {
        description: formData.intro,
        funding: formData.amount * 100,
        commonId,
      };

      if (formData.links) {
        data.links = escapeUrl(formData.links);
      }

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

        const createRequestToJoinResponse = await ProposalService.createRequestToJoin(
          {
            ...data,
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
              commonId,
            },
          });

          if (typeof refreshFeed === 'function') {
            refreshFeed();
          }

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
        subTitle: "We couldn't create your proposal",
        error: e,
      });
    }
  };

  return (
    <StepDotLayout
      navigation={navigation}
      stepDotHeaderTitle="Payment Details"
      navTitle={currCommon.name}
      currentIndex={5}
      skipFirstStep={skipFirstStep}
      isRequestToJoin={true}
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

PaymentDetailsStep.propTypes = {
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

export default inject('rootStore')(observer(PaymentDetailsStep));
