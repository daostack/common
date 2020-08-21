import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import React from 'react';
import { text, colors } from '../../Theme';
import UserProfileData from '../../Components/UserProfileData';

const UserProfileSheetScreen = ({ navigation, userId }) => (
  <>
    <StatusBar barStyle="dark-content" />

    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
        vertical
        nestedScrollEnabled
        directionalLockEnabled
      >
        <View style={styles.body}>
          <UserProfileData navigation={navigation} userId={userId} />
        </View>
      </ScrollView>
    </SafeAreaView>
  </>
);

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
