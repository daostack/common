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
import {CommonActions} from '@react-navigation/native';

const FundingProposal = ({fundingRequestFormStore, navigation}) => {
  const viewProposal = () => {
    //navigation.navigate('RequestStep1');
  };

  const goToToCommon = () => {
    setShowRequestSentModal(false);
  };

  const createProposal = e => {
    //setShowRequestSentModal(true);

    const navigate = CommonActions.navigate({
      name: 'CommonProfile',
      params: {
        showRequestSentModal: true,
      },
    });
    navigation.dispatch(navigate);
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

export default inject('fundingRequestFormStore')(observer(FundingProposal));
