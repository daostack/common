import React from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {observer, inject} from 'mobx-react';
import {text, layout, colors} from '../../Theme';
import FundingRequestForm from '../../Components/Forms/FundingRequestForm';
import RequestStepActionButton from '../Commons/RequestStepActionButton';
import { CommonActions } from '@react-navigation/native';
import ArcService from '../../Services/ArcService';
import { BN } from 'bn.js';
import Toast from '../../Util/Toast';

const FundingProposal = ({
  userStore,
  fundingRequestFormStore,
  navigation,
  route,
}) => {
  // TODO: can these lines be removed?
  // const viewProposal = () => {
  //   //navigation.navigate('RequestStep1');
  // };

  // const goToToCommon = () => {
  //   setShowRequestSentModal(false);
  // };

  const createProposal = async e => {
    if (fundingRequestFormStore.isFormValid()) {
      try {
        const formData = fundingRequestFormStore.getChangedFormFieldsJson();
        console.log('FORM DATA', formData);
        console.log(formData);
        const data = {
          title: formData[FundingRequestForm.FIELD_TITLE],
          description: formData[FundingRequestForm.FIELD_DESCRIPTION],
          funding: new BN(formData[FundingRequestForm.FIELD_AMOUNT_REQUESTED] * 100,),
          links: formData[FundingRequestForm.FIELD_LINKS],
          images: formData[FundingRequestForm.FIELD_IMAGES],
          files: formData[FundingRequestForm.FIELD_FILES],
        };

        console.log('DATA -> ', data);
        Toast.loading('Creating funding proposal...');

        const proposalId = await ArcService.getInstance().createFundingProposal(
          userStore.userInfo.safeAddress,
          route.params.commonId,
          data,
        );
        Toast.hide();
        Toast.done(`Funding Proposal with id ${proposalId} created!`);

        const navigate = CommonActions.navigate({
          name: 'CommonProfile',
          params: {
            showRequestSentModal: true,
            createdProposalId: proposalId,
          },
        });
        navigation.dispatch(navigate);

      } catch (error) {
        console.log(error);
        Toast.error(error.toString());
      }
    }

    const navigate = CommonActions.navigate({
      name: 'CommonProfile',
      params: {
        showRequestSentModal: true,
      },
    });
    navigation.dispatch(navigate);
    //setShowRequestSentModal(true);
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: colors.white,
          }}
          contentContainerStyle={layout.content}>
          <Text style={styles.title}>Funding request</Text>
          <Text style={styles.subtitle}>
            If a majority approves your initiative the funds (and
            responsibility) are yours.
          </Text>

          <FundingRequestForm />
        </ScrollView>
        <RequestStepActionButton
          title="Create Proposal"
          pass={fundingRequestFormStore.form.meta.isValid}
          onPress={createProposal}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    ...text.h3Black,
    ...layout.marginTopM,
    textAlign: 'left',
  },
  subtitle: {
    ...text.blackText,
    ...layout.marginTopXL,
    ...layout.marginBottomM,
    textAlign: 'center',
  },
});

export default inject(
  'userStore',
  'fundingRequestFormStore',
)(observer(FundingProposal));
