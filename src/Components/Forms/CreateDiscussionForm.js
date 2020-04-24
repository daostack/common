import React, {useRef} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Keyboard} from 'react-native';
import TextInputField from '../FormFields/TextInputField';
import ImageField from '../FormFields/ImageField';
import {observer, inject} from 'mobx-react';
import {layout, text, colors} from '../../Theme';
import FirebaseService from '../../Services/FirebaseService';
import AuthService from '../../Services/AuthService';
import firestore from '@react-native-firebase/firestore';
import Toast from '../../Util/Toast';

class CreateDiscussionForm extends React.Component {
  static TITLE = 'title';
  static MESSAGE = 'message';
  static LINKS = 'links';
  static IMAGES = 'images';

  constructor(props) {
    super(props);
    this.state = {};
  }

  formSkip() {}

  formSave = async e => {
    const {createDiscussionStore, userStore} = this.props;
    if (createDiscussionStore.isFormValid()) {
      const changedFields = createDiscussionStore.getChangedFormFieldsJson();
      console.log('createDiscussionStore', changedFields);

      firestore()
        .collection('common')
        .doc('48NPcGnpskN9YkqVNXKA')
        .collection('discussion')
        .doc()
        .set({
          title: changedFields[CreateDiscussionForm.TITLE],
          message: changedFields[CreateDiscussionForm.MESSAGE],
          createTime: new Date(),
          owner: userStore.userInfo.uid,
          common: '0x...',
        })
        .then(() => {
          console.log('YES');
          Toast.done('Sent');
          Keyboard.dismiss();

          if (this.props.onFormSubmit) {
            this.props.onFormSubmit(changedFields);
          }
        })
        .catch(error => {
          Toast.error(error);
          console.log('NO', error);
        });
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

    console.log('editProfileFormStore');
    console.log(createDiscussionStore);
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
          numberOfLines={9}
          value={''}
          validation={{
            name: CreateDiscussionForm.MESSAGE,
            formStore: this.props.createDiscussionStore,
            validateRule: 'required',
          }}
        />
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={{marginRight: 12}}>
            <Text style={styles.addButton}>Add link</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{marginRight: 12}}>
            <Text style={styles.addButton}>Add image</Text>
          </TouchableOpacity>
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
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.mainBlue,
  },
  buttonConatiner: {
    flex: 1,
    // position: 'absolute',
    // bottom: 0,
    marginVertical: 60,
    // backgroundColor: colors.grey4,
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
