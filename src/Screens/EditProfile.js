import React, {useRef} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import EditProfileForm from '../Components/Forms/EditProfileForm';
import {colors, text, layout} from '../Theme';
import {observer, inject} from 'mobx-react';
import {CommonActions} from '@react-navigation/native';
import UnsavedChanges from './BottomSheetScreens/UnsavedChanges';
import BottomSheetContainer from '../Components/BottomSheetContainer';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from '../Assets/iconfont/Icon';
import Loader from '../Components/Loader';
import {BOTTOM_SHEET_TEMPLATES} from '../Stores/BottomSheetStore';

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
        }}>
        <Icon name="left-arrow" size={32} />
      </TouchableOpacity>
    ),
  });

  const onFormSubmit = updatedFields => {
    userStore.setSignedInUser({...userStore.userInfo, ...updatedFields});
    const navigate = CommonActions.navigate({
      name: 'Profile',
      params: {
        userUpdated: true,
      },
    });
    navigation.dispatch(navigate);
  };

  const onFormClose = () => {
    if (editProfileFormStore.isFormChanged()) {
      bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.UNSAVED_CHANGES, {
        navigation: navigation,
        onContinueEditing: closeBottomSheet,
        onLeaveWithoutSaving: closeBottomSheet,
      });
    } else {
      navigation.pop();
      console.log('POP');
    }
  };

  const closeBottomSheet = () => {
    // Call snapTo twice because of an issue in the library :(  https://github.com/osdnk/react-native-reanimated-bottom-sheet/issues/198
    bottomSheetStore.hideBottomSheet();
  };

  const renderFirstTimeHeader = () => {
    return (
      <View style={layout.marginBottomXL}>
        <Text style={text.h1Black}>Complete your account</Text>
        <Text style={styles.subtitle}>
          Help the community get to know you better
        </Text>
      </View>
    );
  };

  const renderBody = () => {
    return (
      <View style={styles.body}>
        {route.params.isFirstOpening ? renderFirstTimeHeader() : null}
        <EditProfileForm
          firstOpening={route.params.isFirstOpening}
          onFormClose={onFormClose}
          onFormSubmit={onFormSubmit}
        />
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.container}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          {userStore.userInfo ? renderBody() : <Loader />}
        </ScrollView>
      </SafeAreaView>
      {/*
      <BottomSheetContainer ref={unsavedChangesSheetRef}>
        <UnsavedChanges
          navigation={navigation}
          onContinueEditing={onContinueEditing}
        />
      </BottomSheetContainer>
    */}
    </>
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
});

export default inject(
  'userStore',
  'editProfileFormStore',
  'bottomSheetStore',
)(observer(EditProfile));
