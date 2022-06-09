import React from 'react';
import {Text, View} from 'react-native';
import {colors, font} from '~/Theme';
import CreateCommonForm from '~/Components/Forms/CreateCommonForm';
import MultiTitleValueField from '~/Components/FormFields/MultiTitleValueField';
import RequestStepActionButton from '~/Components/RequestStepActionButton';
import CreateStepHeaderTitle from './CreateStepHeaderTitle';
import {object, func, shape} from 'prop-types';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import {NAVIGATION_SCREENS} from '~/Navigation/routes.enum';

const CreateCommonRules = ({
  navigation,
  route: {
    params: {formStores},
  },
}) => {
  const agendaFormStore = formStores.agendaFormStore;

  const push = () => {
    if (agendaFormStore.isFormValid()) {
      navigation.navigate(NAVIGATION_SCREENS.CREATE_COMMON_REVIEW, {
        formStores,
      });
    }
  };

  return (
    <StepDotLayout
      navigation={navigation}
      stepDotHeaderTitle="Additional Info"
      navTitle="Additional Info"
      currentIndex={3}
      requestStepActionButton={
        <RequestStepActionButton
          title="Continue to Review"
          formStore={agendaFormStore}
          onPress={push}
        />
      }>
      <View
        style={{
          flex: 1,
          // padding: 24,
          backgroundColor: 'white',
        }}>
        <CreateStepHeaderTitle
          title="Rules"
          subtitle="Add rules of conduct. New members must agree to the rules before joining the Common."
        />
        <Text
          style={{
            marginTop: 24,
            ...font.primary.bold,
            ...font.fontSize(3),
            ...font.lineHeight(2),
          }}>
          Rules of conduct
        </Text>
        <Text
          style={{
            ...font.primary.regular,
            ...font.fontSize(2),
            ...font.lineHeight(2),
            color: colors.grey3,
          }}>
          Use rules to set the tone for your Common's discussions. (No
          advertising and spam, accepted language, etc.)
        </Text>

        <MultiTitleValueField
          rule
          allowsEditing={true}
          title="Rule title"
          placeholderValueText="Rule description"
          multiline={true}
          addMultiFieldBtnName="Add Rule"
          maxLength={80}
          maxLengthDescription={512}
          validation={{
            name: CreateCommonForm.RULES,
            formStore: agendaFormStore,
            validateRule: {value: 'string', title: 'string|max:80'},
          }}
        />

        {/*
          {[...Array(ruleCount).keys()].map(x => (
            <View key={x}>
              <TextInput
                key={`title_${x}`}
                style={{
                  borderColor: colors.grey4,
                  padding: 10,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  borderWidth: 1,
                  marginTop: 20,
                }}
                onChangeText={text => handleRuleTitles(x, text)}
                placeholder="Rule title"
              />
              <TextInput
                key={`body_${x}`}
                style={{
                  borderColor: colors.grey4,
                  padding: 10,
                  borderWidth: 1,
                  borderTopWidth: 0,
                  borderBottomRightRadius: 5,
                  borderBottomLeftRadius: 5,
                  height: 100,
                }}
                onChangeText={text => handleRuleBody(x, text)}
                multiline={true}
                numberOfLines={4}
                placeholder="Rule description"
              />
            </View>
          ))}

          <TouchableOpacity onPress={() => setRuleCount(ruleCount + 1)}>
            <Text
              style={{
                color: colors.mainBlue,
                fontSize: 16,
                fontWeight: '500',
                marginTop: 20,
              }}>
              Add rule
            </Text>
          </TouchableOpacity>
          */}
      </View>
    </StepDotLayout>
  );
};

CreateCommonRules.propTypes = {
  navigation: object,
  route: shape({
    params: shape({
      formStores: shape({
        agendaFormStore: shape({
          isFormValid: func,
          isFormActionEnabled: func,
        }).isRequired,
      }).isRequired,
    }),
  }),
};

export default CreateCommonRules;
