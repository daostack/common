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
import {filterObjectByKeys} from '~/Util';
import {bool, object, shape, func} from 'prop-types';
import {EditCommonInfoFormStore} from '~/FormStores/EditCommonInfoFormStore';
import CommonImage from '~/Components/Commons/CommonImage';
import TextInputField from '~/Components/FormFields/TextInputField';
import * as EditCommonInfoConstants from '~/Components/Forms/EditCommonInfoForm';
const {width} = Dimensions.get('window');

const EditInfo = ({userStore, bottomSheetStore, route, navigation}) => {
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
  const formSave = async (e) => {
    if (editCommonInfoFormStore.isFormValid()) {
      onFormSubmitStart();

      const changedFields = editCommonInfoFormStore.getChangedFormFieldsJson();
      /*let newInfo = filterObjectByKeys(changedFields, [
        EditCommonInfoConstants.NAME,
        EditCommonInfoConstants.BYLINE,
        EditCommonInfoConstants.DESCRIPTION,
        EditCommonInfoConstants.IMAGE,
      ]);
      console.log('newData', newInfo)*/
      //onFormSubmitEnd(changedFields);
    }
  };

  const onFormSubmitStart = (updatedFields) => {
    Toast.loading('Updating your profile...');
  };

  const onFormSubmitEnd = (updatedFields) => {
    ///////// userStore.setSignedInUser({...userStore.userInfo, ...updatedFields});
    Toast.done('Your profile is updated');
    navigation.goBack();
  };

  const onFormClose = () => {
    if (editCommonInfoFormStore.isFormChanged()) {
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

              {textInputAttributes.map((attributes) => (
                <TextInputField
                  viewStyle={{alignSelf: 'stretch'}}
                  infoLabel="Required"
                  placeholderText=""
                  returnKeyType="next"
                  autoCorrect={false}
                  {...attributes}
                />
              ))}
            </View>
          ) : (
            <Loader />
          )}
        </ScrollView>

        <TouchableOpacity style={styles.btn} onPress={formSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
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
    backgroundColor: colors.paleblue,
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

export default inject('userStore', 'bottomSheetStore')(EditInfo);
