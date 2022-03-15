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
import {observer} from 'mobx-react-lite';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from '~/Assets/iconfont/Icon';
import Loader from '~/Components/Loader';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import Toast from '~/Util/Toast';
import AuthService from '~/Services/AuthService';
import logger from '~/Services/Logger';
import {AppRootStore} from '~/Types/store';
import {WithNavigation} from '~/Types/navigation';
import {useStore} from '~/Util/hooks/useStore';
import {useNavigation} from '@react-navigation/native';
import {getProviderIcon} from '~/Components/UserProfile/helper';
import {UserModel} from '~/Stores/Models/UserModel';
import {EditProfileButtons} from './EditProfileButtons';

const validationSchema = object({
  firstName: string().required().label('The first name'),
  lastName: string().required().label('The last name'),
  photoURL: string(),
  intro: string().label('The intro'),
  phoneNumber: string(),
  email: string().required().label('Email address'),
});

interface Values {
  photoURL: string;
  firstName: string;
  lastName: string;
  country: string;
  email: string;
  intro: string;
  phoneNumber: string;
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

const EditProfile = ({route}: Props): ReactElement => {
  const navigation = useNavigation();
  const rootStore = useStore('rootStore');
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
      await AuthService.updateUserData(
        {
          firstName: values.firstName,
          lastName: values.lastName,
          photoURL: values.photoURL,
          country: values.country,
          email: values.email,
          phoneNumber: values?.phoneNumber,
        },
        {
          intro: values.intro,
        },
      );
    } catch (err) {
      logger.log('EditProfile Error -> ', err);
      throw err;
    }

    onFormSubmitEnd();
  };

  const onFormSubmitStart = (): void => {
    Toast.loading('Updating your profile...');
  };

  const onFormSubmitEnd = (): void => {
    Toast.done('Your profile is updated');
    Toast.hide();
    if (
      route.params.isCompleteAccount &&
      authStore.userInfo?.provider === 'phone'
    ) {
      navigation.pop(3);
    } else {
      navigation.goBack();
    }
  };

  const onFormClose = () => {
    const values = (formikRef?.current ?? {values: {}})?.values;
    const hasUnsavedChanges = !isEqual(values, {
      photoURL: authStore.userInfo!.photoURL,
      firstName: authStore.userInfo!.firstName,
      lastName: authStore.userInfo!.lastName,
      country: authStore.userInfo!.country,
      email: authStore.userInfo!.email,
      intro: authStore.userInfo!.intro,
      phoneNumber: authStore.userInfo!.phoneNumber,
    });
    if (!hasUnsavedChanges) {
      navigation.pop();
    } else {
      bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.UNSAVED_CHANGES, {
        navigation,
        onContinueEditing: closeBottomSheet,
        onLeaveWithoutSaving: () => {
          bottomSheetStore.hideBottomSheet();
          // If the user confirmed, then we dispatch the action we blocked earlier
          navigation.pop();
        },
      });
    }
  };

  const closeBottomSheet = () => {
    bottomSheetStore.hideBottomSheet();
  };

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
          phoneNumber: authStore.userInfo?.phoneNumber,
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
                        {getProviderIcon(authStore.userInfo?.provider)}
                        <Text style={text.ashleyjquimbacom}>
                          {values.phoneNumber || values.email}
                        </Text>
                      </View>

                      <TextInputField
                        errorMessage={
                          errors && touched.firstName && errors.firstName
                        }
                        viewStyle={{alignSelf: 'stretch'}}
                        label="First name"
                        infoLabel="Required"
                        placeholderText={authStore.userInfo?.firstName}
                        onBlur={handleBlur('firstName')}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={handleChange('firstName')}
                        value={values.firstName}
                      />

                      <TextInputField
                        errorMessage={
                          errors && touched.lastName && errors.lastName
                        }
                        viewStyle={{alignSelf: 'stretch'}}
                        label="Last name"
                        infoLabel="Required"
                        placeholderText={authStore.userInfo?.lastName}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onBlur={handleBlur('lastName')}
                        onChangeText={handleChange('lastName')}
                        value={values.lastName}
                      />

                      {authStore.userInfo?.provider === 'phone' ||
                      !authStore.userInfo?.email ? (
                        <TextInputField
                          errorMessage={errors && touched.email && errors.email}
                          viewStyle={{alignSelf: 'stretch'}}
                          label="Email"
                          infoLabel="Required"
                          placeholderText={authStore.userInfo?.email}
                          onBlur={handleBlur('email')}
                          autoCapitalize="none"
                          autoCorrect={false}
                          onChangeText={handleChange('email')}
                        />
                      ) : (
                        <></>
                      )}

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
            <EditProfileButtons
              handleSubmit={handleSubmit}
              isCompleteAccount={route.params.isCompleteAccount}
              onFormClose={onFormClose}
            />
          </SafeAreaView>
        </>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
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
    flexDirection: 'row',
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

export default observer(EditProfile);
