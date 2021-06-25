import React, {ReactElement, useRef, useState, useEffect} from 'react';
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
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import Toast from '~/Util/Toast';
import {object, shape, InferProps, string, func} from 'prop-types';
import EditInfo from '~/Components/EditCommon/EditInfo';
import EditRules from '~/Components/EditCommon/EditRules';
import {rootStorePropTypes} from '~/Types/propTypes';
import {
  ICommonEntity,
  ICommonMetadata,
} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';

import {Formik, FormikProps} from 'formik';
import {
  Values as EditInfoValues,
  validationSchema as editInfoValidation,
} from '~/Components/EditCommon/EditInfo';
import {
  Values as EditRulesValues,
  validationSchema as editRulesValidation,
} from '~/Components/EditCommon/EditRules';
import {editType} from './Profile/CommonAgenda';
import Loader from '~/Components/Loader';

type EditFormValues = EditInfoValues | EditRulesValues;

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

const EditCommon: React.FC<InferProps<typeof props>> = ({
  rootStore,
  route,
  navigation,
}) => {
  const authStore = rootStore.authStore;
  const commonStore = rootStore.commonStore;
  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;
  const [currCommon, setCurrCommon] = useState<ICommonEntity>({});
  const type: string = route.params.type;
  const formikRef = useRef();

  useEffect(() => {
    (async () => {
      const response = (await commonStore.getCommonById(
        route.params.currCommon.id,
      )) as ICommonEntity;
      setCurrCommon(response);
    })();
  }, [route.params]);

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

  const formSave = async (formValues: EditFormValues) => {
    let commonUpdate = {};

    if (type === editType.info) {
      const infoValues = formValues as EditInfoValues;
      const updatedMetadata = {
        ...currCommon.metadata,
        byline: infoValues.tagLine,
        description: infoValues.about,
      } as ICommonMetadata;

      commonUpdate = {
        ...currCommon,
        name: infoValues.name,
        image: infoValues.image,
        metadata: updatedMetadata,
      } as Partial<ICommonEntity>;
    } else {
      const rulesValues = formValues as EditInfoValues;
      commonUpdate = {
        ...currCommon,
        ...rulesValues,
      } as Partial<ICommonEntity>;
    }

    onFormSubmitEnd(commonUpdate);
  };

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
    if (formikRef?.current?.dirty) {
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

  const initialValues: EditInfoValues | EditRulesValues =
    type === editType.info
      ? ({
          image: currCommon?.image,
          name: currCommon?.name,
          tagLine: currCommon?.metadata?.byline,
          about: currCommon?.metadata?.description,
        } as EditInfoValues)
      : ({
          rules: currCommon.rules,
        } as EditRulesValues);

  return (
    <Formik
      innerRef={formikRef}
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={
        type === editType.info ? editInfoValidation : editRulesValidation
      }
      onSubmit={formSave}>
      {(
        formikProps: FormikProps<EditInfoValues | EditRulesValues>,
      ): ReactElement => {
        const {handleSubmit} = formikProps;

        return (
          <>
            <StatusBar barStyle="dark-content" />

            <SafeAreaView style={styles.container}>
              <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={styles.scrollView}>
                {authStore.userInfo ? (
                  type === editType.info ? (
                    <EditInfo formikProps={formikProps} />
                  ) : (
                    <EditRules formikProps={formikProps} />
                  )
                ) : (
                  <Loader />
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
                  onPress={handleSubmit}>
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
