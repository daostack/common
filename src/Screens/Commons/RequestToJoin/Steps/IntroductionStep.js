import React from 'react';
import {Text, View} from 'react-native';
import TextInputField from '~/Components/FormFields/TextInputField';
import MultiLinkField from '~/Components/FormFields/MultiLinkField';
import {colors, text} from '~/Theme';
import RequestToJoinForm from '~/Components/Forms/RequestToJoinForm';
import RequestStepActionButton from '../../RequestStepActionButton';
import {CommonActions} from '@react-navigation/native';
import RequestStepHeaderTitle from '../RequestStepHeaderTitle';
import MembershipRequest from '../MembershipRequest';
import {string, object, bool, shape, func} from 'prop-types';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';

const IntroductionStep = ({
  navigation,
  route: {
    params: {formStores, skipFirstStep, currCommon, currDaoId, refreshFeed},
  },
}) => {
  const introduceYourselfFormStore = formStores.introduceYourselfFormStore;

  const push = () => {
    if (introduceYourselfFormStore.isFormValid()) {
      const navigate = CommonActions.navigate({
        name: 'ContributionStep',
        params: {
          formStores,
          currDaoId: currDaoId,
          currCommon: currCommon,
          skipFirstStep: skipFirstStep,
          refreshFeed,
        },
      });
      navigation.dispatch(navigate);
    }
  };

  return (
    <StepDotLayout
      navigation={navigation}
      stepDotHeaderTitle="Introduce Yourself"
      navTitle={currCommon.name}
      currentIndex={2}
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
          // alignItems: 'center',
          // padding: 24,
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
          label="Intro"
          infoLabel="Required"
          placeholderText="Let the Common members learn more about you and how you relate to the cause."
          multiline={true}
          numberOfLines={6}
          validation={{
            name: RequestToJoinForm.FIELD_INTRO,
            formStore: introduceYourselfFormStore,
            validateRule: 'required|string',
          }}
        />

        <Text style={{...text.h3Black, textAlign: 'left'}}>Links</Text>

        <MultiLinkField
          link
          value={
            introduceYourselfFormStore.getFormField(
              RequestToJoinForm.FIELD_LINKS,
            )?.value
          }
          allowsEditing={true}
          title="Title"
          maxLength={30}
          validation={{
            name: RequestToJoinForm.FIELD_LINKS,
            formStore: introduceYourselfFormStore,
            validateRule: 'string|url',
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
      currDaoId: string,
      refreshFeed: func,
      formStores: object,
    }),
  }),
  daoStore: shape({
    dao: shape({
      name: string,
    }),
  }),
};

export default IntroductionStep;
