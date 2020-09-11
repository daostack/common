import React from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  Keyboard,
} from 'react-native';
import { observer, inject } from 'mobx-react';
import { text, layout, colors } from '~/Theme';
import FundingRequestForm from '~/Components/Forms/FundingRequestForm';
import RequestStepActionButton from '../Commons/RequestStepActionButton';
import { CommonActions } from '@react-navigation/native';
import ArcService from '~/Services/ArcService';
import { BN } from 'bn.js';
import Toast from '~/Util/Toast';
import font from '~/Theme/font';
import logger from '~/Services/Logger';

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

  const createProposal = async (e) => {
    Keyboard.dismiss();
    if (fundingRequestFormStore.isFormValid()) {
      try {
        const formData = fundingRequestFormStore.getChangedFormFieldsJson();
        const data = {
          title: formData[FundingRequestForm.FIELD_TITLE],
          description: formData[FundingRequestForm.FIELD_DESCRIPTION],
          funding: new BN(formData[FundingRequestForm.FIELD_AMOUNT_REQUESTED] * 100,),
          links: formData[FundingRequestForm.FIELD_LINKS],
          images: formData[FundingRequestForm.FIELD_IMAGES],
          files: formData[FundingRequestForm.FIELD_FILES],
        };

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
        logger.log(error);
        Toast.error(error.toString());
      }
    }
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: colors.white,
          }}
          contentContainerStyle={layout.content}>
          <Text style={styles.title}>New proposal</Text>
          <Text style={styles.subtitle}>
            Get funding to promote the Common's agenda. If your proposal is accepted you will be responsible to follow it through.
          </Text>
          <View style={styles.divider} />
          <FundingRequestForm common={route.params.common} />
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

export default inject(
  'userStore',
  'fundingRequestFormStore',
)(observer(FundingProposal));
