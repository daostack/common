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

const CompleteAccount = ({route, navigation}) => {
  console.log('navigation -> ', navigation);
  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.container}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={layout.marginBottomXL}>
              <Text style={text.h1Black}>Complete your account</Text>
              <Text style={styles.subtitle}>
                Help the community get to know you better
              </Text>
            </View>

            <EditProfileForm
              userId={route.params.userId}
              name={route.params.name}
              image={route.params.image}
              email={route.params.email}
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

export default CompleteAccount;
