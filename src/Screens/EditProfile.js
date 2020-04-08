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

const EditProfile = ({editProfileFormStore, route, navigation}) => {
  unsavedChangesSheetRef = useRef();

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

  const onFormSubmit = () => {
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
      // Call snapTo twice because of an issue in the library :(  https://github.com/osdnk/react-native-reanimated-bottom-sheet/issues/198
      if (unsavedChangesSheetRef) {
        unsavedChangesSheetRef.current.snapTo(1);
        unsavedChangesSheetRef.current.snapTo(1);
      }
    } else {
      navigation.goBack();
    }
  };

  const onContinueEditing = () => {
    // Call snapTo twice because of an issue in the library :(  https://github.com/osdnk/react-native-reanimated-bottom-sheet/issues/198
    unsavedChangesSheetRef.current.snapTo(0);
    unsavedChangesSheetRef.current.snapTo(0);
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

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.container}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            {route.params.isFirstOpening ? renderFirstTimeHeader() : null}
            <EditProfileForm
              firstOpening={route.params.isFirstOpening}
              onFormClose={onFormClose}
              onFormSubmit={onFormSubmit}
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomSheetContainer ref={unsavedChangesSheetRef}>
        <UnsavedChanges
          navigation={navigation}
          onContinueEditing={onContinueEditing}
        />
      </BottomSheetContainer>
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

export default inject('editProfileFormStore')(observer(EditProfile));
