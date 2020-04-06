import React from 'react';

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

const EditProfile = ({route, navigation, userStore}) => {
  const onFormSubmit = () => {
    const navigate = CommonActions.navigate({
      name: 'Profile',
      params: {
        userUpdated: true,
      },
    });
    navigation.dispatch(navigate);
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
              onFormSubmit={onFormSubmit}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
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

export default inject('userStore')(observer(EditProfile));
