import React from 'react';
import {Text, View, ScrollView} from 'react-native';
import {observer} from 'mobx-react';
import TextInputField from '~/Components/FormFields/TextInputField';
import MultiTitleValueField from '~/Components/FormFields/MultiTitleValueField';
import MultiImageField from '~/Components/FormFields/MultiImageField';
import MultiFileField from '~/Components/FormFields/MultiFileField';
import {colors, text} from '~/Theme';
import MembershipAdmittanceForm from '~/Components/Forms/MembershipAdmittanceForm';
import RequestStepActionButton from '~/Components/RequestStepActionButton';
import {string, object, shape, func, InferProps} from 'prop-types';
//import {calcShouldSkipRules} from '~/Util/rules';
import ProposalService from '~/Services/ProposalService';
import {PROPOSALS} from '../enums/PROPOSALS';
import {useStore} from '~/Util/hooks/useStore';
import {useNavigation} from '@react-navigation/native';
import MembershipRequest from '~/Components/Proposals/MembershipRequest';

const props = {
  route: shape({
    params: shape({
      formStores: object,
      currCommon: object,
      commonId: string,
      refreshFeed: func,
    }).isRequired,
  }).isRequired,
};

const MembershipAdmittance: React.FC<InferProps<typeof props>> = ({
  route: {
    params: {formStores, commonId},
  },
}) => {
  const introduceYourselfFormStore = formStores.introduceYourselfFormStore;
  const authStore = useStore('authStore');
  const navigation = useNavigation();

  const push = async () => {
    if (introduceYourselfFormStore.isFormValid()) {
      const createMembershipAdmittance = await ProposalService.create({
        type: PROPOSALS.MEMBER_ADMITTANCE,
        args: {
          commonId,
          proposerId: authStore?.userInfo?.uid,
          ...introduceYourselfFormStore.getFormFieldsJson(), // correct fields
        },
      });
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: 'white',
        padding: 24,
        marginVertical: 40,
      }}>
      <MembershipRequest />

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

      <RequestStepActionButton
        title="Continue"
        formStore={introduceYourselfFormStore}
        onPress={push}
      />
    </ScrollView>
  );
};

MembershipAdmittance.propTypes = {
  navigation: object,
  route: shape({
    params: shape({
      commonId: string,
      refreshFeed: func,
      formStores: object,
    }),
  }),
};

export default observer(MembershipAdmittance);
