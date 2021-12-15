import {Formik} from 'formik';
import React, {ReactElement, useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TextInputField from '~/Components/FormikForm/TextInputField';
import {colors, font, layout} from '~/Theme';
import {object, string, number} from 'yup';

interface Props {
  onCancel: () => void;
  onDelete: () => void;
}

const validationSchema = object({
  idNumber: number().label('12345678').moreThan(9999999),
  bankName: string().label('Bank Jeumi'),
  branchNumber: number().label('123').moreThan(99),
  accountNumber: number().label('12345678').moreThan(9999999),
});

export const AddBankAccountForm = ({
  onCancel,
  onDelete,
}: Props): ReactElement => {
  const formikRef = useRef();
  const insets = useSafeAreaInsets();

  const formSave = () => {
    console.log('save');
  };
  return (
    <Formik
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
        isValid,
      }): ReactElement => (
        <View style={[styles.body, {marginBottom: insets.bottom}]}>
          <View style={styles.plug} />
          <Text style={styles.title}>Add Bank Account</Text>
          <Text style={styles.text}>
            The following details are required in order to wire a refund after
            you executed an approved proposal
          </Text>
          <>
            <TextInputField
              errorMessage={errors && touched.idNumber && errors.idNumber}
              viewStyle={{alignSelf: 'stretch'}}
              placeholderText="12345678"
              autoCapitalize="none"
              label="ID Number"
              autoCorrect={false}
              onBlur={handleBlur('idNumber')}
            />
          </>
          <>
            <TextInputField
              errorMessage={errors && touched.bankName && errors.bankName}
              viewStyle={{alignSelf: 'stretch'}}
              placeholderText="Bank Jeumi"
              autoCapitalize="none"
              label="Bank Name"
              autoCorrect={false}
              onBlur={handleBlur('bankName')}
            />
          </>
          <>
            <TextInputField
              errorMessage={
                errors && touched.branchNumber && errors.branchNumber
              }
              viewStyle={{alignSelf: 'stretch'}}
              placeholderText="123"
              autoCapitalize="none"
              label="Branch Number"
              autoCorrect={false}
              onBlur={handleBlur('branchNumber')}
            />
          </>
          <>
            <TextInputField
              errorMessage={
                errors && touched.accountNumber && errors.accountNumber
              }
              viewStyle={{alignSelf: 'stretch'}}
              placeholderText="12345678"
              autoCapitalize="none"
              label="Account Number"
              autoCorrect={false}
              onBlur={handleBlur('accountNumber')}
            />
          </>
          <>
            <TouchableOpacity
              style={[styles.btn, styles.deleteBtn]}
              onPress={onCancel}>
              <Text style={styles.btnDeleteText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={onDelete}>
              <Text style={styles.btnText}>Remove Account</Text>
            </TouchableOpacity>
          </>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  body: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 7,
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
  text: {
    ...font.primary.regular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 6,
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
