import {CommonActions, useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import {bool, func, object, shape, string} from 'prop-types';
import React, {useEffect} from 'react';
import {Dimensions, Text, View, Image, Pressable} from 'react-native';
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
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';
import {PersonalPaymentDetailsRouteProps} from '../Profile/CommonMembers/types';
import {colors, font} from '~/Theme';
import {CurrencySymbols} from '~/Util/locale';

const {height} = Dimensions.get('window');

const PersonalPaymentDetailsStep = () => {
  const {
    authStore: {userInfo},
    uiStore: {bottomSheetStore},
    cardStore,
  } = useStore('rootStore');
  const navigation = useNavigation();
  const router = useRoute<PersonalPaymentDetailsRouteProps>();

  const {formStores, common, iFrameLink, cardId, contributionData} =
    router.params;

  const insets = useSafeAreaInsets();

  let currCard = cardStore.getCardById(cardId);

  console.log('----currCard', currCard, contributionData);

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
      // const formData = {
      //   ...personalContributionFormStore.getFormFieldsJson(),
      // } as {amount: number};

      currCard = cardStore.getCardById(cardId);

      Toast.done('Success');
      Toast.hide();

      if (currCard?.token) {
        // navigation.dispatch(
        //   CommonActions.navigate({
        //     name: NAVIGATION_SCREENS.FULL_SCREEN_CREATION_LOADER,
        //     params: {
        //       title: 'Creating your membership request',
        //     },
        //   }),
        // );
        // const createCommonResponse = await CommonService.createCommon(common);
        // const data = {
        //   funding: formData.amount * 100,
        //   commonId: createCommonResponse.data.id,
        // };
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
        style={{
          height:
            height / 2 + insets.top + insets.bottom + STEP_HEADER_BAR_HEIGHT,
          width: '100%',
        }}>
        <Text
          style={{
            color: colors.black,
            fontSize: 16,
            textAlign: 'center',
            marginBottom: 8,
            ...font.heading.bold,
          }}>
          Payment Details
        </Text>
        <Text style={{color: colors.black, fontSize: 16, textAlign: 'center'}}>
          You are contributing{' '}
          <Text style={{color: colors.mainBlue}}>
            {CurrencySymbols.SHEKEL}
            {contributionData.minFeeToJoin / 100} (
            {contributionData.contributionType}){' '}
          </Text>
          to this {'\n'} Common.
          <Text style={{color: colors.black, ...font.primary.bold}}>
            {' '}
            You will not be charged until another member joins
          </Text>{' '}
          the Common
        </Text>
        <View
          style={{
            width: '100%',
            borderBottomWidth: 1,
            borderColor: colors.grey4,
            marginTop: 24,
            marginBottom: 16,
          }}
        />
        <Text
          style={{
            color: colors.black,
            fontSize: 16,
            marginBottom: 16,
            ...font.heading.bold,
          }}>
          Payment method
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            style={{width: 64, height: 32, marginRight: 12}}
            source={require('~/Assets/mastercard.png')}
            resizeMode="cover"
          />
          <View style={{flexDirection: 'row', flex: 1}}>
            <View>
              <Text
                style={{
                  marginBottom: 4,
                  fontSize: 14,
                  color: colors.black,
                  ...font.primary.bold,
                }}>
                TEst Testovich
              </Text>
              <Text style={{fontSize: 14, color: colors.black}}>
                ********{currCard?.metadata?.digits}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black,
                }}>
                01/2030
              </Text>
            </View>
          </View>
        </View>
        <Pressable
          style={({pressed}) => [
            {
              opacity: pressed ? 0.5 : 1.0,
            },
            {marginTop: 16},
          ]}>
          <Text style={{color: colors.linkBlue}}>Replace payment method?</Text>
        </Pressable>
        {/* <WebView
          scalesPageToFit={false}
          source={{uri: iFrameLink}}
          onLoadEnd={() => {
            Toast.done('All done!');
          }}
        /> */}
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
