import React, {useState, useEffect} from 'react';
import {View, Dimensions} from 'react-native';
//import {colors, text} from '~/Theme';
import {inject} from 'mobx-react';
import {CommonActions} from '@react-navigation/native';
import RequestStepActionButton from '../../RequestStepActionButton';
import {string, func, bool, object, shape} from 'prop-types';
import MembershipRequest from '../MembershipRequest';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import {rootStorePropTypes} from '~/Types/propTypes';
import {WebView} from 'react-native-webview';
import ProposalService from '~/Services/ProposalService';
import {escapeUrl} from '~/Util';
import Toast from '~/Util/Toast';
import {showErrorPopUp} from '~/Util';
const {height} = Dimensions.get('window');

const PaymentDetailsStep = ({
  navigation,
  route: {
    params: {
      formStores,
      skipFirstStep,
      currCommon,
      currDaoId,
      refreshFeed,
      iFrameLink,
      cardId,
      skipPaymentStep,
    },
  },
  rootStore,
}) => {
  const userInfo = rootStore.authStore.userInfo;
  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;
  const [respLink, setRespLink] = useState('');
  const cardStore = rootStore.cardStore;
  let currCard = cardStore.getCardById(cardId);

  useEffect(() => {
    const unsubscribeFromCard = cardStore.subscribeToCard(cardId);
    return () => {
      unsubscribeFromCard && unsubscribeFromCard();
    };
  }, [userInfo, respLink]);

  useEffect(() => {
 }, [cardStore?.data?.size]);

  const introduceYourselfFormStore = formStores.introduceYourselfFormStore;
  const personalContributionFormStore =
    formStores.personalContributionFormStore;
  const billingDetailsFormStore = formStores.billingDetailsFormStore;

  const push = async () => {
    try {
      const formData = {
        ...introduceYourselfFormStore.getFormFieldsJson(),
        ...personalContributionFormStore.getFormFieldsJson(),
        ...billingDetailsFormStore.getFormFieldsJson(),
      };

      const data = {
        description: formData.intro,
        funding: formData.amount * 100,
        commonId: currDaoId,
      };

      if (formData.links) {
        data.links = escapeUrl(formData.links);
      }

      currCard = cardStore.getCardById(cardId);

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
          },
        });

        if (typeof refreshFeed === 'function') {
          refreshFeed();
        }

          navigation.dispatch(navigate);
        } else {
          showErrorPopUp(bottomSheetStore, createRequestToJoinResponse);
        }
      } else {

      }
    } catch (e) {
      navigation.pop();
      bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.BACKEND_ERROR, {
        subTitle: "We couldn't create your proposal",
        error: e,
      });
    }
  };

  const onMessage = async (event) => {
    console.log('On Message', event);
  };

  const redirectUser = (event) => {
    if (event === 'skipped' && !respLink) {
      setRespLink(true);
      push();
    }
    if (!respLink) {
      if (event.title.includes('loader')) {
        setRespLink(true);
      }
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
      layoutTitle={<MembershipRequest />}
      requestStepActionButton={
         <RequestStepActionButton
           title="Continue"
           disabled={!respLink}
           onPress={push}
         />
       }
    >
      <View style={{height: height / 2, width: '90%'}}>
        {
          <WebView
            scalesPageToFit={false}
            source={{uri: iFrameLink}}
            onMessage={(m) => onMessage(m)}
            onNavigationStateChange={(event) => {
              if (skipPaymentStep) {
                redirectUser('skipped');
              } else {
                redirectUser(event);
              }
            }}
            onLoadEnd={(syntheticEvent) => {
              Toast.done('All done!');
            }}
          />
        }
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
  billingDetailsFormStore: shape({
    getFormFieldsJson: func,
    form: object,
  }),
  rootStore: rootStorePropTypes,
};

export default inject('rootStore')(PaymentDetailsStep);
