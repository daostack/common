import {Formik} from 'formik';
import {omit} from 'lodash';
import React, {ReactElement, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CountryDropdownField} from '~/Components/FormikForm/CountryDropdownField';
import DatePickerInput from '~/Components/FormikForm/DatePickerInput';
import {GenderSelectField} from '~/Components/FormikForm/GenderSelectField';
import TextInputField from '~/Components/FormikForm/TextInputField';
import {AddBankConfirmation, AddPhotoID} from '~/Components/Proposals';
import {IPaymeDocument} from '~/Firebase/Databasee/EntityTypes/IPaymeDocument';
import BankAccountService from '~/Services/BankAccountService';
import Toast from '~/Util/Toast';
import {styles} from './styles';
import {validationSchema} from './validationSchema';

interface Props {
  onDelete?: () => void;
  onSubmit: () => void;
  isAddingNew: boolean;
}

const INITIAL_VALUES = {
  socialId: '',
  socialIdIssueDate: '',
  birthdate: '',
  gender: -1,
  bankName: '',
  branchNumber: '',
  phoneNumber: '',
  email: '',
  accountNumber: '',
  bankCode: '',
  photoID: {},
  bankConfirmation: {},
  country: '',
  city: '',
  streetAddress: '',
  streetNumber: '',
};

