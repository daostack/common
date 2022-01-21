import {Formik} from 'formik';
import React, {ReactElement, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TextInputField from '~/Components/FormikForm/TextInputField';
import {colors, font, layout} from '~/Theme';
import {object, string, number} from 'yup';
import {STATUS_BAR_HEIGHT} from '~/Util/bottomTabHeight';
import {AddBankConfirmation, AddPhotoID} from '~/Components/Proposals';
import DatePickerInput from '~/Components/FormikForm/DatePickerInput';
import {GenderSelectField} from '~/Components/FormikForm/GenderSelectField';

const {height} = Dimensions.get('window');

interface Props {
  onDelete?: () => void;
  onSubmit: (values: any) => void;
  isAddingNew: boolean;
}

// TODO: Update validation schema
const validationSchema = object({
  idNumber: number().label('12345678').moreThan(9999999),
  bankName: string().label('Bank Jeumi'),
  branchNumber: number().label('123').moreThan(99),
  accountNumber: number().label('12345678').moreThan(9999999),
});

export const AddBankAccountForm = ({
  onDelete,
  onSubmit,
  isAddingNew = false,
}: Props): ReactElement => {
  const formikRef = useRef();
  const insets = useSafeAreaInsets();

  const formSave = (values: any): void => {
    onSubmit(values);
  };

  return (
    <Formik
      initialValues={{
        idNumber: '',
        idIssuanceDate: '',
        birth: '',
        gender: '',
        bankName: '',
        branchNumber: '',
        phoneNumber: '',
        email: '',
        bankAccountNumber: '',
        bankCode: '',
        photoID: null,
        bankConfirmation: null,
      }}
      innerRef={formikRef}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={formSave}>
      {({
        handleChange,
        handleBlur,
        values,
        errors,
        touched,
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
              errorMessage={errors && touched.idNumber && errors.idNumber}
              viewStyle={styles.textfieldView}
              placeholderText="12345678"
              autoCapitalize="none"
              label="ID Number"
              autoCorrect={false}
              value={values.idNumber}
              onChangeText={handleChange('idNumber')}
              onBlur={handleBlur('idNumber')}
            />
            <DatePickerInput
              viewStyle={styles.textfieldView}
              label="ID Issuance day"
              value={values.idIssuanceDate}
              onChangeText={handleChange('idIssuanceDate')}
            />

            <View style={styles.rowFieldsView}>
              <DatePickerInput
                viewStyle={styles.rowLeftView}
                label="Birth Date"
                value={values.birth}
                onChangeText={handleChange('birth')}
              />
              <GenderSelectField
                viewStyle={styles.rowRightView}
                label="Gender"
                onChange={handleChange('gender')}
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
            <TextInputField
              errorMessage={errors && touched.phoneNumber && errors.phoneNumber}
              viewStyle={styles.textfieldView}
              placeholderText="Name@email.com"
              autoCapitalize="none"
              label="Email"
              autoCorrect={false}
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
            />
            <Text style={styles.sectionTitle}>Bank Details</Text>
            <TextInputField
              errorMessage={
                errors && touched.bankAccountNumber && errors.bankAccountNumber
              }
              viewStyle={styles.textfieldView}
              placeholderText="12345678"
              autoCapitalize="none"
              label="Bank Account Number"
              autoCorrect={false}
              value={values.bankAccountNumber}
              onChangeText={handleChange('bankAccountNumber')}
              onBlur={handleBlur('bankAccountNumber')}
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
            {isAddingNew && (
              <>
                <AddPhotoID onSelect={handleChange('photoID')} />
                <AddBankConfirmation
                  onSelect={handleChange('bankConfirmation')}
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
    paddingHorizontal: 7,
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
    marginVertical: 14,
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
    zIndex: 1000000,
    marginTop: 16,
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
