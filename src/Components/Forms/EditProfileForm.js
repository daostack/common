import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer, inject } from 'mobx-react';
import TextInputField from '../FormFields/TextInputField';
import ImageField from '../FormFields/ImageField';
import {
  layout, text, font, colors,
} from '../../Theme';

class EditProfileForm extends React.Component {
  static FIELD_FIRST_NAME = 'firstName';

  static FIELD_LAST_NAME = 'lastName';

  static FIELD_INTRO = 'intro';

  static FIELD_PROFILE_IMAGE = 'photoURL';

  render() {
    const {
      userStore,
      editProfileFormStore,
      firstOpening,
      ...otherProps
    } = this.props;

    return (
      <View
        {...otherProps}
        style={{
          alignSelf: 'stretch',
          flexGrow: 1,
          marginTop: 0,
        }}
      >
        {firstOpening && (
          <View style={{ marginBottom: 32 }}>
            <Text style={styles.title}>Complete your account</Text>
            <Text style={styles.subtitle}>Help the community to get to know you better</Text>
          </View>
        )}
        <ImageField
          isAvatar
          value={userStore.userInfo.photoURL}
          allowsEditing
          title="Select new avatar"
          validation={{
            name: EditProfileForm.FIELD_PROFILE_IMAGE,
            formStore: this.props.editProfileFormStore,
            validateRule: 'string',
          }}
        />

        <View style={styles.emailContainer}>
          <Text style={text.ashleyjquimbacom}>{userStore.userInfo.email}</Text>
        </View>

        <TextInputField
          value={userStore.userInfo.firstName}
          viewStyle={{ alignSelf: 'stretch' }}
          label="First name"
          infoLabel="Required"
          placeholderText="First name"
          autoCapitalize="none"
          autoCorrect={false}
          validation={{
            name: EditProfileForm.FIELD_FIRST_NAME,
            formStore: this.props.editProfileFormStore,
            validateRule: 'required',
            displayName: 'first name',
          }}
        />

        <TextInputField
          value={userStore.userInfo.lastName}
          viewStyle={{ alignSelf: 'stretch' }}
          label="Last name"
          infoLabel="Required"
          placeholderText="Last name"
          autoCapitalize="none"
          autoCorrect={false}
          validation={{
            name: EditProfileForm.FIELD_LAST_NAME,
            formStore: this.props.editProfileFormStore,
            validateRule: 'required',
            displayName: 'last name',
          }}
        />

        <TextInputField
          label="Intro"
          placeholderText="I work on a DAO project at iteratec and am interested in DAOs, coops as well as crypto and blockchain in general."
          multiline
          value={userStore.userInfo.intro}
          validation={{
            name: EditProfileForm.FIELD_INTRO,
            formStore: this.props.editProfileFormStore,
            validateRule: 'string',
          }}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  emailContainer: {
    ...layout.content,
    ...layout.marginBottomS,
    marginTop: 0,
  },
  title: {
    ...font.heading.bold,
    ...font.fontSize(5),
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: colors.grey3,
    ...font.fontSize(2),
    ...font.regular,
    paddingVertical: 5,
  },
});

export default inject(
  'editProfileFormStore',
  'userStore',
)(observer(EditProfileForm));
