import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { observer, inject } from 'mobx-react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import EditProfileForm from '../../Components/Forms/EditProfileForm';
import { colors, text, layout } from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import Loader from '../../Components/Loader';
import { BOTTOM_SHEET_TEMPLATES } from '../../Stores/BottomSheetStore';
import Toast from '../../Util/Toast';
import AuthService from '../../Services/AuthService';
import { filterObjectByKeys } from '../../Util';

const EditProfile = ({
  userStore,
  editProfileFormStore,
  bottomSheetStore,
  route,
  navigation,
}) => {
  navigation.setOptions({
    headerLeft: () => (
      <TouchableOpacity
        onPress={async () => {
          onFormClose();
        }}
      >
        <Icon name="left-arrow" size={32} />
      </TouchableOpacity>
    ),
  });

  const formSave = async (e) => {
    if (editProfileFormStore.isFormValid()) {
      onFormSubmitStart();

      const changedFields = editProfileFormStore.getChangedFormFieldsJson();

      const authData = filterObjectByKeys(changedFields, [
        EditProfileForm.FIELD_FIRST_NAME,
        EditProfileForm.FIELD_LAST_NAME,
        EditProfileForm.FIELD_PROFILE_IMAGE,
      ]);
      const publicData = filterObjectByKeys(changedFields, [
        EditProfileForm.FIELD_INTRO,
      ]);

      try {
        await AuthService.getInstance().updateUserData(authData, publicData);
      } catch (err) {
        console.log('Error -> ', err);
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
    userStore.setSignedInUser({ ...userStore.userInfo, ...updatedFields });
    Toast.done('Your profile is updated');
    navigation.goBack();
  };

  const onFormClose = () => {
    if (editProfileFormStore.isFormChanged()) {
      bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.UNSAVED_CHANGES, {
        navigation,
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

  const renderBody = () => (
    <View style={styles.body}>
      <EditProfileForm isFirstOpening={route.params.isFirstOpening} />
    </View>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.container}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          {userStore.userInfo ? renderBody() : <Loader />}
        </ScrollView>

        <View style={styles.containerRow}>
          {route.params.isFirstOpening ? (
            <TouchableOpacity
              style={{ ...styles.btns, ...layout.btnOutline, ...layout.marginRightS }}
              onPress={onFormClose}
            >
              <Text style={text.buttonblue}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{ ...styles.btns, ...layout.btnOutline, ...layout.marginRightS }}
              onPress={onFormClose}
            >
              <Text style={text.buttonblue}>Cancel</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={{ ...styles.btns, ...layout.btnPrimary, ...layout.marginLeftS }}
            onPress={formSave}
          >
            <Text style={text.buttoncenterwhite}>Save</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
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
});

export default inject(
  'userStore',
  'editProfileFormStore',
  'bottomSheetStore',
)(observer(EditProfile));
