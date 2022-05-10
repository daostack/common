import {useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';
import RequestStepHeaderTitle from '~/Screens/Commons/RequestToJoin/RequestStepHeaderTitle';
import {v4} from 'uuid';
import {Divider} from '~/Components/Divider';
import Loader from '~/Components/Loader';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import PaymentService from '~/Services/PaymentsService';
import {colors, text} from '~/Theme';
import {baseMargin} from '~/Theme/layout';
import {RouteProps} from '~/Types/navigation';
import {useStore} from '~/Util/hooks/useStore';

const UpdatePaymentDetails = () => {
  const {uiStore} = useStore('rootStore');
  const navigation = useNavigation();
  const route = useRoute<RouteProps<{commonName: string}>>();
  const {commonName} = route.params;
  const [iFrame, setIFrame] = useState('');
  const [respLink, setRespLink] = useState(false);
  const cardId = useRef(v4());
  const bottomSheetStore = uiStore.bottomSheetStore;

  useEffect(() => {
    navigation.setOptions({
      title: commonName,
    });
  }, [commonName]);

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={{paddingHorizontal: 24, marginTop: 24}}>
        <RequestStepHeaderTitle
          title="Payment Details"
          subtitle="Update your payment details below."
          subtitleStyle={styles.subtitle}
        />
        <Divider mt={0} mb={baseMargin * 2} />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          backgroundColor: '#fff',
        }}
        scrollEventThrottle={16}>
        <View style={styles.iFrame}>
          {iFrame ? (
            <WebView
              scalesPageToFit={false}
              source={{uri: iFrame}}
              onNavigationStateChange={(event) => {
                redirectUser(event);
              }}
            />
          ) : (
            <Loader />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    ...text.h2Black,
    paddingVertical: 10,
  },
  subtitle: {
    lineHeight: 20,
    marginTop: baseMargin * 2,
    color: colors.greySubtitle,
  },
  iFrame: {
    width: '100%',
    height: '100%',
  },
});

export default observer(UpdatePaymentDetails);
