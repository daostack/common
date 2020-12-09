import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import TextInputField from '~/Components/FormFields/TextInputField';
import CreateCommonForm from '~/Components/Forms/CreateCommonForm';
import {colors} from '~/Theme';
import {inject} from 'mobx-react';
import CreateStepHeader from './CreateStepHeader';
import NavigationBar from 'react-native-navbar';
import Icon from '~/Assets/iconfont/Icon';
import CreateStepDotHeader from './CreateStepDotHeader';
import MultiLinkField from '~/Components/FormFields/MultiLinkField';
import CreateStepHeaderTitle from './CreateStepHeaderTitle';
import RequestStepActionButton from '../RequestStepActionButton';
import logger from '~/Services/Logger';
import {shape, func, object} from 'prop-types';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
const {width} = Dimensions.get('window');

const CreateStep1 = ({bottomSheetStore, navigation, route: {params: {formStores}}}) => {
  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const generalInfoFormStore = formStores.generalInfoFormStore;

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 125],
      extrapolate: 'clamp',
    });
    logger.log(height);
    // const height = scrollY.value > 100 ? 125 : 0;
    setHeaderHeight(height);
  }, [scrollY]);

  const push = () => {
    if (generalInfoFormStore.isFormValid()) {
      navigation.navigate('CreateStep2', {formStores});
    }
  };

  const closeDialog = () => {
    bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.UNSAVED_CHANGES, {
      navigation: navigation,
      onContinueEditing: () => bottomSheetStore.hideBottomSheet(),
      onLeaveWithoutSaving: () => {
        bottomSheetStore.hideBottomSheet();
        navigation.popToTop();
      },
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <NavigationBar
        statusBar={{hidden: true}}
        style={{borderBottomWidth: 1, borderBottomColor: colors.grey4}}
        title={{
          title: 'Create a common',
        }}
        rightButton={
          <TouchableOpacity
            style={{justifyContent: 'center'}}
            onPress={closeDialog}>
            <Icon
              name="close"
              size={18}
              style={{marginRight: 20}}
              color="black"
            />
          </TouchableOpacity>
        }
      />
      <CreateStepDotHeader
        title="General Info"
        currentIndex={1}
        navigation={navigation}
        headerHeight={headerHeight}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        width={width}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
        scrollEventThrottle={16}
        onScroll={Animated.event([
          {nativeEvent: {contentOffset: {y: scrollY}}},
          {useNativeDriver: false},
        ])}>
        <CreateStepHeader currentIndex={0} />
        <View
          style={{
            flex: 1,
            width: '100%',
            // alignItems: 'center',
            backgroundColor: 'white',
          }}>
          <CreateStepHeaderTitle
            title="General Info"
            subtitle="
            Describe your cause and let the community learn more about your
            plans and goals"
          />
          <View
            style={{
              backgroundColor: colors.grey4,
              height: 1,
              marginBottom: 40,
            }}
          />
          <TextInputField
            value={generalInfoFormStore.getFormField(CreateCommonForm.NAME)?.value}
            viewStyle={{alignSelf: 'stretch'}}
            label="Common name"
            infoLabel="Required"
            placeholderText=""
            autoCapitalize="none"
            returnKeyType="next"
            autoCorrect={false}
            maxLength={24}
            validation={{
              name: CreateCommonForm.NAME,
              formStore: generalInfoFormStore,
              validateRule: 'required',
              displayName: 'common name',
            }}
          />
          <TextInputField
            value={generalInfoFormStore.getFormField(CreateCommonForm.BYLINE)?.value}
            viewStyle={{alignSelf: 'stretch'}}
            label="Tagline"
            infoLabel="Required"
            numberOfLines={3}
            // returnKeyType="next"
            multiline={true}
            placeholderText="What is the ultimate goal of the Common?"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={40}
            validation={{
              name: CreateCommonForm.BYLINE,
              formStore: generalInfoFormStore,
              validateRule: 'required|min:10',
              displayName: 'tagline',
            }}
          />
          <TextInputField
            value={generalInfoFormStore.form.fields[CreateCommonForm.DESCRIPTION]?.value}
            label="About"
            infoLabel="Required"
            numberOfLines={5}
            multiline={true}
            returnKeyType="next"
            placeholderText="Describe your cause and let others know why they should join you. What makes you passionate about it? What does success look like?"
            autoCapitalize="none"
            autoCorrect={false}
            validation={{
              name: CreateCommonForm.DESCRIPTION,
              formStore: generalInfoFormStore,
              validateRule: 'required|string',
              displayName: 'about',
            }}
          />
          <MultiLinkField
            link
            allowsEditing={true}
            label="Links"
            title="Title"
            maxLength={30}
            value={generalInfoFormStore.getFormField(CreateCommonForm.LINKS)?.value}
            validation={{
              name: CreateCommonForm.LINKS,
              formStore: generalInfoFormStore,
              validateRule: {common: 'string|url', title: 'string'},
            }}
          />
        </View>
      </ScrollView>
      <RequestStepActionButton
        title="Continue to Funding"
        formStore={generalInfoFormStore}
        onPress={push}
      />
    </SafeAreaView>
  );
};

CreateStep1.propTypes = {
  navigation: object,
  bottomSheetStore: shape({
    showBottomSheet: func,
    hideBottomSheet: func,
  }),
  route: shape({
    params: shape({
      formStores: shape({
        generalInfoFormStore: shape({
          isFormValid: func,
          isFormActionEnabled: func,
        }).isRequired,
      }).isRequired,
    }),
  }),
};

export default inject(
  'bottomSheetStore',
)(CreateStep1);
