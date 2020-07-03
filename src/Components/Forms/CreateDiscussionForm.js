import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Keyboard} from 'react-native';
import TextInputField from '../FormFields/TextInputField';
import {observer, inject} from 'mobx-react';
import {colors} from '../../Theme';
import firestore from '@react-native-firebase/firestore';
import Toast from '../../Util/Toast';
import MultiFileField from '../FormFields/MultiFileField';
import MultiImageField from '../FormFields/MultiImageField';

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

        // const imageList = Object.keys(changedFields).filter( x => x.includes('images_')).map(x => changedFields[x]);

        if (!userStore.userInfo.uid) {
          Toast.error('We can not post your discussion at the moment');
          return;
        }

        firestore()
          .collection('discussion')
          .doc()
          .set({
            title: changedFields[CreateDiscussionForm.TITLE],
            message: changedFields[CreateDiscussionForm.MESSAGE],
            images: changedFields[CreateDiscussionForm.IMAGES].filter(image => image.value !== ''),
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
      <View
        {...otherProps}
        style={{
          alignSelf: 'stretch',
          flexGrow: 1,
          marginTop: 15,
        }}>
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
          numberOfLines={10}
          value={''}
          validation={{
            name: CreateDiscussionForm.MESSAGE,
            formStore: this.props.createDiscussionStore,
            validateRule: 'required',
          }}
        />
        <View style={{marginVertical: 15}}>
          <Text style={styles.title}>Files</Text>
          <Text style={styles.subtitle}>
            Anything you want to attach to this proposal?
          </Text>
          {/* <TouchableOpacity style={{marginRight: 12}}>
            <Text style={styles.addButton}>Add file</Text>
          </TouchableOpacity> */}
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
        <View style={{marginVertical: 15}}>
          <Text style={styles.title}>Images</Text>
          {/* <Text style={styles.subtitle}>An image is worth a 1,000 words</Text> */}
          {/* <TouchableOpacity style={{marginRight: 12}}>
            <Text style={styles.addButton}>Add Image</Text>
          </TouchableOpacity> */}
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
        <View style={styles.buttonConatiner}>
          <TouchableOpacity style={styles.button} onPress={this.formSave}>
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.mainBlue,
    marginVertical: 8,
  },
  buttonConatiner: {
    flex: 1,
    // position: 'absolute',
    // bottom: 0,
    marginVertical: 60,
    // backgroundColor: colors.grey4,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'normal',
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    marginVertical: 8,
    color: colors.grey3,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    height: 60,
    marginHorizontal: 0,
    backgroundColor: '#3cc7e1',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 15,
  },
});

export default inject(
  'createDiscussionStore',
  'userStore',
)(observer(CreateDiscussionForm));
