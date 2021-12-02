import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, Keyboard} from 'react-native';
import TextInputField from '../FormFields/TextInputField';
import {inject} from 'mobx-react';
import {colors, font, sizeM} from '~/Theme';
import Toast from '~/Util/Toast';
import CreateDiscussionStore from '~/FormStores/CreateDiscussionStore';
import RequestStepActionButton from '~/Screens/Commons/RequestStepActionButton';
import {db} from '~Firebase';
import logger from '~/Services/Logger';
import {string, func, shape, object} from 'prop-types';
import {authStorePropTypes} from '~/Types/propTypes';

const CreateDiscussionForm = ({
  authStore,
  navigation,
  onFormSubmit,
  commonId,
  ...otherProps
}) => {
  const [createDiscussionStore] = useState(new CreateDiscussionStore());
  const TITLE = 'title';
  const MESSAGE = 'message';
  const IMAGES = 'images';
  const FILES = 'files';

  const formSave = async (e) => {
    try {
      //const {createDiscussionStore, authStore} = this.props;
      if (createDiscussionStore.isFormValid()) {
        Keyboard.dismiss();
        const changedFields = createDiscussionStore.getChangedFormFieldsJson();
        logger.log('createDiscussionStore', changedFields);
        Toast.loading('Creating new discussion ...');
        const images = changedFields[IMAGES] || [];
        const files = changedFields[FILES] || [];
        db.collection('discussion')
          .doc()
          .set({
            title: changedFields[TITLE],
            message: changedFields[MESSAGE],
            images: images.filter((image) => image.value !== ''),
            files: files.filter((file) => file.value !== ''),
            createTime: new Date(),
            lastMessage: new Date(),
            ownerId: authStore.userInfo.uid,
            commonId: commonId,
            follower: [],
          })
          .then(() => {
            Toast.success('Done');
            if (onFormSubmit) {
              onFormSubmit(changedFields);
            }
          })
          .catch((error) => {
            Toast.error(error);
            logger.log(error);
          });
      }
    } catch (err) {
      logger.log(err);
      throw err;
    }
  };

  // const onFormClose = (e) => {
  //   if (onFormClose) {
  //     onFormClose();
  //   }
  // };

  return (
    <>
      <ScrollView style={{flex: 1}} contentContainerStyle={{padding: 24}}>
        <View {...otherProps} style={styles.container}>
          <TextInputField
            value={''}
            viewStyle={{alignSelf: 'stretch'}}
            label="Post title"
            infoLabel="Required"
            autoCapitalize="sentences"
            autoCorrect={false}
            style={styles.textInputStyle}
            maxLength={49}
            validation={{
              name: TITLE,
              formStore: createDiscussionStore,
              validateRule: 'required',
            }}
          />

          <TextInputField
            label="Message"
            infoLabel="Required"
            multiline={true}
            numberOfLines={10}
            value={''}
            maxLength={690}
            validation={{
              name: MESSAGE,
              formStore: createDiscussionStore,
              validateRule: 'required',
            }}
          />
        </View>
      </ScrollView>
      <RequestStepActionButton
        title="Publish post"
        formStore={createDiscussionStore}
        onPress={formSave}
      />
    </>
  );
};

CreateDiscussionForm.propTypes = {
  createDiscussionStore: shape({
    isFormValid: func,
    getChangedFormFieldsJson: func,
    form: object,
  }),
  authStore: authStorePropTypes,
  commonId: string,
  onFormSubmit: func,
  onFormClose: func,
  navigation: object,
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flexGrow: 1,
    marginTop: 15,
  },
  title: {
    ...font.primary.bold,
    ...font.fontSize(2),
    color: colors.black,
  },
  subtitle: {
    ...font.primary.regular,
    ...font.fontSize(2),
    marginVertical: 8,
    color: colors.black,
  },
  filesContainer: {
    marginVertical: sizeM,
  },
  textInputStyle: {
    fontWeight: 'bold',
  },
});

export default inject('authStore')(CreateDiscussionForm);
