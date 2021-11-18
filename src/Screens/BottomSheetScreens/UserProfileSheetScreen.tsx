import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React from 'react';
import {colors} from '~/Theme';
import UserProfileData from '~/Components/UserProfileData';

export const UserProfileSheetScreen = ({userId}: {userId: string}) => (
  <>
    <StatusBar barStyle="dark-content" />

    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
        nestedScrollEnabled={true}
        directionalLockEnabled={true}>
        <View style={styles.body}>
          <UserProfileData userId={userId} />
        </View>
      </ScrollView>
    </SafeAreaView>
  </>
);

const styles = StyleSheet.create({
  body: {
    paddingTop: 40,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    marginBottom: 150,
  },
  scrollView: {
    flex: 1,
  },
});
