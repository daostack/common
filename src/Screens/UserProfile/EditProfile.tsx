import React, {ReactElement, useState} from 'react';
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
import {inject} from 'mobx-react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from '~/Assets/iconfont/Icon';
import Loader from '~/Components/Loader';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import Toast from '~/Util/Toast';
import AuthService from '~/Services/AuthService';
import logger from '~/Services/Logger';
import EditProfileFormStore from '~/FormStores/EditProfileFormStore';
import {AppRootStore} from '~/Types/store';

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

type Props = AppRootStore & {
  route: {
    params: {
      isFirstOpening: boolean;
      isSignedWithApple: boolean;
    };
  };
  navigation: any;
};

const EditProfile = ({rootStore, route, navigation}: Props): ReactElement => {
  const authStore = rootStore.authStore;
  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;

  navigation.setOptions({
    headerLeft: () => (
      <TouchableOpacity
        onPress={async () => {
          onFormClose()();
        }}>
        <Icon name="left-arrow" size={32} />
      </TouchableOpacity>
    ),
  });

  const [editProfileFormStore] = useState(new EditProfileFormStore());

  const formSave = async (values: Values): Promise<void> => {
    onFormSubmitStart();

    try {
      await AuthService.getInstance().updateUserData(
        {
          firstName: values.firstName,
          lastName: values.lastName,
          photoURL: values.photoURL,
          country: values.country,
        },
        {
          intro: values.intro,
        },
      );
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

  const onFormClose = (values?: Values) => () => {
    const {isFirstOpening, isSignedWithApple} = route.params;

    if (
      isSignedWithApple &&
      isFirstOpening &&
      (!editProfileFormStore.isFormValid() ||
        !authStore.userInfo?.firstName ||
        !authStore.userInfo?.lastName)
    ) {
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

  return (
    <Formik
      initialValues={
        {
          photoURL: authStore.userInfo.photoURL,
          firstName: authStore.userInfo.firstName,
          lastName: authStore.userInfo.lastName,
          country: authStore.userInfo.country,
          email: authStore.userInfo.email,
          intro: authStore.userInfo.intro,
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
      }): ReactElement => {
        console.log('values.intro', values.country, authStore.userInfo.country);
        return (
          <>
            <StatusBar barStyle="dark-content" />

            <SafeAreaView style={styles.container}>
              <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                keyboardShouldPersistTaps="always"
                style={styles.scrollView}>
                {authStore.userInfo ? (
                  <View style={styles.body}>
                    <View
                      style={{
                        alignSelf: 'stretch',
                        flexGrow: 1,
                        marginTop: 0,
                      }}>
                      {route?.params?.isFirstOpening && (
                        <View style={{marginBottom: 32}}>
                          <Text style={styles.title}>
                            Complete your account
                          </Text>
                          <Text style={styles.subtitleForm}>
                            Help the community to get to know you better
                          </Text>
                        </View>
                      )}
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

                      {route.params.isFirstOpening && (
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
                    </View>
                  </View>
                ) : (
                  <Loader />
                )}
              </ScrollView>

              <View style={styles.containerRow}>
                <TouchableOpacity
                  style={{
                    ...styles.btns,
                    ...layout.btnOutline,
                    ...layout.marginRightS,
                  }}
                  onPress={onFormClose(values)}>
                  <Text style={text.buttonblue}>
                    {route.params.isFirstOpening ? 'Skip' : 'Cancel'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    ...styles.btns,
                    ...layout.btnPrimary,
                    ...layout.marginLeftS,
                  }}
                  onPress={handleSubmit}>
                  <Text style={text.buttoncenterwhite}>Save</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  btns: {
    alignSelf: 'stretch',
  },
  containerRow: {
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

export default inject('rootStore')(EditProfile);
