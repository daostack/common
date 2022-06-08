import {useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import {CardItem} from '~/Components/Payment/CardItem';
import {colors, text, font} from '~/Theme';
import {baseMargin} from '~/Theme/layout';
import {ContributionPaymentDetailsRouteProps} from '~/Types/navigation';
import {NAVIGATION_SCREENS} from '~/Navigation/routes.enum';
import {useStore} from '~/Util/hooks/useStore';

const ContributionPaymentDetails = () => {
  const navigation = useNavigation();
  const router = useRoute<ContributionPaymentDetailsRouteProps>();
  const {
    authStore: {userInfo},
    cardStore,
  } = useStore('rootStore');
  const currCard = cardStore.getCurrentCard(userInfo?.uid);

  const {commonName} = router.params;

  useEffect(() => {
    navigation.setOptions({
      title: commonName,
    });
  }, [commonName]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>
      <CardItem
        card={currCard}
        navigationScreen={NAVIGATION_SCREENS.UPDATE_PAYMENT_DETAILS}
        navigationParams={{
          commonName,
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    ...font.primary.bold,
    ...font.fontSize(3),
    marginTop: baseMargin * 3,
    paddingHorizontal: 24,
  },
  monthlyBottomMessage: {
    ...text.regularText,
    textAlign: 'center',
    color: colors.slate,
    marginBottom: 10,
  },
});

export default observer(ContributionPaymentDetails);
