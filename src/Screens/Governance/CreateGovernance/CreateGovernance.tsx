import {observer} from 'mobx-react';
import React, {ReactElement} from 'react';
import {Formik} from 'formik';
import {ScrollView, TouchableOpacity, Text} from 'react-native';
import {styles} from './styles';
import TextInputField from '~/Components/FormikForm/TextInputField';
import {NativeSelectField} from '~/Components/FormikForm/NativeSelectField';
import {ALLOWED_PROPOSALS_OPTIONS} from '~/Shared/enums/proposals';
import {GOVERNANCE_ACTIONS_OPTIONS} from '~/Shared/enums/actions';
import GovernanceService from '~/Services/GovernanceService';
import {CirclesCollection} from '~/Firebase/Databasee/Collections/CirclesCollection';
import {CONSEQUENCES} from '~/Shared/enums/consequences';
import {useRoute} from '@react-navigation/native';
import {MATH} from '~/Shared/enums/MATH';
import {ACTIONS} from '~/Shared/enums/actions';
import {PROPOSALS} from '~/Shared/enums/proposals';
import {RouteProps} from '~/Types/navigation';

const INITIAL_VALUES = {
  circleName: '',
  allowedProposals: null,
  allowedActions: null,
  duration: '',
  weights: '',
  quorum: '',
  minApprove: '',
  maxReject: '',
  consequencesTokens: '',
  consequencesAction: '',
  rulesTitle: '',
  rulesDefinition: '',
};

