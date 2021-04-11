import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Pressable} from 'react-native';
import TextInputFieldWithIcon from '~/Components/FormFields/TextInputFieldWithIcon';
import {colors, font, sizeL, sizeS} from '~/Theme';
import CreateStepHeaderTitle from './CreateStepHeaderTitle';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import CreateCommonForm from '~/Components/Forms/CreateCommonForm';
import RequestStepActionButton from '../RequestStepActionButton';
import {object, func, shape} from 'prop-types';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import Icon from '~/Assets/iconfont/Icon';
import {isIsraelLocale} from '~/Util/locale';

const CONTRIBUTION_TAB_VALUES = ['one-time', 'monthly'];
const MAX_CONTRIBUTION = ['3000', '500'];
const MIN_CONTRIBUTION = '5';

const CreateStep2 = ({
  navigation,
  route: {
    params: {formStores},
  },
}) => {
  const fundingFormStore = formStores.fundingFormStore;

  const getContributionValue = () =>
    fundingFormStore.getFormField(CreateCommonForm.CONTRIBUTION)?.value;

  const initialContributionIndex = getContributionValue()
    ? CONTRIBUTION_TAB_VALUES.indexOf(getContributionValue())
    : 0;

  /**
   * contributionIndex === 0 => One-Time
   * contributionIndex === 1 => Monthly
   */
  const [contributionIndex, setContributionIndex] = useState(
    initialContributionIndex,
  );

  const [zeroContribution, setZeroContribution] = useState(false);

  const minimumFieldRules = (currContribIndex) => `required|numeric|min:${MIN_CONTRIBUTION[currContribIndex]}|max:${MAX_CONTRIBUTION[currContribIndex]}`;

  useEffect(() => {
    fundingFormStore.registerFormField(
      CreateCommonForm.ZERO_CONTRIBUTION,
      'required',
      {
        value: false,
      },
    );

    fundingFormStore.registerFormField(
      CreateCommonForm.CONTRIBUTION,
      'required',
      getContributionValue(),
    );
    onContributionTabChange(initialContributionIndex, true); // pre-select
  }, []);

  const onContributionTabChange = (index, isInitialSelect = false) => {
    fundingFormStore.fieldChanged(
      CreateCommonForm.CONTRIBUTION,
      CONTRIBUTION_TAB_VALUES[index],
    );
    setContributionIndex(index);
    fundingFormStore.updateFieldValidationRule(
      CreateCommonForm.MINIMUM,
      null,
      minimumFieldRules(index),
    );
  };

  const onCheckboxChecked = (state) => {
    fundingFormStore.fieldChanged(CreateCommonForm.ZERO_CONTRIBUTION, {
      value: state,
    });
    setZeroContribution(state);
  };

  const push = () => {
    if (fundingFormStore.isFormValid()) {
      navigation.navigate('CreateStep3', {formStores});
    }
  };

  return (
    <StepDotLayout
      navigation={navigation}
      stepDotHeaderTitle="Funding"
      navTitle="Funding"
      currentIndex={2}
      requestStepActionButton={
        <RequestStepActionButton
          title="Continue to Rules"
          formStore={fundingFormStore}
          onPress={push}
        />
      }>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <CreateStepHeaderTitle
          title="Funding"
          subtitle="Control how this Common will collect and manage funds."
        />
        <View
          style={{
            backgroundColor: colors.grey4,
            height: 1,
            marginBottom: 40,
          }}
        />
        <Text style={styles.label}>{'Contribution'}</Text>
        <SegmentedControlTab
          tabsContainerStyle={{marginTop: 16, marginBottom: 40, height: 44}}
          tabStyle={{borderColor: colors.grey4}}
          activeTabStyle={{backgroundColor: colors.mainBlue}}
          values={CONTRIBUTION_TAB_VALUES}
          tabTextStyle={styles.tabTextStyle}
          borderRadius={8}
          selectedIndex={contributionIndex}
          onTabPress={onContributionTabChange}
        />
        <TextInputFieldWithIcon
          key={contributionIndex}
          value={fundingFormStore.getFormField(CreateCommonForm.MINIMUM)?.value}
          iconName="dollar"
          iconSize={12}
          iconStyle={{paddingRight: 5}}
          iconEmptyColor={colors.grey3}
          iconFillColor={colors.grey}
          viewStyle={{alignSelf: 'stretch'}}
          label={
            <React.Fragment>
              Minimum{' '}
              <Text style={styles.boldText}>
                {CONTRIBUTION_TAB_VALUES[contributionIndex]}
              </Text>{' '}
              contribution (min. ${MIN_CONTRIBUTION})
            </React.Fragment>
          }
          subLabel="Set the minimum amount that new members will have to contribute in order to join this Common. The minimum contribution allowed by credit card is $5."
          infoLabel="Required"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="numeric"
          maxLength={5}
          validation={{
            name: CreateCommonForm.MINIMUM,
            formStore: fundingFormStore,
            validateRule: minimumFieldRules(contributionIndex),
            customErrorMessage: `The amount must be at least $${MIN_CONTRIBUTION} and at most $${parseFloat(
              MAX_CONTRIBUTION[contributionIndex],
            ).toLocaleString('en')}.`,
          }}
        />
        {isIsraelLocale && (
          <Text style={styles.info2}>
            All contributions are made in U.S. dollars. The actual contribution
            amount in ILS may be different than the amounts estimated above.
          </Text>
        )}
        <Pressable onPress={() => onCheckboxChecked(!zeroContribution)}>
          <View style={styles.zeroContributionView}>
            <View style={styles.checkMark}>
              <Icon
                name={zeroContribution ? 'checkIconSelected' : 'checkIcon'}
                size={24}
              />
            </View>
            <Text style={styles.agreeText}>
              Let users join the Common without a personal contribution
            </Text>
          </View>
        </Pressable>

        {/* <TextInputFieldWithIcon
            iconName="dollar"
            iconSize={12}
            iconStyle={{paddingRight: 5}}
            iconEmptyColor={colors.grey3}
            iconFillColor={colors.grey}
            viewStyle={{alignSelf: 'stretch'}}
            label="Campaign goal"
            infoLabel="Required"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            validation={{
              name: CreateCommonForm.FUNDING_GOAL,
              formStore: props.fundingFormStore,
              validateRule: 'required|integer|min:100',
            }}
          /> */}
        {/* <View style={{width: '100%'}}>
            <Text style={styles.readMoreButton}>
              Min. $5. Members can donate more if they want.{' '}
            </Text>
          </View> */}
      </View>
    </StepDotLayout>
  );
};