export const AddBankAccountForm = ({
  onDelete,
  onSubmit,
  isAddingNew = false,
}: Props): ReactElement => {
  const insets = useSafeAreaInsets();

  const [isLoading, setLoading] = useState(false);

  async function formSave(values: typeof INITIAL_VALUES): Promise<void> {
    try {
      setLoading(true);
      const identificationDocs = [
        values.photoID,
        values.bankConfirmation,
      ] as IPaymeDocument[];
      await BankAccountService.addBankAccountDetails(
        omit(
          {
            ...values,
            bankCode: Number(values.bankCode),
            branchNumber: Number(values.branchNumber),
            accountNumber: Number(values.accountNumber),
            streetNumber: Number(values.streetNumber),
            identificationDocs,
          },
          ['photoID', 'bankConfirmation', 'email'],
        ),
      );
      onSubmit();
      Toast.success('Done');
    } catch (err) {
      Toast.error('Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      enableReinitialize={true}
      validationSchema={validationSchema}
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
          <View style={styles.plug} />
          <ScrollView
            scrollEnabled={true}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            style={[styles.body, {marginBottom: insets.bottom}]}
            contentContainerStyle={{alignItems: 'center'}}>
            <Text style={styles.title}>Add Bank Account</Text>
            <Text style={styles.text}>
              The following details are required in order to wire a refund after
              you executed an approved proposal
            </Text>

            <Text style={styles.sectionTitle}>Personal Info</Text>
            <TextInputField
              errorMessage={errors && touched.socialId && errors.socialId}
              viewStyle={styles.textfieldView}
              placeholderText="12345678"
              autoCapitalize="none"
              label="ID Number"
              autoCorrect={false}
              value={values.socialId}
              onChangeText={handleChange('socialId')}
              onBlur={handleBlur('socialId')}
            />
            <DatePickerInput
              errorMessage={
                errors && touched.socialIdIssueDate && errors.socialIdIssueDate
              }
              viewStyle={styles.textfieldView}
              label="ID Issuance day"
              value={values.socialIdIssueDate}
              onChangeText={handleChange('socialIdIssueDate')}
              onBlur={handleBlur('socialIdIssueDate')}
            />

            <View style={styles.rowFieldsView}>
              <DatePickerInput
                errorMessage={errors && touched.birthdate && errors.birthdate}
                viewStyle={styles.rowLeftView}
                label="Birth Date"
                value={values.birthdate}
                onChangeText={handleChange('birthdate')}
                onBlur={handleBlur('birthdate')}
              />
              <GenderSelectField
                errorMessage={errors && touched.gender && errors.gender}
                viewStyle={styles.rowRightView}
                label="Gender"
                onChange={(genderValue) => {
                  setFieldValue('gender', genderValue);
                }}
              />
            </View>
            <Text style={styles.sectionTitle}>Contact Info</Text>
            <TextInputField
              errorMessage={errors && touched.phoneNumber && errors.phoneNumber}
              viewStyle={styles.textfieldView}
              placeholderText="12345678"
              autoCapitalize="none"
              label="Phone Number"
              autoCorrect={false}
              value={values.phoneNumber}
              onChangeText={handleChange('phoneNumber')}
              onBlur={handleBlur('phoneNumber')}
            />
            {/* <TextInputField
              errorMessage={errors && touched.email && errors.email}
              viewStyle={styles.textfieldView}
              placeholderText="Name@email.com"
              autoCapitalize="none"
              label="Email"
              autoCorrect={false}
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
            /> */}
            <Text style={styles.sectionTitle}>Bank Details</Text>
            <TextInputField
              errorMessage={
                errors && touched.accountNumber && errors.accountNumber
              }
              viewStyle={styles.textfieldView}
              placeholderText="12345678"
              autoCapitalize="none"
              label="Bank Account Number"
              autoCorrect={false}
              value={values.accountNumber}
              onChangeText={handleChange('accountNumber')}
              onBlur={handleBlur('accountNumber')}
            />
            <TextInputField
              errorMessage={errors && touched.bankName && errors.bankName}
              viewStyle={styles.textfieldView}
              placeholderText="Bank Jeumi"
              autoCapitalize="none"
              label="Bank Name"
              autoCorrect={false}
              value={values.bankName}
              onChangeText={handleChange('bankName')}
              onBlur={handleBlur('bankName')}
            />
            <View style={styles.rowFieldsView}>
              <TextInputField
                errorMessage={
                  errors && touched.branchNumber && errors.branchNumber
                }
                viewStyle={styles.rowLeftView}
                placeholderText="123"
                autoCapitalize="none"
                label="Branch Number"
                autoCorrect={false}
                value={values.branchNumber}
                onChangeText={handleChange('branchNumber')}
                onBlur={handleBlur('branchNumber')}
              />
              <TextInputField
                errorMessage={errors && touched.bankCode && errors.bankCode}
                viewStyle={styles.rowRightView}
                placeholderText="123"
                autoCapitalize="none"
                label="Bank Code"
                autoCorrect={false}
                value={values.bankCode}
                onChangeText={handleChange('bankCode')}
                onBlur={handleBlur('bankCode')}
              />
            </View>
            <Text style={styles.sectionTitle}>Address Details</Text>
            <CountryDropdownField
              errorMessage={errors && touched.country && errors.country}
              viewStyle={styles.textfieldView}
              label="Country"
              onChange={(countryValue) => {
                setFieldValue('country', countryValue);
              }}
            />
            <TextInputField
              errorMessage={errors && touched.city && errors.city}
              viewStyle={styles.textfieldView}
              placeholderText="City"
              label="City"
              autoCorrect={false}
              value={values.city}
              onChangeText={handleChange('city')}
              onBlur={handleBlur('city')}
            />
            <TextInputField
              errorMessage={
                errors && touched.streetAddress && errors.streetAddress
              }
              viewStyle={styles.textfieldView}
              placeholderText="Street Address"
              label="Street Address"
              autoCorrect={false}
              value={values.streetAddress}
              onChangeText={handleChange('streetAddress')}
              onBlur={handleBlur('streetAddress')}
            />
            <TextInputField
              errorMessage={
                errors && touched.streetNumber && errors.streetNumber
              }
              viewStyle={styles.textfieldView}
              placeholderText="123"
              autoCapitalize="none"
              label="Street Number"
              autoCorrect={false}
              value={values.streetNumber}
              onChangeText={handleChange('streetNumber')}
              onBlur={handleBlur('streetNumber')}
            />
            {isAddingNew && (
              <>
                <AddPhotoID
                  error={touched.photoID && !!errors.photoID}
                  onSelect={(photoID) => {
                    setFieldValue('photoID', photoID);
                  }}
                />
                <AddBankConfirmation
                  error={touched.bankConfirmation && !!errors.bankConfirmation}
                  onSelect={(bankConfirmation) => {
                    setFieldValue('bankConfirmation', bankConfirmation);
                  }}
                />
              </>
            )}
            <>
              <TouchableOpacity
                style={[styles.btn, styles.deleteBtn]}
                onPress={handleSubmit}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.btnDeleteText}>Save</Text>
                )}
              </TouchableOpacity>
              {!isAddingNew && onDelete && (
                <TouchableOpacity style={styles.btn} onPress={onDelete}>
                  <Text style={styles.btnText}>Remove Account</Text>
                </TouchableOpacity>
              )}
            </>
          </ScrollView>
        </>
      )}
    </Formik>
  );
};