function CreateGovernance() {
  const route = useRoute<RouteProps<{commonId: string}>>();
  const {commonId} = route.params;

  async function formSave(values: typeof INITIAL_VALUES) {
    const circleId = CirclesCollection.doc().id;
    const circle = {
      id: circleId,
      name: values.circleName,
      reputation: {},
      allowedProposals: {
        [PROPOSALS.FUNDS_ALLOCATION]: true as true,
      },
      allowedActions: {
        [ACTIONS.CREATE_PROPOSAL]: true as true,
      },
    };
    const actions = {CREATE_PROPOSAL: {cost: 50}};
    const unstructuredRules = {
      title: values.rulesTitle,
      definition: values.rulesDefinition,
    };
    const consequences = {
      [CONSEQUENCES.SUCCESSFUL_INVITATION]: {
        tokens: Number(values.consequencesTokens),
        action: values.consequencesAction as MATH,
      },
    };
    const proposals = {
      [PROPOSALS.MEMBER_ADMITTANCE]: {
        global: {
          duration: Number(values.duration),
          quorum: Number(values.quorum),
          weights: [
            {
              circles: [circleId] as [string, ...string[]],
              value: Number(values.weights),
            },
          ],
          minApprove: Number(values.minApprove),
          maxReject: Number(values.maxReject),
        },
        limitations: {},
        local: {
          defaultCircle: circleId,
          optimisticAdmittance: true,
        },
      },
    };

    await GovernanceService.createGovernance({
      circles: [circle],
      actions,
      unstructuredRules,
      consequences,
      proposals,
      commonId,
      tokenPool: 0,
    });
  }

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      enableReinitialize={true}
      // validationSchema={validationSchema}
      onSubmit={formSave}>
      {({
        handleChange,
        handleBlur,
        values,
        errors,
        touched,
        setFieldValue,
        handleSubmit,
      }): ReactElement => (
        <>
          <ScrollView
            scrollEnabled={true}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{backgroundColor: '#fff'}}
            contentContainerStyle={{
              alignItems: 'center',
              margin: 20,
              paddingBottom: 40,
            }}>
            <Text style={styles.sectionTitle}>Circle</Text>
            <TextInputField
              errorMessage={errors && touched.circleName && errors.circleName}
              viewStyle={styles.textfieldView}
              placeholderText="12345678"
              autoCapitalize="none"
              label="Circle Name"
              autoCorrect={false}
              value={values.circleName}
              onChangeText={handleChange('circleName')}
              onBlur={handleBlur('circleName')}
            />
            <NativeSelectField
              errorMessage={
                errors && touched.allowedProposals && errors.allowedProposals
              }
              viewStyle={styles.rowRightView}
              label="Allowed Proposals"
              placeholder="Allowed Proposals"
              options={ALLOWED_PROPOSALS_OPTIONS}
              onChange={(allowedProposalValue) => {
                setFieldValue('allowedProposals', allowedProposalValue);
              }}
            />
            <NativeSelectField
              errorMessage={
                errors && touched.allowedActions && errors.allowedActions
              }
              viewStyle={styles.rowRightView}
              label="Allowed Actions"
              placeholder="Allowed Actions"
              options={GOVERNANCE_ACTIONS_OPTIONS}
              onChange={(allowedActionsValue) => {
                setFieldValue('allowedActions', allowedActionsValue);
              }}
            />
            <Text style={styles.sectionTitle}>Proposals Rules</Text>
            <TextInputField
              errorMessage={errors && touched.duration && errors.duration}
              viewStyle={styles.textfieldView}
              placeholderText="12345678"
              autoCapitalize="none"
              label="Duration"
              autoCorrect={false}
              value={values.duration}
              onChangeText={handleChange('duration')}
              onBlur={handleBlur('duration')}
            />
            <TextInputField
              errorMessage={errors && touched.weights && errors.weights}
              viewStyle={styles.textfieldView}
              placeholderText="12345678"
              autoCapitalize="none"
              label="Weights"
              autoCorrect={false}
              value={values.weights}
              onChangeText={handleChange('weights')}
              onBlur={handleBlur('weights')}
            />
            <TextInputField
              errorMessage={errors && touched.quorum && errors.quorum}
              viewStyle={styles.textfieldView}
              placeholderText="12345678"
              autoCapitalize="none"
              label="Quorum"
              autoCorrect={false}
              value={values.quorum}
              onChangeText={handleChange('quorum')}
              onBlur={handleBlur('quorum')}
            />
            <TextInputField
              errorMessage={errors && touched.minApprove && errors.minApprove}
              viewStyle={styles.textfieldView}
              placeholderText="12345678"
              autoCapitalize="none"
              label="Minimal Approve"
              autoCorrect={false}
              value={values.minApprove}
              onChangeText={handleChange('minApprove')}
              onBlur={handleBlur('minApprove')}
            />
            <TextInputField
              errorMessage={errors && touched.maxReject && errors.maxReject}
              viewStyle={styles.textfieldView}
              placeholderText="12345678"
              autoCapitalize="none"
              label="Maximum Reject"
              autoCorrect={false}
              value={values.maxReject}
              onChangeText={handleChange('maxReject')}
              onBlur={handleBlur('maxReject')}
            />
            <Text style={styles.sectionTitle}>Consequences</Text>
            <TextInputField
              errorMessage={
                errors &&
                touched.consequencesTokens &&
                errors.consequencesTokens
              }
              viewStyle={styles.textfieldView}
              placeholderText="12345678"
              autoCapitalize="none"
              label="Tokens"
              autoCorrect={false}
              value={values.consequencesTokens}
              onChangeText={handleChange('consequencesTokens')}
              onBlur={handleBlur('consequencesTokens')}
            />
            <TextInputField
              errorMessage={
                errors &&
                touched.consequencesAction &&
                errors.consequencesAction
              }
              viewStyle={styles.textfieldView}
              placeholderText="12345678"
              autoCapitalize="none"
              label="Actions"
              autoCorrect={false}
              value={values.consequencesAction}
              onChangeText={handleChange('consequencesAction')}
              onBlur={handleBlur('consequencesAction')}
            />
            <Text style={styles.sectionTitle}>Rules</Text>
            <TextInputField
              errorMessage={errors && touched.rulesTitle && errors.rulesTitle}
              viewStyle={styles.textfieldView}
              placeholderText="12345678"
              autoCapitalize="none"
              label="Title"
              autoCorrect={false}
              value={values.rulesTitle}
              onChangeText={handleChange('rulesTitle')}
              onBlur={handleBlur('rulesTitle')}
            />
            <TextInputField
              errorMessage={
                errors && touched.rulesDefinition && errors.rulesDefinition
              }
              viewStyle={styles.textfieldView}
              placeholderText="12345678"
              autoCapitalize="none"
              label="Rules"
              autoCorrect={false}
              value={values.rulesDefinition}
              onChangeText={handleChange('rulesDefinition')}
              onBlur={handleBlur('rulesDefinition')}
            />
            <TouchableOpacity
              style={[styles.btn, styles.deleteBtn]}
              onPress={handleSubmit}>
              <Text style={styles.btnDeleteText}>Save</Text>
            </TouchableOpacity>
          </ScrollView>
        </>
      )}
    </Formik>
  );
}

export default observer(CreateGovernance);
