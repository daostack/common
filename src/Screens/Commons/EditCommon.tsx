import React, {ReactElement, useRef, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {colors, text, layout} from '~/Theme';
import {inject, observer} from 'mobx-react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from '~/Assets/iconfont/Icon';
import Loader from '~/Components/Loader';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import Toast from '~/Util/Toast';
import {bool, object, shape, InferProps, string, func} from 'prop-types';
import {EditCommonFormStore} from '~/FormStores/EditCommonFormStore';
import * as EditCommonConstants from '~/Components/Forms/EditCommonForm';
import EditInfo from '~/Components/EditCommon/EditInfo';
import EditRules from '~/Components/EditCommon/EditRules';
import {rootStorePropTypes} from '~/Types/propTypes';
import _, {values} from 'lodash';
import {ICommonEntity} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';

import {object as yupObject, string as yupString} from 'yup';
import {Formik, FormikProps} from 'formik';
import {
  Values as EditInfoValues,
  validationSchema as editInfoValidation,
} from '~/Components/EditCommon/EditInfo';
import {editType} from './Profile/CommonAgenda';

interface Values {
  image: string;
  name: string;
  tagLine: string;
  about: string;
}

const props = {
  rootStore: rootStorePropTypes.isRequired,
  route: shape({
    params: shape({
      currCommon: object.isRequired,
      type: string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: shape({
    setOptions: func.isRequired,
    title: func.isRequired,
    headerRight: func.isRequired,
    goBack: func.isRequired,
    pop: func.isRequired,
  }).isRequired,
};

const emptyMetadata = {
  [EditCommonConstants.BYLINE]: '',
  [EditCommonConstants.DESCRIPTION]: '',
};

const metadataKeys = [
  EditCommonConstants.BYLINE,
  EditCommonConstants.DESCRIPTION,
];

const EditCommon: React.FC<InferProps<typeof props>> = ({
  rootStore,
  route,
  navigation,
}) => {
  const authStore = rootStore.authStore;
  const commonStore = rootStore.commonStore;
  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;
  const currCommon: ICommonEntity = route.params.currCommon as ICommonEntity;
  const type: string = route.params.type;
  const formikRef = useRef();

  navigation.setOptions({
    headerLeft: () => (
      <TouchableOpacity
        onPress={async () => {
          onFormClose();
        }}>
        <Icon name="left-arrow" size={32} />
      </TouchableOpacity>
    ),
    title: type === editType.info ? 'Edit info and cover photo' : 'Edit Rules',
    headerRight: () => (
      <TouchableOpacity
        onPress={async () => {
          onFormClose();
        }}>
        <Icon name="close" size={18} style={{marginRight: 20}} color="black" />
      </TouchableOpacity>
    ),
  });

  const [editCommonFormStore] = useState(new EditCommonFormStore());
  //const [valid, setValid] = useState(false);
  //const isRule = title === 'Edit Rules';
  var [newRules, setNewRules] = useState(currCommon?.rules || []);

  const formSave = async (values: EditInfoValues) => {
    Toast.loading('Updating your Common...');
    // const changedFields =
    //   title === 'Edit Rules' ? {rules: newRules} : getChanges();
    // mergeChanges(changedFields); // shallow copy though
    onFormSubmitEnd(values);
  };

  // const mergeChanges = (changedFields: Array<string>) => {
  //   Object.keys(changedFields).forEach((key) => {
  //     if (typeof changedFields[key] === 'object') {
  //       currCommon[key] = Array.isArray(changedFields[key])
  //         ? changedFields[key]
  //         : {...currCommon[key], ...changedFields[key]};
  //     } else {
  //       currCommon[key] = changedFields[key];
  //     }
  //   });
  // };

  const onFormSubmitEnd = async (updatedCommon: Partial<ICommonEntity>) => {
    try {
      commonStore.updateCommonInfo(updatedCommon);
      Toast.done('Your Common is updated');
    } catch (err) {
      Toast.error('Could not update your Common');
    }
    navigation.goBack();
  };

  const onFormClose = () => {
    if (editCommonFormStore.isFormChanged()) {
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
  // should be done with mobx reaction
  // const getChanges = (): Object => {

  // const changedFields = _.isEmpty(changedFields)
  //   ? {...emptyMetadata, ...editCommonFormStore.getFormFieldsJson()}
  //   : editCommonFormStore.getChangedFormFieldsJson();

  // return Object.keys(changedFields)
  //   .filter((key) => currCommon[key] !== changedFields[key])
  //   .reduce((obj, key) => {
  //     if (metadataKeys.includes(key)) {
  //       obj.metadata = {...obj.metadata, ...{[key]: changedFields[key]}};
  //     } else {
  //       obj[key] = changedFields[key];
  //     }
  //     return obj;
  //   }, {});
  // };

  // /**
  //  * This function is handling matching the rule we changes
  //  * with the correct index of that rule in the common.rules array
  //  * @param  index      - the index of the rule in common.rules array
  //  * @return newRules   - an object with the new rules
  //  */
  // const getRuleChanges = (index = 0) => {
  //   const {rules} = editCommonFormStore.getChangedFormFieldsJson();
  //   if (!rules) {
  //     newRules.splice(index, 1);
  //   } else {
  //     const rule = {title: '', value: ''};
  //     Object.keys(rules).map((key) => {
  //       const i = index < key ? index : +key;
  //       rule.title = rules[i]?.title || newRules[index]?.title;
  //       rule.value = rules[i]?.value || newRules[index]?.value;
  //       newRules[index] = rule;
  //     });
  //   }
  //   setNewRules(newRules);
  // };

  // const isValidChange = (ruleIndex = null) => {
  //   const isValid = editCommonFormStore.isFormValid();
  //   isValid && isRule && getRuleChanges(ruleIndex);
  //   setValid(isValid);
  // };

  return (
    <Formik
      innerRef={formikRef}
      enableReinitialize={true}
      initialValues={
        {
          image: currCommon?.image,
          name: currCommon?.name,
          tagLine: currCommon?.metadata?.byline,
          about: currCommon?.metadata?.description,
        } as Values
      }
      validationSchema={editInfoValidation}
      onSubmit={formSave}>
      {(formikProps: FormikProps<Values>): ReactElement => {
        console.log('formikProps.errors -> ', formikProps.errors);
        console.log('formikProps.isValid -> ', formikProps.isValid);

        return (
          <>
            <StatusBar barStyle="dark-content" />

            <SafeAreaView style={styles.container}>
              <View>
                {/* {formikProps.errors?.keys().map((key: string) => {
                <Text>{formikProps.errors[key]}</Text>;
              })} */}
              </View>
              <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={styles.scrollView}>
                {type === editType.info ? (
                  <EditInfo formikProps={formikProps} />
                ) : (
                  <EditRules formikProps={formikProps} />
                )}
              </ScrollView>

              <View style={{marginBottom: 20}}>
                <TouchableOpacity
                  style={{
                    ...styles.btn,
                    backgroundColor: formikProps.isValid
                      ? colors.mainBlue
                      : colors.paleblue,
                  }}
                  disabled={!formikProps.isValid}
                  onPress={formSave}>
                  <Text
                    style={{
                      ...styles.buttonText,
                      color: formikProps.isValid
                        ? colors.white
                        : colors.greyText,
                    }}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </>
        );
      }}
    </Formik>
  );
};

EditCommon.propTypes = props;

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

export default inject('rootStore')(observer(EditCommon));
