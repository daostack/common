import {useNavigation, useRoute, CommonActions} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Divider} from '~/Components/Divider';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import {CardList} from '~/Components/Payment/CardList';
import {PaymentDetailsHeader} from '~/Components/Payment/PaymentDetailsHeader';
import MembershipRequest from '~/Screens/Commons/RequestToJoin/MembershipRequest';
import {Card} from '~/Stores/Models/Card';
import {colors} from '~/Theme';
import {baseMargin} from '~/Theme/layout';
import {DOT_INFO_PERSONAL_CONTRIBUTION} from '~/Util/constants/stepperNavigation';
import {PersonalPaymentDetailsRouteProps} from '../Profile/CommonMembers/types';
import {v4} from 'uuid';
import PaymentService from '~/Services/PaymentsService';
import Toast from '~/Util/Toast';

const ChoosePaymentMethodStep = () => {
  const navigation = useNavigation();
  const router = useRoute<PersonalPaymentDetailsRouteProps>();

  const {common, formStores} = router.params;

  const [selectedCard, setSelectedCard] = useState<Card>();

  function handleSelectCard(card: Card): void {
    setSelectedCard(card);
  }

  async function handleReplacePaymentMethod(): Promise<void> {
    Toast.loading('One moment please');
    const cardId = v4();
    const {data} = await PaymentService.createBuyerTokenPage(cardId);
    const link = data.link;

    Toast.done('Success');
    Toast.hide();
    navigation.dispatch(
      CommonActions.navigate({
        name: 'PersonalPaymentDetailsStep',
        params: {
          formStores,
          common,
          iFrameLink: link,
          cardId: selectedCard?.id,
        },
      }),
    );
  }

  return (
    <StepDotLayout
      navigation={navigation}
      stepDotHeaderTitle="Payment Details"
      navTitle={common.name}
      currentIndex={2}
      headerDotsInfo={DOT_INFO_PERSONAL_CONTRIBUTION}
      layoutTitle={<MembershipRequest />}>
      <View style={styles.container}>
        <PaymentDetailsHeader
          minFeeToJoin={common.minFeeToJoin}
          contributionType={common.contributionType}
        />
        <Divider mt={baseMargin * 3} mb={baseMargin * 2} />
        <CardList handleSelectCard={handleSelectCard} />
        <Pressable
          onPress={handleReplacePaymentMethod}
          style={({pressed}) => [
            {
              opacity: pressed ? 0.5 : 1.0,
            },
            {marginTop: baseMargin * 2},
          ]}>
          <Text style={{color: colors.linkBlue}}>Replace payment method?</Text>
        </Pressable>
      </View>
    </StepDotLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default observer(ChoosePaymentMethodStep);
