import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {Divider} from '~/Components/Divider';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import UpdatePaymentMethod from '~/Components/Payment/UpdatePaymentMethod';
import {text} from '~/Theme';
import {baseMargin} from '~/Theme/layout';
import {DOT_INFO_PERSONAL_CONTRIBUTION} from '~/Util/constants/stepperNavigation';
import {useStore} from '~/Util/hooks/useStore';
import {v4} from 'uuid';
import PaymentService from '~/Services/PaymentsService';
import {WebView} from 'react-native-webview';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {STEP_HEADER_BAR_HEIGHT} from '~/Util/constants/header';
import Loader from '~/Components/Loader';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';

const {height} = Dimensions.get('window');

const ChoosePaymentMethodStep = () => {
  const {uiStore} = useStore('rootStore');
  const navigation = useNavigation();
  const [iFrame, setIFrame] = useState('');
  const [respLink, setRespLink] = useState(false);
  const insets = useSafeAreaInsets();
  const cardId = useRef(v4());
  const bottomSheetStore = uiStore.bottomSheetStore;

  useEffect(() => {
    (async () => {
      const {data} = await PaymentService.createBuyerTokenPage(cardId.current);
      setIFrame(data.link);
    })();
  }, []);

  const redirectUser = (event: any) => {
    if (!respLink) {
      if (event?.url?.includes('loader')) {
        setRespLink(true);
      }
    } else {
      bottomSheetStore.showBottomSheet(
        BOTTOM_SHEET_TEMPLATES.PAYMENT_UPDATE_STATUS,
        {
          navigation: navigation,
          message: 'Payment method updated', // need to handle errors here
          proceed: onProceed,
        },
      );
    }
  };

  const onProceed = () => {
    bottomSheetStore.hideBottomSheet();
    navigation.goBack();
  };

  const renderWebView = () =>
    iFrame ? (
      <View style={styles.iFrame}>
        <WebView
          scalesPageToFit={false}
          source={{uri: iFrame}}
          onNavigationStateChange={(event) => {
            redirectUser(event);
          }}
        />
      </View>
    ) : (
      <View style={styles.iFrame}>
        <Loader />
      </View>
    );

  return (
    <StepDotLayout
      navigation={navigation}
      stepDotHeaderTitle="Payment Details"
      currentIndex={2}
      headerDotsInfo={DOT_INFO_PERSONAL_CONTRIBUTION}
      layoutTitle={<UpdatePaymentMethod />}
      hideHeader>
      <View
        style={{
          ...styles.container,
          height:
            height / 2 + insets.top + insets.bottom + STEP_HEADER_BAR_HEIGHT,
        }}>
        <Text style={styles.title}>Payment Details</Text>
        <Text style={styles.subTitle}>Update your payment details below</Text>
        <Divider mt={baseMargin * 3} mb={baseMargin * 2} />
        {renderWebView()}
      </View>
    </StepDotLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
  },
  title: {
    ...text.h2Black,
    paddingVertical: 10,
  },
  subTitle: {
    ...text.greyText,
    fontSize: 18,
  },
  iFrame: {
    width: '100%',
    height: '80%',
  },
});

export default observer(ChoosePaymentMethodStep);
