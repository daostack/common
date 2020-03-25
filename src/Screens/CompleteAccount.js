import React, {useEffect, useRef} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import CompleteAccountForm from '../Components/Forms/CompleteAccountForm';

import {colors, text, layout} from '../Theme';

const CompleteAccount = () => {
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

            <View style={styles.imagePlaceholder}></View>

            <View style={layout.content}>
              <Text style={text.ashleyjquimbacom}>
                lyubomir.petkov@limechain.tech
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
    ...layout.content,
  },
  container: {
    flex: 1,
  },
  subtitle: {
    ...text.greyText,
    ...layout.marginTopS,
  },
  imagePlaceholder: {
    ...layout.content,
    ...layout.marginTopXL,
    backgroundColor: '#effafd',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});

export default CompleteAccount;
