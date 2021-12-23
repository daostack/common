import React, {useState} from 'react';
import {View, Dimensions} from 'react-native';
//import {colors, text} from '~/Theme';
import {inject} from 'mobx-react';
import {CommonActions} from '@react-navigation/native';
//import RequestStepActionButton from '../../RequestStepActionButton';
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
    },
  },
  rootStore,
}) => {
  const userInfo = rootStore.authStore.userInfo;
  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;
  const [respLink, setRespLink] = useState('');

  const isMonthly = currCommon.metadata.contributionType === 'monthly';

  const paymentFormStore = formStores.paymentFormStore;
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

      //const resp = await BillingDetailsService.add(billingDetailsFormStore.getFormFieldsJson());
      /*navigation.navigate({
        name: 'FullScreenCreationLoader',
        params: {
          title: 'Creating your membership request',
        },
      });*/

      /*const createdCard = await CirclePayService.createCard({
        ...formData,
        links: escapeUrl(formData.links),
        ...userInfo,
      });*/

      const createRequestToJoinResponse = await ProposalService.createRequestToJoin(
        {
          ...data,
          cardId: userInfo.uid,
        },
      );

      if (createRequestToJoinResponse.status === 200) {
        const proposalId = createRequestToJoinResponse.data.id;

        //navigation.pop();
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
        navigation.pop();
        showErrorPopUp(bottomSheetStore, createRequestToJoinResponse);
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
    if (!respLink) {
      if (event.title === 'Google') {
        console.log('event', event.url);
        setRespLink(event.url);
        push();
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
      /*requestStepActionButton={
        <RequestStepActionButton
          title="Pay Now"
          formStore={paymentFormStore}
          onPress={push}
        />
      }*/
    >
      <View style={{height: height / 2, width: '90%'}}>
        {
          <WebView
            scalesPageToFit={false}
            source={{uri: iFrameLink}}
            onMessage={(m) => onMessage(m)}
            onNavigationStateChange={(event) => {
              redirectUser(event);
            }}
            onLoadEnd={(syntheticEvent) => {
              Toast.done();
              // update component to be aware of loading status
              //const {nativeEvent} = syntheticEvent;
              //this.isLoading = nativeEvent.loading;
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
