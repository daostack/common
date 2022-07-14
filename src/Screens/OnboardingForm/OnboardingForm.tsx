import React, {ReactElement, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, font, layout} from '~/Theme';
import {Formik} from 'formik';
import Toast from '~/Util/Toast';
import {validationSchema} from './validationSchema';
import TextInputField from '~/Components/FormikForm/TextInputField';
import OnBoardingService from '~/Services/OnBoardingService';

const INITIAL_VALUES = {
  name: '',
  commonTitle: '',
  description: '',
  residence: '',
  phoneNumber: '',
  email: '',
};

export const OnboardingForm = () => {
  const insets = useSafeAreaInsets();

  const [isLoading, setLoading] = useState(false);

  async function formSave(values: typeof INITIAL_VALUES): Promise<void> {
    try {
      setLoading(true);
      await OnBoardingService.sendEmail({
        senderEmail: values.email,
        senderName: values.name,
        text: values.description,
        type: 'CONTACT_US_ADMIN',
        // commonTitle: values.commonTitle,
        // residence: values.residence,
        // phoneNumber: Number(values.phoneNumber),
      });
      Toast.success('Request has been sent');
    } catch (err) {
      Toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.body, {paddingTop: insets.top}]}>
        <View style={styles.sectionContainer}>
          <Image
            source={require('~/Assets/newLogoMobile.png')}
            style={styles.logo}
          />
        </View>
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
            handleSubmit,
          }): ReactElement => (
            <>
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
                <Text
                  style={{
                    alignSelf: 'center',
                    ...font.primary.bold,
                    fontSize: 20,
                    marginBottom: 15,
                  }}>
                  Launch a Common
                </Text>
                <Text>
                  We are looking for initiatives that are ready to launch and be
                  our superusers as we design the product further.
                </Text>
                <TextInputField
                  errorMessage={errors && touched.name && errors.name}
                  viewStyle={styles.textfieldView}
                  placeholderText="Name"
                  label="Your name"
                  autoCorrect={false}
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                />
                {false && (
                  <TextInputField
                    errorMessage={
                      errors && touched.commonTitle && errors.commonTitle
                    }
                    viewStyle={styles.textfieldView}
                    placeholderText="Common Title"
                    label="What is the topic of the Common you want to launch?"
                    autoCorrect={false}
                    value={values.commonTitle}
                    onChangeText={handleChange('commonTitle')}
                    onBlur={handleBlur('commonTitle')}
                  />
                )}
                <TextInputField
                  errorMessage={
                    errors && touched.description && errors.description
                  }
                  viewStyle={styles.textfieldView}
                  placeholderText="Description"
                  label="Please tell us a bit about the initiative and the people behind it"
                  autoCorrect={false}
                  value={values.description}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                />
                {false && (
                  <TextInputField
                    errorMessage={
                      errors && touched.residence && errors.residence
                    }
                    viewStyle={styles.textfieldView}
                    label="Where are you from"
                    autoCorrect={false}
                    value={values.residence}
                    onChangeText={handleChange('residence')}
                    onBlur={handleBlur('residence')}
                  />
                )}
                <TextInputField
                  errorMessage={errors && touched.email && errors.email}
                  viewStyle={styles.textfieldView}
                  placeholderText="example@gmail.com"
                  label="Email"
                  value={values.email}
                  onBlur={handleBlur('email')}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={handleChange('email')}
                />
                {false && (
                  <TextInputField
                    errorMessage={
                      errors && touched.phoneNumber && errors.phoneNumber
                    }
                    viewStyle={styles.textfieldView}
                    placeholderText="1234567890"
                    autoCapitalize="none"
                    label="Phone Number"
                    autoCorrect={false}
                    value={values.phoneNumber}
                    onChangeText={handleChange('phoneNumber')}
                    onBlur={handleBlur('phoneNumber')}
                  />
                )}
                <>
                  <TouchableOpacity
                    style={[styles.btn, styles.deleteBtn]}
                    onPress={handleSubmit}>
                    {isLoading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles.btnDeleteText}>Continue</Text>
                    )}
                  </TouchableOpacity>
                </>
              </ScrollView>
            </>
          )}
        </Formik>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: colors.white,
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 15,
  },
  sectionContainer: {
    ...layout.marginTopL,
    marginBottom: 34,
    alignItems: 'center',
  },
  buttonConatiner: {
    ...layout.marginBottomL,
    ...layout.marginTopL,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginHorizontal: 24,
    backgroundColor: colors.mainBlue,
  },
  buttonText: {
    color: colors.white,
    ...font.primary.regular,
    ...font.fontSize(4),
    ...layout.paddingVerticalM,
  },
  logo: {
    height: 40,
    resizeMode: 'contain',
  },
  textfieldView: {
    alignSelf: 'stretch',
    marginTop: 12,
    flex: 1,
    paddingBottom: 0,
    zIndex: 10,
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
    zIndex: 10,
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
  plug: {
    backgroundColor: colors.paleblue,
    width: 72,
    height: 6,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
});
