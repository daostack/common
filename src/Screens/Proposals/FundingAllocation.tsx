import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  Keyboard,
  Modal,
} from 'react-native';
import {text, layout, colors} from '~/Theme';
import FundingAllocationForm from '~/Components/Forms/FundingAllocationForm';
import RequestStepActionButton from '../Commons/RequestStepActionButton';
import {CommonActions} from '@react-navigation/native';
import Toast from '~/Util/Toast';
import font from '~/Theme/font';
import {string, object, shape} from 'prop-types';
import FundingAllocationFormStore from '~/Stores/FormStores/FundingAllocationFormStore';
import {showErrorPopUp} from '~/Util';
import {inject} from 'mobx-react';
import ProposalService from '~/Services/ProposalService';
import UseOfFunds from '../../Components/Commons/UseOfFunds';
import {BlurView} from '@react-native-community/blur';
import DebtWarningNote from './components/DebtWarningNote';
import ModalDebtWarning from './components/ModalDebtWarning';
import {escapeUrl} from '~/Util';

const FundingAllocation = ({
  navigation,
  route: {
    params: {commonId, common},
  },
  rootStore,
}) => {
  const uiStore = rootStore.uiStore;
  const bankAccountStore = rootStore.bankAccountStore;

  const [fundingAllocationFormStore] = useState(
    new FundingAllocationFormStore(),
  );
  const [useOfFundsVisible, setUseOfFundsVisible] = useState(false);
  const [debtModalVisible, setDebtModalVisible] = useState(false);
  const [bankAccountState, setBankAccountState] = useState({
    isAdded: !!bankAccountStore?.data?.size,
    hasError: false,
  });

  const scrollRef = useRef();

  useEffect(() => {
    if (bankAccountStore?.data?.size) {
      setBankAccountState({isAdded: true, hasError: false});
    }
  }, [bankAccountStore?.data]);

  const createProposal = async () => {
    navigation.setOptions({headerShown: true});
    setUseOfFundsVisible(false);
    Keyboard.dismiss();
    if (fundingAllocationFormStore.isFormValid()) {
      try {
        const formData = fundingAllocationFormStore.getChangedFormFieldsJson();
        const data = {
          title: formData[FundingAllocationForm.FIELD_TITLE],
          description: formData[FundingAllocationForm.FIELD_DESCRIPTION],
          amount: formData[FundingAllocationForm.FIELD_AMOUNT_REQUESTED] * 100,
          links: escapeUrl(formData[FundingAllocationForm.FIELD_LINKS]),
          images: formData[FundingAllocationForm.FIELD_IMAGES],
          files: formData[FundingAllocationForm.FIELD_FILES],
          commonId,
        };

        navigation.navigate({
          name: 'FullScreenCreationLoader',
          params: {
            title: 'Creating your proposal',
          },
        });

        const createFundingAllocationResponse =
          await ProposalService.createFundingAllocation(data);

        if (createFundingAllocationResponse.status === 200) {
          const proposalId = createFundingAllocationResponse.data.id;

          navigation.pop();

          Toast.done('Your proposal was created!');

          const navigate = CommonActions.navigate({
            name: 'CommonProfile',
            params: {
              showRequestSentModal: true,
              createdProposalId: proposalId,
              commonId,
            },
          });
          navigation.dispatch(navigate);
        } else {
          navigation.pop();
          showErrorPopUp(
            uiStore.bottomSheetStore,
            createFundingAllocationResponse,
          );
        }
      } catch (error) {
        navigation.pop();
        showErrorPopUp(uiStore.bottomSheetStore, error);
      }
    }
  };

  const closeDebtModal = () => {
    setDebtModalVisible(false);
  };

  const openDebtModal = () => {
    setDebtModalVisible(true);
  };

  const onCreateProposalButtonPressed = async () => {
    const amountRequested =
      fundingAllocationFormStore.getChangedFormFieldsJson()[
        FundingAllocationForm.FIELD_AMOUNT_REQUESTED
      ];

    let bankError = bankAccountState.hasError; //This is needed because the state wasn't update before the next if was chekcing his new value, and this was causing issues

    if (!bankAccountState.isAdded && amountRequested > 0) {
      setBankAccountState({
        isAdded: false,
        hasError: true,
      });
      bankError = true;
      scrollRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
    } else {
      bankError = false;
    }

    if (fundingAllocationFormStore.isFormValid() && !bankError) {
      Keyboard.dismiss();

      navigation.setOptions({
        headerShown: false,
      });

      const formData = fundingAllocationFormStore.getChangedFormFieldsJson();

      if (Number(formData[FundingAllocationForm.FIELD_AMOUNT_REQUESTED])) {
        setUseOfFundsVisible(true);
      } else {
        await createProposal();
      }
    }
  };

  const hideModal = () => {
    navigation.setOptions({headerShown: true});
    setUseOfFundsVisible(false);
  };

  const handleAddBankAccount = () => {
    setBankAccountState({
      isAdded: true,
      hasError: false,
    });
  };

  return (
    <React.Fragment>
      <StatusBar barStyle="dark-content" />
      <Modal
        animationType="slide"
        transparent={true}
        visible={useOfFundsVisible}>
        <UseOfFunds
          onPressAgree={createProposal}
          onCancel={() => hideModal()}
        />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={debtModalVisible}>
        <ModalDebtWarning onPressClose={() => closeDebtModal()} />
      </Modal>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: colors.white,
          }}
          ref={scrollRef}
          contentContainerStyle={layout.content}>
          <Text style={styles.title}>New proposal</Text>
          <Text style={styles.subtitle}>
            {
              'Proposals allow you to make decisions as a group.\nIf you choose to request funding and the proposal is accepted, you will be responsible to follow it through.'
            }
          </Text>
          <View style={styles.divider} />
          <FundingAllocationForm
            common={common}
            fundingRequestFormStore={fundingAllocationFormStore}
            navigation={navigation}
            hasBankAccountError={bankAccountState.hasError}
            handleAddBankAccount={handleAddBankAccount}
          />
          <DebtWarningNote onPress={() => openDebtModal()} />
        </ScrollView>
        <RequestStepActionButton
          title="Create Proposal"
          formStore={fundingAllocationFormStore}
          onPress={onCreateProposalButtonPressed}
        />
      </SafeAreaView>

      {useOfFundsVisible && (
        <BlurView
          style={styles.blurView}
          blurType="dark"
          blurAmount={1}
          reducedTransparencyFallbackColor={colors.black}
        />
      )}
    </React.Fragment>
  );
};

FundingAllocation.propTypes = {
  navigation: object,
  route: shape({
    params: shape({
      commonId: string,
      common: object,
    }),
  }),
  rootStore: object,
};

const styles = StyleSheet.create({
  blurView: {position: 'absolute', ...StyleSheet.absoluteFill},
  title: {
    ...text.h2Black,
    ...layout.marginTopM,
    textAlign: 'left',
    ...font.fontSize(4),
  },
  subtitle: {
    ...font.regular,
    color: colors.slate,
    marginTop: 24,
    ...layout.marginBottomL,
    textAlign: 'center',
    lineHeight: 23,
    fontSize: 14,
  },
  divider: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: colors.grey4,
  },
});

export default inject('rootStore')(FundingAllocation);
