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
import TextInputField from '~/Components/FormikForm/TextInputField';
import {AddBankConfirmation, AddPhotoID} from '~/Components/Proposals';
import {IPaymeDocument} from '~/Firebase/Databasee/EntityTypes/IPaymeDocument';
import BankAccountService from '~/Services/BankAccountService';
import {
  BANK_CODES,
  BANK_NAMES_OPTIONS,
  GENDER_OPTIONS,
} from '~/Util/constants/dropdown';
import {useStore} from '~/Util/hooks/useStore';
import {NativeSelectField} from '~/Components/FormikForm/NativeSelectField';
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
  const authStore = useStore('authStore');

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
            firstName: authStore?.userInfo?.firstName,
            lastName: authStore?.userInfo?.lastName,
            bankCode: Number(values.bankCode),
            branchNumber: Number(values.branchNumber),
            accountNumber: Number(values.accountNumber),
            streetNumber: Number(values.streetNumber),
            identificationDocs,
          },
          ['photoID', 'bankConfirmation'],
        ),
      );
      onSubmit();
      Toast.success('Done');
    } catch (err) {
      Toast.error('Something went wrong');
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
        setFieldTouched,
        setFieldError,
        handleSubmit,
      }): ReactElement => (
        <>
          <View style={styles.plug} />
          <ScrollView
            scrollEnabled={true}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.body}
            contentContainerStyle={{
              alignItems: 'center',
              paddingBottom: insets.bottom + 22,
            }}>
            <Text style={styles.title}>Add Bank Account</Text>
            <Text style={styles.text}>
              The following details are required in order to wire a {'\n'}{' '}
              refund after you executed an approved proposal
            </Text>

            <Text style={styles.sectionTitle}>Personal Info</Text>
            <TextInputField
              errorMessage={errors && touched.socialId && errors.socialId}
              viewStyle={styles.textfieldView}
              placeholderText="123456789"
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
              <NativeSelectField
                errorMessage={errors && touched.gender && errors.gender}
                viewStyle={styles.rowRightView}
                label="Gender"
                placeholder=""
                options={GENDER_OPTIONS}
                onChange={(genderValue) => {
                  setFieldValue('gender', genderValue);
                }}
              />
            </View>
            <Text style={styles.sectionTitle}>Contact Info</Text>
            <TextInputField
              errorMessage={errors && touched.phoneNumber && errors.phoneNumber}
              viewStyle={styles.textfieldView}
              placeholderText="1234567890"
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
            <NativeSelectField
              label="Bank Name"
              placeholder="Bank Leumi"
              options={BANK_NAMES_OPTIONS}
              viewStyle={styles.textfieldView}
              errorMessage={errors && touched.bankName && errors.bankName}
              onChange={(bankValue) => {
                setFieldValue('bankName', bankValue);
                handleChange('bankCode')(
                  BANK_CODES[bankValue as keyof typeof BANK_CODES].toString(),
                );
              }}
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
            <Text style={styles.sectionTitle}>Billing Details</Text>
            <TextInputField
              errorMessage={
                errors && touched.streetAddress && errors.streetAddress
              }
              viewStyle={styles.textfieldView}
              placeholderText="Street Address"
              label="Address"
              autoCorrect={false}
              value={values.streetAddress}
              onChangeText={handleChange('streetAddress')}
              onBlur={handleBlur('streetAddress')}
            />
            <View style={styles.rowFieldsView}>
              <TextInputField
                errorMessage={
                  errors && touched.streetNumber && errors.streetNumber
                }
                viewStyle={styles.rowLeftView}
                placeholderText="123"
                autoCapitalize="none"
                label="Street Number"
                autoCorrect={false}
                value={values.streetNumber}
                onChangeText={handleChange('streetNumber')}
                onBlur={handleBlur('streetNumber')}
              />
              <TextInputField
                errorMessage={errors && touched.city && errors.city}
                viewStyle={styles.rowRightView}
                placeholderText="City"
                label="City"
                autoCorrect={false}
                value={values.city}
                onChangeText={handleChange('city')}
                onBlur={handleBlur('city')}
              />
            </View>
            <CountryDropdownField
              errorMessage={errors && touched.country && errors.country}
              label="Country/Region"
              onChange={(countryValue) => {
                setFieldValue('country', countryValue);
              }}
            />
            <TextInputField
              errorMessage={errors && touched.email && errors.email}
              viewStyle={styles.textfieldView}
              label="Email"
              //infoLabel="Required"
              placeholderText={authStore.userInfo?.email}
              onBlur={handleBlur('email')}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={handleChange('email')}
            />
            {isAddingNew && (
              <View style={styles.fileSelectorBlock}>
                <AddPhotoID
                  error={errors && touched.photoID && !!errors.photoID}
                  onSelect={(photoID) => {
                    if (photoID) {
                      setFieldTouched('photoID', true, true);
                      setFieldValue('photoID', photoID);
                    } else {
                      setFieldTouched('photoID', true, true);
                      setFieldValue('photoID', null);
                      setFieldError('photoID', 'Please select a Photo ID');
                    }
                  }}
                />
                <AddBankConfirmation
                  error={
                    errors &&
                    touched.bankConfirmation &&
                    (errors.bankConfirmation?.mimeType ||
                      !!errors.bankConfirmation)
                  }
                  onSelect={(bankConfirmation) => {
                    if (bankConfirmation) {
                      setFieldTouched('bankConfirmation', true, true);
                      setFieldValue('bankConfirmation', bankConfirmation);
                    } else {
                      setFieldTouched('bankConfirmation', true, true);
                      setFieldValue('bankConfirmation', null);
                      setFieldError(
                        'bankConfirmation',
                        'Please select a Bank Confirmation',
                      );
                    }
                  }}
                />
              </View>
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
