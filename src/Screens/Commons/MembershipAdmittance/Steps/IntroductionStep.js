import React from 'react';
import {Text, View} from 'react-native';
import {observer} from 'mobx-react';
import TextInputField from '~/Components/FormFields/TextInputField';
import MultiTitleValueField from '~/Components/FormFields/MultiTitleValueField';
import MultiImageField from '~/Components/FormFields/MultiImageField';
import MultiFileField from '~/Components/FormFields/MultiFileField';
import {colors, text} from '~/Theme';
import MembershipAdmittanceForm from '~/Components/Forms/MembershipAdmittanceForm';
import RequestStepActionButton from '../../RequestStepActionButton';
import {CommonActions} from '@react-navigation/native';
import RequestStepHeaderTitle from '../RequestStepHeaderTitle';
import MembershipRequest from '../MembershipRequest';
import {string, object, bool, shape, func} from 'prop-types';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import {calcShouldSkipRules} from '~/Util/rules';
import ProposalService from '~/Services/ProposalService';
import {PROPOSALS} from '../../../Proposals/enums/PROPOSALS';
import {useStore} from '~/Util/hooks/useStore';

const IntroductionStep = ({
  navigation,
  route: {
    params: {formStores, skipFirstStep, currCommon, commonId, refreshFeed},
  },
}) => {
  const introduceYourselfFormStore = formStores.introduceYourselfFormStore;
  const authStore = useStore('authStore');

  const push = async () => {
    const hasRules = !calcShouldSkipRules(currCommon);
    if (introduceYourselfFormStore.isFormValid()) {
      let navigate;
      if (hasRules) {
        navigate = CommonActions.navigate({
          name: 'RulesStep',
          params: {
            formStores,
            commonId,
            currCommon: currCommon,
            skipFirstStep: skipFirstStep,
            refreshFeed,
          },
        });
      } else {
        const createMembershipAdmittance = await ProposalService.create({
          type: PROPOSALS.MEMBER_ADMITTANCE,
          args: {
            commonId,
            proposerId: authStore.userInfo.uid,
            ...introduceYourselfFormStore.getFormFieldsJson(), // correct fields
          },
        });
      }

      navigation.dispatch(navigate);
    }
  };

  return (
    <StepDotLayout
      navigation={navigation}
      stepDotHeaderTitle="Introduce Yourself"
      navTitle={currCommon.name}
      currentIndex={1}
      skipFirstStep={skipFirstStep}
      isRequestToJoin={true}
      layoutTitle={<MembershipRequest />}
      requestStepActionButton={
        <RequestStepActionButton
          title="Continue"
          formStore={introduceYourselfFormStore}
          onPress={push}
        />
      }>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <RequestStepHeaderTitle
          title="Introduce Yourself"
          subtitle="Let the Common members learn more about you and how you relate to the cause."
        />

        <View
          style={{
            backgroundColor: colors.grey4,
            height: 1,
            marginBottom: 40,
          }}
        />

        <TextInputField
          label="Title"
          infoLabel="Required"
          placeholderText="Proposal title"
          validation={{
            name: MembershipAdmittanceForm.FIELD_TITLE,
            formStore: introduceYourselfFormStore,
            validateRule: 'required|string',
          }}
        />

        <TextInputField
          label="Description"
          infoLabel="Required"
          placeholderText="Proposal description"
          multiline={true}
          numberOfLines={6}
          validation={{
            name: MembershipAdmittanceForm.DESCRIPTION,
            formStore: introduceYourselfFormStore,
            validateRule: 'required|string',
          }}
        />

        <Text style={{...text.h3Black, textAlign: 'left'}}>Links</Text>

        <MultiTitleValueField
          link
          value={
            introduceYourselfFormStore.getFormField(
              MembershipAdmittanceForm.FIELD_LINKS,
            )?.value
          }
          allowsEditing={true}
          title="Title"
          maxLength={30}
          validation={{
            name: MembershipAdmittanceForm.FIELD_LINKS,
            formStore: introduceYourselfFormStore,
          }}
        />

        <MultiFileField
          allowsEditing={true}
          title={'Add File'}
          validation={{
            name: MembershipAdmittanceForm.FIELD_FILES,
            formStore: introduceYourselfFormStore,
            validateRule: 'string',
          }}
          navigation={navigation}
        />

        <MultiImageField
          allowsEditing={true}
          title={'Add Image'}
          validation={{
            name: MembershipAdmittanceForm.FIELD_IMAGES,
            formStore: introduceYourselfFormStore,
            validateRule: 'string',
          }}
        />
      </View>
    </StepDotLayout>
  );
};

IntroductionStep.propTypes = {
  navigation: object,
  route: shape({
    params: shape({
      skipFirstStep: bool,
      commonId: string,
      refreshFeed: func,
      formStores: object,
    }),
  }),
};

export default observer(IntroductionStep);
