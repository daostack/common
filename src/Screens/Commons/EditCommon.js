import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {colors, text, layout} from '~/Theme';
import {inject} from 'mobx-react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from '~/Assets/iconfont/Icon';
import Loader from '~/Components/Loader';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import Toast from '~/Util/Toast';
import {bool, object, shape, func, InferProps} from 'prop-types';
import {EditCommonFormStore} from '~/FormStores/EditCommonFormStore';
import * as EditCommonConstants from '~/Components/Forms/EditCommonForm';
import _ from 'lodash';
import EditInfo from '~/Components/EditCommon/EditInfo';
import EditRules from '~/Components/EditCommon/EditRules';
const metadataKeys = [
  EditCommonConstants.BYLINE,
  EditCommonConstants.DESCRIPTION,
];

const EditCommon: React.FC<InferProps<typeof EditCommon.propTypes>> = ({
  userStore,
  daoStore,
  bottomSheetStore,
  route,
  navigation,
}) => {
  navigation.setOptions({
    headerLeft: () => (
      <TouchableOpacity
        onPress={async () => {
          onFormClose();
        }}>
        <Icon name="left-arrow" size={32} />
      </TouchableOpacity>
    ),
    title: route.params.title,
    headerRight: () => (
      <TouchableOpacity
        onPress={async () => {
          onFormClose();
        }}>
        <Icon name="close" size={18} style={{marginRight: 20}} color="black" />
      </TouchableOpacity>
    ),
  });

  const {currCommon, title} = route.params;
  const [editCommonFormStore] = useState(new EditCommonFormStore());
  const [valid, setValid] = useState(false);

  const formSave = async () => {
    if (valid) {
      Toast.loading('Updating your Common...');
      const changedFields = getChanges();
      mergeChanges(changedFields); // not good, changes currCommon as well
      onFormSubmitEnd(currCommon);
    }
  };

  const mergeChanges = (changedFields) => {
    Object.entries(changedFields).forEach(([key, value]) => {
      if (key === 'metadata') {
        currCommon.metadata = {...currCommon.metadata, ...value};
      } else {
        currCommon[key] = value;
      }
    });
  };

  const onFormSubmitEnd = async (updatedCommon) => {
    try {
      await daoStore.updateDaoInfo(updatedCommon);
      Toast.done('Your Common is updated');
    } catch (err) {
      Toast.error('Could not update your Common');
    }
    navigation.goBack();
  };

  const onFormClose = () => {
    if (!_.isEmpty(getChanges())) {
      bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.UNSAVED_CHANGES, {
        navigation: navigation,
        onContinueEditing: closeBottomSheet,
        onLeaveWithoutSaving: closeBottomSheet,
      });
    } else {
      navigation.pop();
    }
  };

  const closeBottomSheet = () => {
    bottomSheetStore.hideBottomSheet();
  };

  // get the actual changes; not just fields that were changed and then changed back to prev value
  const getChanges = () => {
    const changedFields = editCommonFormStore.getChangedFormFieldsJson();
    return Object.keys(changedFields)
      .filter((key) => currCommon[key] !== changedFields[key])
      .reduce((obj, key) => {
        if (metadataKeys.includes(key)) {
          obj.metadata = {...obj.metadata, ...{[key]: changedFields[key]}};
        } else {
          obj[key] = changedFields[key];
        }
        return obj;
      }, {});
  };

  const isValidChange = () => {
    setValid(!_.isEmpty(getChanges()) && editCommonFormStore.isFormValid());
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.container}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          {userStore.userInfo ? (
            title === 'Edit Info' ? (
              <EditInfo
                isValidChange={() => isValidChange()}
                formSave={() => console.log('form save')}
                common={currCommon}
                editCommonFormStore={editCommonFormStore}
              />
            ) : (
              <EditRules
                isValidChange={() => isValidChange()}
                common={currCommon}
                editCommonFormStore={editCommonFormStore}
              />
            )
          ) : (
            <Loader />
          )}
        </ScrollView>

        <View style={{marginBottom: 20}}>
          <TouchableOpacity
            style={{
              ...styles.btn,
              backgroundColor: valid ? colors.mainBlue : colors.paleblue,
            }}
            disabled={!valid}
            onPress={formSave}>
            <Text
              style={{
                ...styles.buttonText,
                color: valid ? colors.white : colors.greyText,
              }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

EditCommon.propTypes = {
  userStore: shape({
    userInfo: object,
    setSignedInUser: func,
  }),
  bottomSheetStore: shape({
    showBottomSheet: func,
    hideBottomSheet: func,
  }),
  daoStore: shape({
    setDaoInfo: func,
  }),
  route: shape({
    params: shape({
      isFirstOpening: bool,
    }),
  }),
  navigation: object,
};

const styles = StyleSheet.create({
  btn: {
    ...layout.btnPrimary,
    width: '85%',
    alignSelf: 'center',
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  buttonText: {
    ...text.buttonblack,
    color: colors.greyText,
  },
});

export default inject('userStore', 'daoStore', 'bottomSheetStore')(EditCommon);
