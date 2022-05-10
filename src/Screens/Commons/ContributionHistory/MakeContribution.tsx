import {useNavigation, useRoute, CommonActions} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import AmountField from '~/Components/FormFields/AmountField';
import RequestToJoinForm from '~/Components/Forms/RequestToJoinForm';
import RequestStepHeaderTitle from '~/Screens/Commons/RequestToJoin/RequestStepHeaderTitle';
import RequestStepActionButton from '~/Screens/Commons/RequestStepActionButton';
import logger from '~/Services/Logger';
import {colors, font, text} from '~/Theme';
import {MakeContributionRouteProps} from '~/Types/navigation';
import {showErrorPopUp} from '~/Util';
import {formatMinFeeToJoin} from '~/Util/FormatUtil';
import {useStore} from '~/Util/hooks/useStore';
import Toast from '~/Util/Toast';
import CommonService from '~/Services/CommonService';
import SubscriptionService from '~/Services/SubscriptionService';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';
import {baseMargin, sizeM} from '~/Theme/layout';
import {layout} from '~/Theme';
import {CurrencySymbols} from '~/Util/locale';
import SentTemplate from '~/Components/ModalTemplates/SentTemplate';
import BottomSheetModal from '~/Components/BottomSheetModal';
import FastImage from 'react-native-fast-image';