CreateStep2.propTypes = {
  route: shape({
    params: shape({
      formStores: shape({
        fundingFormStore: shape({
          fieldChanged: func,
          registerFormField: func,
          isFormValid: func,
          isFormActionEnabled: func,
        }).isRequired,
      }).isRequired,
    }),
  }),
  navigation: object,
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  tabTextStyle: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.mainBlue,
  },
  done: {
    color: colors.mainBlue,
    ...font.primary.bold,
    ...font.fontSize(3),
    paddingRight: 20,
    textAlign: 'center',
    alignSelf: 'flex-end',
  },
  info2: {
    marginVertical: sizeS,
    lineHeight: sizeL,
    ...font.primary.regular,
    color: colors.greySubtitle,
    ...font.fontSize(1),
  },
  readMoreButton: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.grey3,
  },
  label: {
    ...font.primary.primary,
    ...font.fontSize(2),
    color: colors.slate,
  },
  infoLabel: {
    ...font.primary.italic,
    ...font.fontSize(2),
    color: colors.paleblue,
    textAlign: 'right',
    flex: 1,
  },
  boldText: {
    ...font.primary.bold,
  },
  modalView: {
    height: 50,
    backgroundColor: colors.grey4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    width: '100%',
  },
  zeroContributionView: {
    flexDirection: 'row',
    marginTop: 24,
  },
  checkMark: {
    height: 24,
    width: 24,
    marginRight: 8,
  },
  agreeText: {
    color: colors.slate,
    ...font.primary.primary,
    fontSize: 16,
    lineHeight: 23,
    flex: 1,
  },
});

export default CreateStep2;
