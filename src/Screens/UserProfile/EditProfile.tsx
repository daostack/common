import React, {ReactElement, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {Formik} from 'formik';
import {isEqual} from 'lodash';
import {object, string} from 'yup';
import TextInputField from '~/Components/FormikForm/TextInputField';
import ImageField from '~/Components/FormikForm/ImageField';
import {CountrySelectField} from '~/Components/FormikForm/CountrySelectField';
import {layout, text, font, colors} from '~/Theme';
import {inject, observer} from 'mobx-react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from '~/Assets/iconfont/Icon';
import Loader from '~/Components/Loader';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import Toast from '~/Util/Toast';
import AuthService from '~/Services/AuthService';
import logger from '~/Services/Logger';
import {AppRootStore} from '~/Types/store';
import {WithNavigation} from '~/Types/navigation';
import {UNKNOWN_COUNTRY} from '~/Util/countries';

const validationSchema = object({
  firstName: string().required().label('The first name'),
  lastName: string().required().label('The last name'),
  photoURL: string(),
  intro: string().label('The intro'),
});

interface Values {
  photoURL: string;
  firstName: string;
  lastName: string;
  country: string;
  email: string;
  intro: string;
}

type Props = AppRootStore &
  WithNavigation & {
    route: {
      params: {
        isCompleteAccount: boolean;
        isSignedWithApple: boolean;
      };
    };
  };

const EditProfile = ({rootStore, route, navigation}: Props): ReactElement => {
  const authStore = rootStore.authStore;
  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;
  const formikRef = useRef();

  if (route.params.isCompleteAccount) {
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

  const formSave = async (values: Values): Promise<void> => {
    onFormSubmitStart();

    try {
      const user = await AuthService.getInstance().updateUserData({
        id: authStore.userInfo.uid,
        firstName: values.firstName,
        lastName: values.lastName,
        photo: values.photoURL,
        country: values.country || UNKNOWN_COUNTRY,
        intro: values.intro,
      });

      authStore.setSignedInUser(user);
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
    const {isCompleteAccount, isSignedWithApple} = route.params;

    try {
      validationSchema.validateSync(values);
      if (
        isSignedWithApple &&
        isCompleteAccount &&
        (!authStore.userInfo?.firstName || !authStore.userInfo?.lastName)
      ) {
        return;
      }
    } catch (err) {
      return;
    }

    if (
      isEqual(values, {
        photoURL: authStore.userInfo.photoURL,
        firstName: authStore.userInfo.firstName,
        lastName: authStore.userInfo.lastName,
        country: authStore.userInfo.country,
        email: authStore.userInfo.email,
        intro: authStore.userInfo.intro,
      })
    ) {
      navigation.pop();
    } else {
      bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.UNSAVED_CHANGES, {
        navigation,
        onContinueEditing: closeBottomSheet,
        onLeaveWithoutSaving: closeBottomSheet,
      });
    }
  };

  const closeBottomSheet = () => {
    bottomSheetStore.hideBottomSheet();
  };

  const saveBtnStyle = route.params.isCompleteAccount
    ? styles.bigSaveBtn
    : layout.marginLeftS;

  return (
    <Formik
      innerRef={formikRef}
      enableReinitialize={true}
      initialValues={
        {
          photoURL: authStore.userInfo?.photoURL,
          firstName: authStore.userInfo?.firstName,
          lastName: authStore.userInfo?.lastName,
          country: authStore.userInfo?.country,
          email: authStore.userInfo?.email,
          intro: authStore.userInfo?.intro,
        } as Values
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
                  {route?.params?.isCompleteAccount && (
                    <View style={{marginBottom: 32}}>
                      <Text style={styles.title}>Complete your account</Text>
                      <Text style={styles.subtitleForm}>
                        Help the community to get to know you better
                      </Text>
                    </View>
                  )}

                  {authStore.userInfo ? (
                    <>
                      <ImageField
                        isAvatar={true}
                        value={values.photoURL}
                        allowsEditing={true}
                        title={'Select new avatar'}
                        onChangeImage={handleChange('photoURL')}
                        name="photoURL"
                      />

                      <View style={styles.emailContainer}>
                        <Text style={text.ashleyjquimbacom}>
                          {values.email}
                        </Text>
                      </View>

                      <TextInputField
                        errorMessage={
                          errors && touched.firstName && errors.firstName
                        }
                        value={values.firstName}
                        viewStyle={{alignSelf: 'stretch'}}
                        label="First name"
                        infoLabel="Required"
                        placeholderText="First name"
                        onBlur={handleBlur('firstName')}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={handleChange('firstName')}
                      />

                      <TextInputField
                        errorMessage={
                          errors && touched.lastName && errors.lastName
                        }
                        value={values.lastName}
                        viewStyle={{alignSelf: 'stretch'}}
                        label="Last name"
                        infoLabel="Required"
                        placeholderText="Last name"
                        autoCapitalize="none"
                        autoCorrect={false}
                        onBlur={handleBlur('lastName')}
                        onChangeText={handleChange('lastName')}
                      />

                      {route.params.isCompleteAccount && (
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
                route.params.isCompleteAccount
                  ? styles.oneBtnContainer
                  : styles.multiBtnContainer
              }>
              {!route.params.isCompleteAccount && (
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
                onPress={handleSubmit}>
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
