import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React from 'react';
import {text, colors} from '~/Theme';
import UserProfileData from '~/Components/UserProfileData';
import {string, object} from 'prop-types';

const UserProfileSheetScreen = ({navigation, userId}) => (
  <>
    <StatusBar barStyle="dark-content" />

    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
        vertical={true}
        nestedScrollEnabled={true}
        directionalLockEnabled={true}>
        <View style={styles.body}>
          <UserProfileData navigation={navigation} userId={userId} />
        </View>
      </ScrollView>
    </SafeAreaView>
  </>
);

UserProfileSheetScreen.propTypes = {
  navigation: object,
  userId: string,
};

const styles = StyleSheet.create({
  sheetTextStyle: {
    ...text.greyText,
    ...text.centered,
  },
  body: {
    paddingTop: 40,
  },

  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    marginBottom: 150,
  },
});

export default UserProfileSheetScreen;