const MakeContribution = () => {
  const navigation = useNavigation();
  const router = useRoute<MakeContributionRouteProps>();
  const {
    uiStore: {bottomSheetStore},
  } = useStore('rootStore');
  const [isVisible, setVisible] = useState(false);

  const {common, isMonthly, formStores, subscriptionId} = router.params;

  useEffect(() => {
    navigation.setOptions({
      title: common.name,
    });
  }, [common.name]);

  const [isActionBtnHidden, setIsActionBtnHidden] = useState<boolean>(true);
  const zeroContribution = isMonthly ? false : common.metadata.zeroContribution;
  const personalContributionFormStore =
    formStores.personalContributionFormStore;
  const minFeeFormatted = formatMinFeeToJoin({
    zeroContribution: common.metadata.zeroContribution,
    minFeeToJoin: common.metadata.minFeeToJoin,
  });

  const contributeMessage = `Select the amount for your ${
    isMonthly ? 'monthly' : 'one-time'
  } contribution to \n this Сommon. ${
    isMonthly
      ? `The minimum contribution to this Common is ${CurrencySymbols.SHEKEL}${minFeeFormatted} monthly.`
      : 'The funds will be added to the Common balance.'
  }`;

  const onAmountSelected = async (
    amount: number,
    index: number,
  ): Promise<void> => {
    try {
      personalContributionFormStore.fieldChanged(
        RequestToJoinForm.FIELD_AMOUNT,
        {
          value: amount,
          index,
        },
      );
      setIsActionBtnHidden(false);
    } catch (e) {
      logger.log('error -> ', e);
      showErrorPopUp(bottomSheetStore, e);

      navigation.goBack();
    }
  };

  const onCustomClose = () => {
    setIsActionBtnHidden(true);
  };

  const onCustomSelect = () => {
    setIsActionBtnHidden(false);
  };

  const resetNavigation = (): void => {
    navigation.dispatch(
      CommonActions.reset({
        index: 2,
        routes: [
          {
            name: NAVIGATION_SCREENS.COMMON_HOME,
          },
          {
            name: NAVIGATION_SCREENS.COMMON_PROFILE,
            params: {commonId: common.id, common},
          },
          {
            name: NAVIGATION_SCREENS.CONTRIBUTION_HISTORY,
            params: {
              common,
            },
          },
        ],
      }),
    );
  };

  const updateMonthlyContributionAmount = async () => {
    const form = personalContributionFormStore.getFormFieldsJson() as {
      amount: number;
    };
    Toast.loading('One moment please');

    const updateSubscriptionAmountResponse =
      await SubscriptionService.updateSubscriptionAmount({
        amount: form.amount * 100,
        subscriptionId: subscriptionId as string,
      });

    Toast.done('Success');
    Toast.hide();

    if (updateSubscriptionAmountResponse.status === 200) {
      setVisible(true);
    } else {
      showErrorPopUp(bottomSheetStore, updateSubscriptionAmountResponse);
    }
  };

  const makeOneTimeContribution = async () => {
    const form = personalContributionFormStore.getFormFieldsJson() as {
      amount: number;
    };
    Toast.loading('One moment please');

    const immediateContributionResponse =
      await CommonService.immediateContribution({
        amount: form.amount * 100,
        commonId: common.id,
        contributionType: common.metadata.contributionType,
        saveCard: true,
      });

    Toast.done('Success');
    Toast.hide();

    if (immediateContributionResponse.status === 200) {
      setVisible(true);
    } else {
      showErrorPopUp(bottomSheetStore, immediateContributionResponse);
    }
  };

  const push = async () => {
    try {
      if (isMonthly) {
        updateMonthlyContributionAmount();
      } else {
        makeOneTimeContribution();
      }
    } catch (e) {
      logger.log('error -> ', e);
      showErrorPopUp(bottomSheetStore, e);

      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
        scrollEventThrottle={16}>
        <View>
          {isMonthly ? (
            <RequestStepHeaderTitle
              title="Change monthly contribution amount"
              subtitle={contributeMessage}
              subtitleStyle={styles.subtitle}
            />
          ) : (
            <RequestStepHeaderTitle
              title="Make one-time contribution"
              subtitle={contributeMessage}
              subtitleStyle={styles.subtitle}
            />
          )}
          <View style={styles.divider} />
          {isMonthly && (
            <Text style={styles.chargeHint}>
              The change will apply starting from the next charge.
            </Text>
          )}
          <AmountField
            isMonthly={isMonthly}
            formStore={personalContributionFormStore}
            onCustomSelect={onCustomSelect}
            onCustomClose={onCustomClose}
            onAmountSelected={onAmountSelected}
            minFeeToJoin={formatMinFeeToJoin({
              numberValue: true,
              minFeeToJoin: common.metadata.minFeeToJoin,
              zeroContribution: common.metadata.zeroContribution,
            })}
            zeroContribution={zeroContribution}
          />

          {isMonthly && (
            <Text style={styles.monthlyBottomMessage}>
              You can cancel the recurring payment at any time.
            </Text>
          )}
        </View>
      </ScrollView>
      <RequestStepActionButton
        title="Continue to payment"
        formStore={personalContributionFormStore}
        onPress={push}
        hidden={isActionBtnHidden}
      />
      <BottomSheetModal
        style={styles.bottomSheetContainer}
        isVisible={isVisible}
        onClose={() => {
          setVisible(false);
        }}>
        <Pressable style={{width: '100%'}} onPress={resetNavigation}>
          <View style={styles.plug} />
        </Pressable>
        <View
          style={{
            height: 330,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FastImage
            style={styles.image}
            source={require('~/Assets/send.png')}
          />
          <Text style={styles.modalTitle}>
            {isMonthly
              ? `Your monthly Contribution ${'\n'} has been changed`
              : 'Contribution was sent'}
          </Text>
          <TouchableOpacity
            style={styles.modalRequestSentBtnPrimary}
            onPress={resetNavigation}>
            <Text style={text.buttonblack}>OK</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  divider: {
    backgroundColor: colors.grey4,
    height: 1,
    marginBottom: 16,
  },
  subtitle: {
    lineHeight: 20,
    marginTop: baseMargin * 2,
    color: colors.greySubtitle,
  },
  chargeHint: {
    ...text.regularText,
    textAlign: 'center',
    color: colors.greySubtitle,
    marginBottom: 24,
  },
  monthlyBottomMessage: {
    ...text.regularText,
    textAlign: 'center',
    color: colors.greySubtitle,
    marginBottom: 10,
  },
  modalRequestSentBtnPrimary: {
    ...layout.btnOutline,
    ...layout.marginTopL,
    flexGrow: 0,
    width: '100%',
  },
  bottomSheetContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  image: {
    top: 0,
    height: 130,
    alignSelf: 'center',
    aspectRatio: 1,
  },
  modalTitle: {
    ...font.fontSize(4),
    textAlign: 'center',
    ...font.heading.bold,
    marginVertical: sizeM,
  },
  plug: {
    backgroundColor: colors.paleblue,
    width: 72,
    height: 6,
    borderRadius: 2,
    alignSelf: 'center',
  },
});

export default observer(MakeContribution);
