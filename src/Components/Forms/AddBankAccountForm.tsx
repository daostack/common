import {Formik} from 'formik';
import React, {ReactElement} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {omit} from 'lodash';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TextInputField from '~/Components/FormikForm/TextInputField';
import {colors, font, layout} from '~/Theme';
import {object, string, number} from 'yup';
import {STATUS_BAR_HEIGHT} from '~/Util/bottomTabHeight';
import {AddBankConfirmation, AddPhotoID} from '~/Components/Proposals';
import DatePickerInput from '~/Components/FormikForm/DatePickerInput';
import {GenderSelectField} from '~/Components/FormikForm/GenderSelectField';
import {CountryDropdownField} from '~/Components/FormikForm/CountryDropdownField';

const {height} = Dimensions.get('window');

interface Props {
  onDelete?: () => void;
  onSubmit: (values: any) => void;
  isAddingNew: boolean;
}

const validationSchema = object({
  socialId: number()
    .label('ID Number')
    .typeError('ID Number must contain only numbers')
    .required(),
  socialIdIssueDate: string()
    .label('ID Issuance day')
    .min(10, 'ID Issuance day is a required field')
    .required(),
  birthdate: string()
    .label('Birth Date')
    .min(10, 'Birth Date is a required field')
    .required(),
  gender: number()
    .label('Gender')
    .min(0, 'Gender is a required field')
    .required(),
  bankName: string().label('Bank Name').required(),
  branchNumber: number()
    .typeError('Branch Number must contain only numbers')
    .label('Branch Number')
    .required(),
  phoneNumber: number()
    .typeError('Phone Number must contain only numbers')
    .label('Phone Number')
    .required(),
  // TODO: Add when API will allow sent email with body
  // email: string().email().label('Email').required(),
  accountNumber: number()
    .typeError('Bank Account Number must contain only numbers')
    .label('Bank Account Number')
    .required(),
  bankCode: number().label('Bank Code').required(),
  country: string().label('Country').required(),
  city: string().label('City').required(),
  streetAddress: string().label('Street Address').required(),
  streetNumber: number()
    .typeError('Street Number must contain only numbers')
    .label('Street Number')
    .required(),
  photoID: object()
    .shape({
      downloadURL: string().required(),
    })
    .label('PhotoID')
    .required(),
  bankConfirmation: object()
    .shape({
      downloadURL: string().required(),
    })
    .label('Bank Confirmation')
    .required(),
});

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
  photoID: '',
  bankConfirmation: '',
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

  const formSave = (values: typeof INITIAL_VALUES): void => {
    const identificationDocs = [values.photoID, values.bankConfirmation];
    onSubmit(
      omit(
        {
          ...values,
          identificationDocs,
        },
        ['photoID', 'bankConfirmation', 'email'],
      ),
    );
  };

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
            />

            <View style={styles.rowFieldsView}>
              <DatePickerInput
                errorMessage={errors && touched.birthdate && errors.birthdate}
                viewStyle={styles.rowLeftView}
                label="Birth Date"
                value={values.birthdate}
                onChangeText={handleChange('birthdate')}
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
                  error={!!errors.photoID}
                  onSelect={(photoID) => {
                    setFieldValue('photoID', photoID);
                  }}
                />
                <AddBankConfirmation
                  error={!!errors.bankConfirmation}
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
                <Text style={styles.btnDeleteText}>Save</Text>
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

const styles = StyleSheet.create({
  body: {
    width: '100%',
    maxHeight: height - 150 - STATUS_BAR_HEIGHT,
  },
  plug: {
    backgroundColor: colors.paleblue,
    width: 72,
    height: 6,
    borderRadius: 2,
    alignSelf: 'center',
  },
  image: {
    height: 116,
    aspectRatio: 1,
  },
  title: {
    ...font.primary.bold,
    fontSize: 20,
    lineHeight: 28,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    ...font.primary.bold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.black,
    textAlign: 'left',
    width: '100%',
    marginTop: 14,
    marginBottom: 4,
  },
  text: {
    ...font.primary.regular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  rowFieldsView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 1000000,
    marginTop: 16,
    marginBottom: 10,
  },
  rowLeftView: {
    flex: 1,
    marginRight: 8,
    marginTop: 0,
  },
  rowRightView: {
    flex: 1,
    marginLeft: 8,
    marginTop: 0,
  },
  textfieldView: {
    alignSelf: 'stretch',
    marginTop: 16,
    flex: 1,
    paddingBottom: 0,
  },
  btn: {
    alignSelf: 'stretch',
    ...layout.content,
    ...layout.flexRow,
    ...layout.flexStart,
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 32,
    borderColor: colors.grey4,
    justifyContent: 'center',
  },
  deleteBtn: {
    marginTop: 35,
    marginBottom: 16,
    backgroundColor: colors.mainBlue,
  },
  btnText: {
    textAlign: 'center',
    ...font.primary.regular,
    fontSize: 16,
    lineHeight: 20,
    color: colors.mainBlue,
  },
  btnDeleteText: {
    textAlign: 'center',
    ...font.primary.regular,
    fontSize: 16,
    lineHeight: 20,
    color: colors.white,
  },
  inputTitle: {
    ...font.primary.regular,
    width: '100%',
    textAlign: 'left',
    lineHeight: 20,
    fontSize: 14,
  },
});
