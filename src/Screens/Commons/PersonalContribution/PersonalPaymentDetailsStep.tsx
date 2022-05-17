import {useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import {PersonalContributionTitle} from './PersonalContributionTitle';
import PaymentsService from '~/Services/PaymentsService';
import {STEP_HEADER_BAR_HEIGHT} from '~/Util/constants/header';
import {PAYMENT_STATUSES} from '~/Util/constants/paymentConstants';
import {DOT_INFO_PERSONAL_CONTRIBUTION} from '~/Util/constants/stepperNavigation';
import Toast from '~/Util/Toast';
import {PersonalPaymentDetailsRouteProps} from '../CommonProfile/CommonMembers/types';
import {CommonCreatedModal} from './CommonCreatedModal';

const {height} = Dimensions.get('window');

const PersonalPaymentDetailsStep = () => {
  const navigation = useNavigation();
  const router = useRoute<PersonalPaymentDetailsRouteProps>();

  const {common, iFrameLink, paymentId} = router.params;

  const insets = useSafeAreaInsets();
  const [isVisibleFinishModal, setVisibleFinishModal] = useState<boolean>(
    false,
  );

  useEffect(() => {
    PaymentsService.subscribeToPaymentById(
      paymentId,
      (snapshot: {_data: {status: string}}) => {
        if (snapshot?._data?.status === PAYMENT_STATUSES.CONFIRMED) {
          setVisibleFinishModal(true);
        }
      },
    );
  }, [paymentId]);

  return (
    <StepDotLayout
      navigation={navigation}
      stepDotHeaderTitle="Payment Details"
      navTitle={common.name}
      currentIndex={2}
      goBack={() => navigation.pop(2)}
      headerDotsInfo={DOT_INFO_PERSONAL_CONTRIBUTION}
      prependedArea={
        <CommonCreatedModal
          isVisible={isVisibleFinishModal}
          commonId={common.id}
          commonInfo={{
            name: common.name,
            description: common.description,
            image: common.image,
          }}
        />
      }
      isFullWidthProgressBar={false}
      layoutTitle={<PersonalContributionTitle />}>
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
