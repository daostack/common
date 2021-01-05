import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import {colors, font} from '~/Theme';
import CreateCommonForm from '~/Components/Forms/CreateCommonForm';
import MultiLinkField from '~/Components/FormFields/MultiLinkField';
import RequestStepActionButton from '../RequestStepActionButton';
import CreateStepHeaderTitle from './CreateStepHeaderTitle';
import {object, func, shape} from 'prop-types';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';

const CreateStep3 = ({navigation, route: {params:{formStores}}}) => {
  const agendaFormStore = formStores.agendaFormStore;
  // var ruleBody = [];

  /*
  const handleRuleTitles = (x, text) => {
    props.agendaFormStore.registerFormField(`ruleTitles_${x}`, 'string');
    props.agendaFormStore.fieldChanged(`ruleTitles_${x}`, text);
  };

  const handleRuleBody = (x, text) => {
    props.agendaFormStore.registerFormField(`ruleBody_${x}`, 'string');
    props.agendaFormStore.fieldChanged(`ruleBody_${x}`, text);
  };


  const isValid = () => {
    const titles = [...Array(ruleCount).keys()].map(x => `ruleTitles_${x}`);
    const bodys = [...Array(ruleCount).keys()].map(x => `ruleBody_${x}`);

    const result = props.agendaFormStore.isFormValidSelectedFields([
      CreateCommonForm.ACTION,
      ...titles,
      ...bodys,
    ]);
    setPass(result);
    return result;
  };

  */

  const push = () => {
    if (agendaFormStore.isFormValid()) {
      navigation.navigate('CreateStep4', {formStores});
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
      }
    >
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
          Use rules to set the tone for your Common's discussions.
          (No advertising and spam, accepted language, etc.)
        </Text>

        <MultiLinkField
          rule
          allowsEditing={true}
          title="Rule title"
          placeholderValueText="Rule description"
          multiline={true}
          addMultiFieldBtnName="Add Rule"
          validation={{
            name: CreateCommonForm.RULES,
            formStore: agendaFormStore,
            validateRule: {common: 'string', title: 'string|max:80'},
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

CreateStep3.propTypes = {
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

export default CreateStep3;
