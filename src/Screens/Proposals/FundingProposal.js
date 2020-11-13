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
import {text, layout, colors} from '~/Theme';
import FundingRequestForm from '~/Components/Forms/FundingRequestForm';
import RequestStepActionButton from '../Commons/RequestStepActionButton';
import {CommonActions} from '@react-navigation/native';
import Toast from '~/Util/Toast';
import font from '~/Theme/font';
import logger from '~/Services/Logger';
import {string, object, shape, func} from 'prop-types';
import FundingRequestFormStore from '~/FormStores/FundingRequestFormStore';

import ProposalService from '~/Services/ProposalService';

const FundingProposal = ({
  navigation,
  route: {params: {commonId, common}} ,
}) => {

  const fundingRequestFormStore = new FundingRequestFormStore();

  const createProposal = async (e) => {
    Keyboard.dismiss();
    if (fundingRequestFormStore.isFormValid()) {
      try {
        const formData = fundingRequestFormStore.getChangedFormFieldsJson();
        const data = {
          title: formData[FundingRequestForm.FIELD_TITLE],
          description: formData[FundingRequestForm.FIELD_DESCRIPTION],
          amount: formData[FundingRequestForm.FIELD_AMOUNT_REQUESTED] * 100,
          links: formData[FundingRequestForm.FIELD_LINKS],
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

        const createFundingProposalResponse = await ProposalService.getInstance().createFundingProposal(data);
        console.log("createFundingProposalResponse 1 -> ", createFundingProposalResponse);
        console.log("createFundingProposalResponse 2 -> ", createFundingProposalResponse.errors);

        if (createFundingProposalResponse.status === 200) {
          const proposalId = createFundingProposalResponse.data.id;

          navigation.pop();
          Toast.done(`Funding Proposal with id ${proposalId} created!`);

          const navigate = CommonActions.navigate({
            name: 'CommonProfile',
            params: {
              showRequestSentModal: true,
              createdProposalId: proposalId,
            },
          });
          navigation.dispatch(navigate);
        } else {
          navigation.pop();
          logger.log(createFundingProposalResponse);
          Toast.error(createFundingProposalResponse.toString());
        }
      } catch (error) {
        navigation.pop();
        logger.log(error);
        Toast.error(error.toString());
      }
    }
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
          <Text style={styles.title}>New proposal</Text>
          <Text style={styles.subtitle}>
            Get funding to promote the Common's agenda. If your proposal is accepted you will be responsible to follow it through.
          </Text>
          <View style={styles.divider} />
          <FundingRequestForm common={common} fundingRequestFormStore={fundingRequestFormStore}/>
        </ScrollView>
        <RequestStepActionButton
          title="Create Proposal"
          pass={fundingRequestFormStore.isFormActionEnabled()}
          onPress={createProposal}
        />
      </SafeAreaView>
    </>
  );
};

FundingProposal.propTypes = {
  userStore: shape({
    userInfo: shape({
      safeAddress: string,
    }),
  }),
  fundingRequestFormStore: shape({
    isFormValid: func,
    getChangedFormFieldsJson: func,
    form: object,
  }),
  navigation: object,
  route: shape({
    params: shape({
      commonId: string,
      common: object,
    }),
  }),
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

export default FundingProposal;
