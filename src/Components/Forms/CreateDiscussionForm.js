import React from 'react';
import {View, ScrollView, Text, StyleSheet, Keyboard} from 'react-native';
import TextInputField from '../FormFields/TextInputField';
import {observer, inject} from 'mobx-react';
import {colors, font, sizeM} from '../../Theme';
import firestore from '@react-native-firebase/firestore';
import Toast from '../../Util/Toast';
import MultiFileField from '../FormFields/MultiFileField';
import MultiImageField from '../FormFields/MultiImageField';
import RequestStepActionButton from '../../Screens/Commons/RequestStepActionButton';

class CreateDiscussionForm extends React.Component {
  static TITLE = 'title';
  static MESSAGE = 'message';
  static LINKS = 'links';
  static IMAGES = 'images';
  static FILES = 'files';

  constructor(props) {
    super(props);
    this.state = {};
  }

  formSkip() {}

  formSave = async e => {
    try {
      const {createDiscussionStore, userStore} = this.props;
      if (createDiscussionStore.isFormValid()) {
        const changedFields = createDiscussionStore.getChangedFormFieldsJson();
        console.log('createDiscussionStore', changedFields);

        const images = changedFields[CreateDiscussionForm.IMAGES] || [];
        const files = changedFields[CreateDiscussionForm.FILES] || [];
        firestore()
          .collection('discussion')
          .doc()
          .set({
            title: changedFields[CreateDiscussionForm.TITLE],
            message: changedFields[CreateDiscussionForm.MESSAGE],
            images: images.filter(image => image.value !== ''),
            files: files.filter(file => file.value !== ''),
            createTime: new Date(),
            ownerId: userStore.userInfo.uid,
            commonId: this.props.commonId,
            follower: [],
          })
          .then(() => {
            Toast.success('Done');
            Keyboard.dismiss();

            if (this.props.onFormSubmit) {
              this.props.onFormSubmit(changedFields);
            }
          })
          .catch(error => {
            Toast.error(error);
            console.log(error);
          });
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  onFormClose = e => {
    const {onFormClose} = this.props;
    if (onFormClose) {
      onFormClose();
    }
  };

  render() {
    const {
      userStore,
      createDiscussionStore,
      firstOpening,
      ...otherProps
    } = this.props;

    return (
      <>

        <ScrollView style={{flex: 1}} contentContainerStyle={{padding: 24}}>
          <View
            {...otherProps}
            style={styles.container}>
            <TextInputField
              value={''}
              viewStyle={{alignSelf: 'stretch'}}
              label="Title"
              infoLabel="Required"
              autoCapitalize="sentences"
              autoCorrect={false}
              validation={{
                name: CreateDiscussionForm.TITLE,
                formStore: this.props.createDiscussionStore,
                validateRule: 'required',
              }}
            />

            <TextInputField
              label="Message"
              placeholderText="What do you want to say?"
              infoLabel="Required"
              multiline={true}
              numberOfLines={5}
              value={''}
              validation={{
                name: CreateDiscussionForm.MESSAGE,
                formStore: this.props.createDiscussionStore,
                validateRule: 'required',
              }}
            />
            <View style={styles.filesContainer}>
              <Text style={styles.title}>Files</Text>
              <Text style={styles.subtitle}>
                Anything you want to attach to this proposal?
              </Text>
              <MultiFileField
                navigation={this.props.navigation}
                allowsEditing={true}
                title={'Add file'}
                validation={{
                  name: CreateDiscussionForm.FILES,
                  formStore: this.props.createDiscussionStore,
                  validateRule: 'string',
                }}
              />
            </View>
            <View style={styles.filesContainer}>
              <Text style={styles.title}>Images</Text>
              <Text style={styles.subtitle}>An image is worth a 1,000 words</Text>
              <MultiImageField
                allowsEditing={false}
                title={'Add Image'}
                validation={{
                  name: CreateDiscussionForm.IMAGES,
                  formStore: this.props.createDiscussionStore,
                  validateRule: 'string',
                }}
              />
            </View>
          </View>

        </ScrollView>
        <RequestStepActionButton
          title="Publish post"
          pass={this.props.createDiscussionStore.form.meta.isValid}
          onPress={this.formSave}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flexGrow: 1,
    marginTop: 15,
  },
  title: {
    ...font.primary.bold,
    ...font.fontSize(2),
    color: colors.againstBlackColor,
  },
  subtitle: {
    ...font.primary.regular,
    ...font.fontSize(2),
    marginVertical: 8,
    color: colors.againstBlackColor,
  },
  filesContainer: {
    marginVertical: sizeM,
  },
});

export default inject(
  'createDiscussionStore',
  'userStore',
)(observer(CreateDiscussionForm));
