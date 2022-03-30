import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {Divider} from '~/Components/Divider';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import UpdatePaymentMethod from '~/Components/Payment/UpdatePaymentMethod';
//import {Card} from '~/Stores/Models/Card';
import {text} from '~/Theme';
import {baseMargin} from '~/Theme/layout';
import {DOT_INFO_PERSONAL_CONTRIBUTION} from '~/Util/constants/stepperNavigation';
import {useStore} from '~/Util/hooks/useStore';
import {v4} from 'uuid';
import PaymentService from '~/Services/PaymentsService';
import Toast from '~/Util/Toast';
//import logger from '~/Services/Logger';
import {WebView} from 'react-native-webview';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {STEP_HEADER_BAR_HEIGHT} from '~/Util/constants/header';
import Loader from '~/Components/Loader';

const {height} = Dimensions.get('window');

const ChoosePaymentMethodStep = () => {
  const cardStore = useStore('cardStore');
  const navigation = useNavigation();
  const [iFrame, setIFrame] = useState('');
  const [newCard, setNewCard] = useState(null);
  const [respLink, setRespLink] = useState(false);
  const insets = useSafeAreaInsets();
  const cardId = v4();

  useEffect(() => {
    (async () => {
      const {data} = await PaymentService.createBuyerTokenPage(cardId);
      console.log('tkt data', data.link);
      setIFrame(data.link);
    })();
  }, []);

  useEffect(() => {
    // not good cuz token exists, handle in load webview
    if (newCard?.token) {
      //push();
    }
  }, [newCard?.token]);

  const redirectUser = (event) => {
    //console.log('event', event, 'respLink');
    if (!respLink) {
      if (event?.url?.includes('loader')) {
        setNewCard(cardStore.getCardById(cardId));
        setRespLink(true);
      }
    }
  };

  const renderWebView = () =>
    iFrame ? (
      <View style={{width: '100%', height: '80%', backgroundColor: 'pink'}}>
        <WebView
          scalesPageToFit={false}
          source={{uri: iFrame}}
          onNavigationStateChange={(event) => {
            redirectUser(event);
          }}
          onLoadEnd={(syntheticEvent) => {
            Toast.done('All done!');
          }}
        />
      </View>
    ) : (
      <Loader />
    );

  return (
    <StepDotLayout
      navigation={navigation}
      stepDotHeaderTitle="Payment Details"
      currentIndex={2}
      headerDotsInfo={DOT_INFO_PERSONAL_CONTRIBUTION}
      layoutTitle={<UpdatePaymentMethod />}>
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
});

export default observer(ChoosePaymentMethodStep);
