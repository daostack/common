import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Platform,
} from 'react-native';
import EditProfileForm from '~/Components/Forms/EditProfileForm';
import {colors, text, layout} from '~/Theme';
import {inject, observer} from 'mobx-react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from '~/Assets/iconfont/Icon';
import Loader from '~/Components/Loader';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import Toast from '~/Util/Toast';
import AuthService from '~/Services/AuthService';
import {filterObjectByKeys} from '~/Util';
import logger from '~/Services/Logger';
import {bool, object, shape, func} from 'prop-types';
import EditProfileFormStore from '~/FormStores/EditProfileFormStore';

const EditProfile = ({userStore, bottomSheetStore, route, navigation}) => {
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

  const [editProfileFormStore] = useState(new EditProfileFormStore());

  const formSave = async (e) => {
    if (editProfileFormStore.isFormValid()) {
      onFormSubmitStart();

      const changedFields = editProfileFormStore.getChangedFormFieldsJson();

      let authData = filterObjectByKeys(changedFields, [
        EditProfileForm.FIELD_FIRST_NAME,
        EditProfileForm.FIELD_LAST_NAME,
        EditProfileForm.FIELD_PROFILE_IMAGE,
      ]);
      let publicData = filterObjectByKeys(changedFields, [
        EditProfileForm.FIELD_INTRO,
      ]);

      try {
        await AuthService.getInstance().updateUserData(authData, publicData);
      } catch (err) {
        logger.log('Error -> ', err);
        editProfileFormStore.form.meta.submitError = `${err.toString()}  \n ${
          err.response
            ? `\nCode: ${err.response.data.code}  \nMessage: ${err.response.data.message}`
            : ''
        }`;
        editProfileFormStore.form.meta.isLoadingSubmit = false;
        throw err;
      }

      onFormSubmitEnd(changedFields);
    }
  };

  const onFormSubmitStart = (updatedFields) => {
    Toast.loading('Updating your profile...');
  };

  const onFormSubmitEnd = (updatedFields) => {
    Toast.done('Your profile is updated');
    navigation.goBack();
  };

  const onFormClose = () => {
    const isIos = Platform.OS === 'ios';
    if (
      isIos &&
      route.params.isFirstOpening &&
      !editProfileFormStore.isFormValid()
    ) {
      return;
    }

    if (editProfileFormStore.isFormChanged()) {
      bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.UNSAVED_CHANGES, {
        navigation: navigation,
        onContinueEditing: closeBottomSheet,
        onLeaveWithoutSaving: closeBottomSheet,
      });
    } else {
      navigation.pop();
    }
  };

  const closeBottomSheet = () => {
    bottomSheetStore.hideBottomSheet();
  };

  const EditForm = observer(() =>
    userStore.userInfo ? (
      <View style={styles.body}>
        <EditProfileForm
          isFirstOpening={route.params.isFirstOpening}
          editProfileFormStore={editProfileFormStore}
        />
      </View>
    ) : (
      <Loader />
    ),
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.container}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <EditForm />
        </ScrollView>

        <View style={styles.containerRow}>
          {route.params.isFirstOpening ? (
            <TouchableOpacity
              style={{
                ...styles.btns,
                ...layout.btnOutline,
                ...layout.marginRightS,
              }}
              onPress={onFormClose}>
              <Text style={text.buttonblue}>Skip</Text>
            </TouchableOpacity>
          ) : (
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
              ...layout.marginLeftS,
            }}
            onPress={formSave}>
            <Text style={text.buttoncenterwhite}>Save</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

EditProfile.propTypes = {
  userStore: shape({
    userInfo: object,
    setSignedInUser: func,
  }),
  bottomSheetStore: shape({
    showBottomSheet: func,
    hideBottomSheet: func,
  }),
  route: shape({
    params: shape({
      isFirstOpening: bool,
    }),
  }),
  navigation: object,
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
});

export default inject('userStore', 'bottomSheetStore')(EditProfile);
