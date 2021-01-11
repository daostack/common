import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Dimensions,
} from 'react-native';
import {colors, text, layout, font, sizeL, sizeLineHeight} from '~/Theme';
import {inject} from 'mobx-react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from '~/Assets/iconfont/Icon';
import Loader from '~/Components/Loader';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import Toast from '~/Util/Toast';
import {bool, object, shape, func, InferProps} from 'prop-types';
import {EditCommonInfoFormStore} from '~/FormStores/EditCommonInfoFormStore';
import CommonImage from '~/Components/Commons/CommonImage';
import TextInputField from '~/Components/FormFields/TextInputField';
import * as EditCommonInfoConstants from '~/Components/Forms/EditCommonInfoForm';
import _ from 'lodash';
const {width} = Dimensions.get('window');
const metadataKeys = [
  EditCommonInfoConstants.BYLINE,
  EditCommonInfoConstants.DESCRIPTION,
];

const EditInfo: React.FC<InferProps<typeof EditInfo.propTypes>> = ({
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
    headerRight: () => (
      <TouchableOpacity
        onPress={async () => {
          onFormClose();
        }}>
        <Icon name="close" size={18} style={{marginRight: 20}} color="black" />
      </TouchableOpacity>
    ),
  });

  const {currCommon} = route.params;
  const [editCommonInfoFormStore] = useState(new EditCommonInfoFormStore());
  const [valid, setValid] = useState(false);
  const updatedCommon = currCommon;

  const formSave = async () => {
    if (valid) {
      Toast.loading('Updating your Common...');
      const changedFields = getChanges();

      mergeChanges(changedFields); // not good, changes currCommon as well
      onFormSubmitEnd({
        common: updatedCommon,
        userId: userStore.userInfo.uid, // maybe just use founderId in backend?
        commonChanges: changedFields, // this should be saved in db
      });
    }
  };

  const mergeChanges = (changedFields) => {
    Object.entries(changedFields).forEach(([key, value]) => {
      if (key === 'metadata') {
        updatedCommon.metadata = {...updatedCommon.metadata, ...value};
      } else {
        updatedCommon[key] = value;
      }
    });
  };

  const onFormSubmitEnd = async (updatedFields) => {
    try {
      await daoStore.updateDaoInfo(updatedFields, currCommon);
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

  const isValid = () =>
    setValid(!_.isEmpty(getChanges()) && editCommonInfoFormStore.isFormValid());

  // get the actual changes; not just fields that were changed and then changed back to prev value
  const getChanges = () => {
    const changedFields = editCommonInfoFormStore.getChangedFormFieldsJson();
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

  const textInputAttributes = [
    {
      value:
        editCommonInfoFormStore.getFormField(EditCommonInfoConstants.NAME)
          ?.value || currCommon.name,
      label: 'Common name',
      maxLength: 24,
      validation: {
        name: EditCommonInfoConstants.NAME,
        formStore: editCommonInfoFormStore,
        validateRule: 'required',
        displayName: 'common name',
      },
    },
    {
      value:
        editCommonInfoFormStore.getFormField(EditCommonInfoConstants.BYLINE)
          ?.value || currCommon?.metadata.byline,
      label: 'Tagline',
      numberOfLines: 3,
      multiline: true,
      maxLength: 40,
      validation: {
        name: EditCommonInfoConstants.BYLINE,
        formStore: editCommonInfoFormStore,
        validateRule: 'required|min:10',
        displayName: 'tagline',
      },
    },
    {
      value:
        editCommonInfoFormStore.getFormField(
          EditCommonInfoConstants.DESCRIPTION,
        )?.value || currCommon?.metadata.description,
      label: 'About',
      numberOfLines: 5,
      multiline: true,
      validation: {
        name: EditCommonInfoConstants.DESCRIPTION,
        formStore: editCommonInfoFormStore,
        validateRule: 'required|string',
        displayName: 'about',
      },
    },
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.container}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          {userStore.userInfo ? (
            <View style={styles.body}>
              <Text style={styles.subtitle}>
                Describe your cause and let the community learn more about your
                plans and goals
              </Text>
              <CommonImage
                width={width}
                reviewFormStore={editCommonInfoFormStore}
                commonName={currCommon.name}
                commonByLine={currCommon?.metadata.byline}
                currImage={currCommon.image}
              />

              {textInputAttributes.map((attributes, i) => (
                <TextInputField
                  key={i}
                  viewStyle={{alignSelf: 'stretch'}}
                  infoLabel="Required"
                  placeholderText=""
                  returnKeyType="next"
                  onChangeText={() => isValid()}
                  autoCorrect={false}
                  {...attributes}
                />
              ))}
            </View>
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

EditInfo.propTypes = {
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
  body: {
    ...layout.content,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  subtitle: {
    ...text.greyText,
    ...layout.marginTopS,
    marginBottom: sizeL,
    textAlign: 'center',
    ...font.fontSize(2),
    ...font.primary.regular,
    lineHeight: sizeLineHeight,
  },
  buttonText: {
    ...text.buttonblack,
    color: colors.greyText,
  },
});

export default inject('userStore', 'daoStore', 'bottomSheetStore')(EditInfo);
