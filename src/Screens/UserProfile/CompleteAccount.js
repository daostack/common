import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import EditProfileForm from '~/Components/Forms/EditProfileForm';
import {colors, text, layout} from '~/Theme';
import {string, object, shape} from 'prop-types';


const CompleteAccount = ({route: {params}, navigation}) => (
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
            userId={params.userId}
            name={params.name}
            image={params.image}
            email={params.email}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  </>
);

CompleteAccount.propTypes = {
  navigation: object,
  route: shape({
    params: shape({
      userId: string,
      name: string,
      image: string,
      email: string,
    }),
  }),
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
