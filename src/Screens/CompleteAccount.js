import React, {useEffect, useRef} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import CompleteAccountForm from '../Components/Forms/CompleteAccountForm';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {colors, text, layout} from '../Theme';

const CompleteAccount = ({}) => {
  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.container}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View>
              <Text style={text.h1Black}>Complete your account</Text>
              <Text style={styles.subtitle}>
                Help the community get to know you better
              </Text>
            </View>

            <CompleteAccountForm />
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
    flex: 1,
    ...layout.content,
  },
  container: {
    flex: 1,
    backgroundColor: colors.error,
  },
  subtitle: {
    ...text.greyText,
    ...layout.marginTopS,
  },
});

export default CompleteAccount;
