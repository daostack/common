import React, {useState} from 'react';
import {View, StyleSheet, Modal} from 'react-native';
import TextInputField from '~/Components/FormFields/TextInputField';
import CreateCommonForm from '~/Components/Forms/CreateCommonForm';
import {colors} from '~/Theme';
import MultiTitleValueField from '~/Components/FormFields/MultiTitleValueField';
import CreateStepHeaderTitle from './CreateStepHeaderTitle';
import RequestStepActionButton from '~/Components/RequestStepActionButton';
import {shape, func, object} from 'prop-types';
import {BlurView} from '@react-native-community/blur';
import UseAcknowledgment from '../../../Components/Proposals/UseAcknowledgment';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';

const CreateCommonGeneralInfo = ({
  navigation,
  route: {
    params: {formStores},
  },
}) => {
  const generalInfoFormStore = formStores.generalInfoFormStore;
  const [useAcknowledgmentVisible, setUseAcknowledgmentVisible] =
    useState(false);
  const [agreed, setAgreed] = useState(false);

  const push = () => {
    setAgreed(true);
    setUseAcknowledgmentVisible(false);
    continueToNextStep();
  };

  const continueToNextStep = () => {
    if (generalInfoFormStore.isFormValid()) {
      navigation.navigate(NAVIGATION_SCREENS.CREATE_COMMON_RULES, {formStores});
    }
  };

  return (
    <StepDotLayout
      navigation={navigation}
      stepDotHeaderTitle="General Info"
      navTitle="General Info"
      currentIndex={1}
      prependedArea={
        <Modal
          animationType="slide"
          transparent={true}
          visible={useAcknowledgmentVisible}>
          <UseAcknowledgment
            onPressAgree={push}
            onCancel={() => setUseAcknowledgmentVisible(false)}
          />
        </Modal>
      }
      appendedArea={
        useAcknowledgmentVisible && (
          <BlurView
            style={styles.blurView}
            blurType="dark"
            blurAmount={1}
            reducedTransparencyFallbackColor={colors.black}
          />
        )
      }
      requestStepActionButton={
        <RequestStepActionButton
          title="Continue"
          formStore={generalInfoFormStore}
          onPress={() => {
            if (generalInfoFormStore.isFormValid()) {
              if (agreed) {
                continueToNextStep();
              } else {
                setUseAcknowledgmentVisible(true);
              }
            }
          }}
        />
      }>
      <View
        style={{
          flex: 1,
          width: '100%',
          // alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <CreateStepHeaderTitle
          title="General Info"
          subtitle="
              Describe your cause and let the community learn more about your
              plans and goals"
        />
        <View
          style={{
            backgroundColor: colors.grey4,
            height: 1,
            marginBottom: 40,
          }}
        />
        <TextInputField
          value={
            generalInfoFormStore.getFormField(CreateCommonForm.NAME)?.value
          }
          viewStyle={{alignSelf: 'stretch'}}
          label="Common name"
          infoLabel="Required"
          placeholderText=""
          autoCapitalize="none"
          returnKeyType="next"
          autoCorrect={false}
          maxLength={49}
          validation={{
            name: CreateCommonForm.NAME,
            formStore: generalInfoFormStore,
            validateRule: 'required',
            displayName: 'common name',
          }}
        />
        <TextInputField
          value={
            generalInfoFormStore.getFormField(CreateCommonForm.BYLINE)?.value
          }
          viewStyle={{alignSelf: 'stretch'}}
          label="Byline"
          numberOfLines={3}
          // returnKeyType="next"
          multiline={true}
          placeholderText="What is the ultimate goal of the Common?"
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={89}
          validation={{
            name: CreateCommonForm.BYLINE,
            formStore: generalInfoFormStore,
            validateRule: 'string',
            displayName: 'tagline',
          }}
        />
        <TextInputField
          value={
            generalInfoFormStore.form.fields[CreateCommonForm.DESCRIPTION]
              ?.value
          }
          label="Description"
          numberOfLines={5}
          multiline={true}
          returnKeyType="next"
          placeholderText="Describe your cause and let others know why they should join you. What makes you passionate about it? What does success look like?"
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={200}
          validation={{
            name: CreateCommonForm.DESCRIPTION,
            formStore: generalInfoFormStore,
            validateRule: 'required',
            displayName: 'about',
          }}
        />
        <MultiTitleValueField
          link
          allowsEditing={true}
          label="Links"
          title="Title"
          maxLength={30}
          value={
            generalInfoFormStore.getFormField(CreateCommonForm.LINKS)?.value
          }
          validation={{
            name: CreateCommonForm.LINKS,
            formStore: generalInfoFormStore,
          }}
        />
      </View>
    </StepDotLayout>
  );
};

CreateCommonGeneralInfo.propTypes = {
  navigation: object,
  route: shape({
    params: shape({
      formStores: shape({
        generalInfoFormStore: shape({
          isFormValid: func,
          isFormActionEnabled: func,
        }).isRequired,
      }).isRequired,
    }),
  }),
};

const styles = StyleSheet.create({
  blurView: {position: 'absolute', ...StyleSheet.absoluteFill},
});

export default CreateCommonGeneralInfo;
