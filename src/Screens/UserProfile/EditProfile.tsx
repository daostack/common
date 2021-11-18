import React, {ReactElement, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
} from 'react-native';
import {Formik, FormikProps} from 'formik';
import {isEqual, pick} from 'lodash';
import {object, string} from 'yup';
import {UserImage} from '~/Components';
import {layout, text, font, colors} from '~/Theme';
import {inject, observer} from 'mobx-react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from '~/Assets/iconfont/Icon';
import Loader from '~/Components/Loader';
import {BOTTOM_SHEET} from '~/Screens/BottomSheetScreens';
import {Toast} from '~/Components';
import logger from '~/Services/Logger';
import {useStore} from '~/Stores';
import {useNavigation} from '@react-navigation/core';
import {StackActions} from '@react-navigation/routers';
import {UserModel} from '~/Stores/Models';

const validationSchema = object({
  firstName: string().required().label('The first name'),
  lastName: string().required().label('The last name'),
  photoURL: string(),
  intro: string().label('The intro'),
});

type FormValues = Pick<
  UserModel,
  'photoURL' | 'firstName' | 'lastName' | 'country' | 'email' | 'intro'
>;

const EditProfile = (): ReactElement => {
  const {
    authStore,
    uiStore: {bottomSheetStore},
  } = useStore();
  const formikRef = useRef<FormikProps<FormValues> | null>(null);
  const user = authStore.user.current()!;
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setParams({
      title: user.isCompleteAccount ? false : 'Edit my profile',
    });
    if (user.isCompleteAccount) {
      navigation.setOptions({
        headerLeft: false,
      });
    } else {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity
            onPress={async () => {
              onFormClose();
            }}>
            <Icon name="left-arrow" size={32} />
          </TouchableOpacity>
        ),
      });
    }
  }, [[user.isCompleteAccount]]);

  const formSave = async (values: FormValues): Promise<void> => {
    onFormSubmitStart();
    try {
      await user.update({
        firstName: values.firstName,
        lastName: values.lastName,
        photoURL: values.photoURL,
        country: values.country,
        intro: values.intro,
      });
    } catch (err) {
      logger.log('Error -> ', err);
      throw err;
    }
    onFormSubmitEnd();
  };

  const onFormSubmitStart = (): void => {
    Toast.loading('Updating your profile...');
  };

  const onFormSubmitEnd = (): void => {
    Toast.done('Your profile is updated');
    navigation.goBack();
  };

  const onFormClose = () => {
    const values = (formikRef?.current ?? {values: {}})?.values;
    try {
      validationSchema.validateSync(values);
      if (
        user.isSignedWithApple &&
        user.isCompleteAccount &&
        (!user.firstName || !user.lastName)
      ) {
        return;
      }
    } catch (err) {
      return;
    }

    if (
      isEqual(
        values,
        pick(user, [
          'photoURL',
          'firstName',
          'lastName',
          'country',
          'email',
          'intro',
        ]),
      )
    ) {
      navigation.dispatch(StackActions.pop(1));
    } else {
      bottomSheetStore.showBottomSheet(BOTTOM_SHEET.UNSAVED_CHANGES, {
        navigation,
        onContinueEditing: closeBottomSheet,
        onLeaveWithoutSaving: closeBottomSheet,
      });
    }
  };

  const closeBottomSheet = () => {
    bottomSheetStore.hideBottomSheet();
  };

  const saveBtnStyle = user.isCompleteAccount
    ? styles.bigSaveBtn
    : layout.marginLeftS;

  return (
    <Formik
      innerRef={formikRef}
      enableReinitialize={true}
      initialValues={
        {
          photoURL: user.photoURL,
          firstName: user.firstName,
          lastName: user.lastName,
          country: user.country,
          email: user.email,
          intro: user.intro,
        } as FormValues
      }
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
        <>
          <StatusBar barStyle="dark-content" />

          <SafeAreaView style={styles.container}>
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              keyboardShouldPersistTaps="always"
              style={styles.scrollView}>
              <View style={styles.body}>
                <View
                  style={{
                    alignSelf: 'stretch',
                    flexGrow: 1,
                    marginTop: 0,
                  }}>
                  {user.isCompleteAccount && (
                    <View style={{marginBottom: 32}}>
                      <Text style={styles.title}>Complete your account</Text>
                      <Text style={styles.subtitleForm}>
                        Help the community to get to know you better
                      </Text>
                    </View>
                  )}

                  {user ? (
                    <>
                      <UserImage isAvatar={true} user={user} editable={true} />
                      <View style={styles.emailContainer}>
                        <Text style={text.ashleyjquimbacom}>
                          {values.email}
                        </Text>
                      </View>

                      <TextInput
                        // errorMessage={
                        //   errors && touched.firstName && errors.firstName
                        // }
                        value={values.firstName}
                        // viewStyle={{alignSelf: 'stretch'}}
                        // label="First name"
                        // infoLabel="Required"
                        placeholderText="First name"
                        // onBlur={handleBlur('firstName')}
                        // autoCapitalize="none"
                        // autoCorrect={false}
                        // onChangeText={handleChange('firstName')}
                      />

                      <TextInput
                        // errorMessage={
                        //   errors && touched.lastName && errors.lastName
                        // }
                        value={values.lastName}
                        // viewStyle={{alignSelf: 'stretch'}}
                        // label="Last name"
                        // infoLabel="Required"
                        // placeholderText="Last name"
                        // autoCapitalize="none"
                        // autoCorrect={false}
                        // onBlur={handleBlur('lastName')}
                        // onChangeText={handleChange('lastName')}
                      />

                      {user.isCompleteAccount && (
                        <CountrySelectField
                          label="Country"
                          infoLabel="Required"
                          value={values.country}
                          onBlur={handleBlur('country')}
                          onChange={handleChange('country')}
                        />
                      )}

                      <TextInputField
                        errorMessage={errors && touched.intro && errors.intro}
                        label="Intro"
                        placeholderText="What are you most passionate about, really good at, or love"
                        autoCapitalize="none"
                        autoCorrect={false}
                        multiline={true}
                        onBlur={handleBlur('lastName')}
                        value={values.intro}
                        onChangeText={handleChange('intro')}
                      />
                    </>
                  ) : (
                    <Loader />
                  )}
                </View>
              </View>
            </ScrollView>

            <View
              style={
                user.isCompleteAccount
                  ? styles.oneBtnContainer
                  : styles.multiBtnContainer
              }>
              {!user.isCompleteAccount && (
                <TouchableOpacity
                  style={{
                    ...styles.btns,
                    ...layout.btnOutline,
                    ...layout.marginRightS,
                  }}
                  onPress={onFormClose}>
                  <Text style={text.buttonblue}>Cancel</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={{
                  ...styles.btns,
                  ...layout.btnPrimary,
                  ...saveBtnStyle,
                }}
                disabled={!isValid}
                onPress={() => handleSubmit()}>
                <Text style={text.buttoncenterwhite}>Save</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  btns: {
    alignSelf: 'stretch',
  },
  bigSaveBtn: {
    width: '100%',
  },
  oneBtnContainer: {
    padding: 20,
    backgroundColor: colors.white,
  },
  multiBtnContainer: {
    ...layout.content,
    ...layout.flexRow,
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: colors.white,
  },
  scrollView: {
    flexGrow: 1,

    backgroundColor: colors.white,
  },
  body: {
    ...layout.content,
  },
  container: {
    flex: 1,
  },
  subtitle: {
    ...text.greyText,
    ...layout.marginTopS,
  },
  emailContainer: {
    ...layout.content,
    ...layout.marginBottomS,
    marginTop: 0,
  },
  title: {
    ...font.heading.bold,
    ...font.fontSize(5),
    textAlign: 'center',
  },
  subtitleForm: {
    textAlign: 'center',
    color: colors.grey3,
    ...font.fontSize(2),
    ...font.primary.regular,
    paddingVertical: 5,
  },
});

export default inject('rootStore')(observer(EditProfile));
