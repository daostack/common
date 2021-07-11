import React, {useState} from 'react';
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
import FundingRequestForm from '~/Components/Forms/FundingRequestForm';
import RequestStepActionButton from '../Commons/RequestStepActionButton';
import {CommonActions} from '@react-navigation/native';
import Toast from '~/Util/Toast';
import font from '~/Theme/font';
import {string, object, shape} from 'prop-types';
import FundingRequestFormStore from '~/FormStores/FundingRequestFormStore';
import {showErrorPopUp} from '~/Util';
import {inject} from 'mobx-react';
import {createFundingProposal} from '~/Services/ListServices/ProposalListService';
import UseOfFunds from '../../Components/Commons/UseOfFunds';
import {BlurView} from '@react-native-community/blur';
import DebtWarningNote from './components/DebtWarningNote';
import ModalDebtWarning from './components/ModalDebtWarning';
import {uiStorePropTypes} from '~/Types/propTypes';
import {escapeUrl} from '~/Util';

const FundingProposal = ({
  navigation,
  route: {
    params: {commonId, common},
  },
  uiStore,
}) => {
  const [fundingRequestFormStore] = useState(new FundingRequestFormStore());
  const [useOfFundsVisible, setUseOfFundsVisible] = useState(false);
  const [debtModalVisible, setDebtModalVisible] = useState(false);

  const createProposal = async () => {
    navigation.setOptions({headerShown: true});
    setUseOfFundsVisible(false);
    Keyboard.dismiss();
    if (fundingRequestFormStore.isFormValid()) {
      try {
        const formData = fundingRequestFormStore.getChangedFormFieldsJson();
        const proposalData = {
          title: formData[FundingRequestForm.FIELD_TITLE],
          description: formData[FundingRequestForm.FIELD_DESCRIPTION],
          amount: formData[FundingRequestForm.FIELD_AMOUNT_REQUESTED] * 100,
          links: escapeUrl(formData[FundingRequestForm.FIELD_LINKS]),
          images: formData[FundingRequestForm.FIELD_IMAGES],
          files: formData[FundingRequestForm.FIELD_FILES],
          commonId,
        };

        navigation.navigate({
          name: 'FullScreenCreationLoader',
          params: {
            title: 'Creating your proposal',
          },
        });

        const {data} = await createFundingProposal(proposalData);
        const proposalId = data.createFundingProposal.id;

        navigation.pop();

        Toast.done('Your proposal was created!');

        const navigate = CommonActions.navigate({
          name: 'CommonProfile',
          params: {
            showRequestSentModal: true,
            createdProposalId: proposalId,
          },
        });
        navigation.dispatch(navigate);
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
    if (fundingRequestFormStore.isFormValid()) {
      Keyboard.dismiss();

      navigation.setOptions({
        headerShown: false,
      });

      const formData = fundingRequestFormStore.getChangedFormFieldsJson();

      if (Number(formData[FundingRequestForm.FIELD_AMOUNT_REQUESTED])) {
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
          contentContainerStyle={layout.content}>
          <Text style={styles.title}>New proposal</Text>
          <Text style={styles.subtitle}>
            {
              'Proposals allow you to make decisions as a group.\nIf you choose to request funding and the proposal is accepted, you will be responsible to follow it through.'
            }
          </Text>
          <View style={styles.divider} />
          <FundingRequestForm
            common={common}
            fundingRequestFormStore={fundingRequestFormStore}
            navigation={navigation}
          />
          <DebtWarningNote onPress={() => openDebtModal()} />
        </ScrollView>
        <RequestStepActionButton
          title="Create Proposal"
          formStore={fundingRequestFormStore}
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

FundingProposal.propTypes = {
  navigation: object,
  route: shape({
    params: shape({
      commonId: string,
      common: object,
    }),
  }),
  uiStore: uiStorePropTypes,
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

export default inject('uiStore')(FundingProposal);