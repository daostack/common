import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import {inject, observer} from 'mobx-react';
import {StackActions} from '@react-navigation/native';

import moment from 'moment';
import CreateStepHeader from './CreateStepHeader';
import CreateStepNavigation from './CreateStepNavigation';
import CreateCommonForm from '~/Components/Forms/CreateCommonForm';

import CreateStepDotHeader from './CreateStepDotHeader';
import RequestStepActionButton from '../RequestStepActionButton';
import {numberFormatter, showErrorPopUp} from '~/Util';

import Modal from 'react-native-modal';
import SentTemplate from '~/Components/ModalTemplates/SentTemplate';
import Share from 'react-native-share';
import CreateStep4Indicators from './CreateStep4Indicators';
import {CommonActions} from '@react-navigation/native';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import {object, shape} from 'prop-types';
import DaoService from '~/Services/DaoService';
import CommonImage from '~/Components/Commons/CommonImage';

import {
  colors,
  font,
  text,
  layout,
  sizeM,
  sizeS,
  sizeL,
  sizeLineHeight,
} from '~/Theme';
import logger from '~/Services/Logger';

const {width} = Dimensions.get('window');
const CONTRIBUTION = {
  monthly: '/mo',
  'one-time': '',
};

const CreateStep4 = ({
  route: {
    params: {formStores},
  },
  navigation,
  bottomSheetStore,
  userStore: {
    userInfo: {uid},
  },
}) => {
  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const [newCommonAddress, setNewCommonAddress] = useState(false);

  const generalInfoFormStore = formStores.generalInfoFormStore;
  const fundingFormStore = formStores.fundingFormStore;
  const agendaFormStore = formStores.agendaFormStore;
  const reviewFormStore = formStores.reviewFormStore;

  const form = {
    ...generalInfoFormStore.getChangedFormFieldsJson(),
    ...fundingFormStore.getChangedFormFieldsJson(),
    ...agendaFormStore.getChangedFormFieldsJson(),
    ...reviewFormStore.getChangedFormFieldsJson(),
  };

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 125],
      extrapolate: 'clamp',
    });
    // const height = scrollY.value > 100 ? 125 : 0;
    setHeaderHeight(height);
  }, [scrollY]);

  const goToCommon = () => {
    const navigate = CommonActions.navigate({
      name: 'CommonProfile',
      params: {
        commonId: newCommonAddress.toLowerCase(),
      },
    });
    navigation.popToTop();
    navigation.dispatch(navigate);
  };

  const confirmModal = () => {
    bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.PUBLISH_COMMON, {
      forgeCommon: forgeCommon,
    });
  };

  const shareCommon = (event) => {
    const {name} = generalInfoFormStore.getChangedFormFieldsJson();
    const currCommonId = newCommonAddress.toLowerCase();
    const options = {
      url: `https://app.common.io/common/${currCommonId}`,
      title: "Let's make it happen",
      message: `${name} common`,
    };
    Share.open(options);
  };

  const forgeCommon = async () => {
    try {
      const formDataInit = {...form};
      const fundingGoalDeadline = formDataInit[CreateCommonForm.DEADLINE];

      const contributionAmount = parseInt(formDataInit.minimum, 10) * 100;

      const data = {
        ...formDataInit,
        founderId: uid,
        minFeeToJoin: contributionAmount,
        contributionAmount,
        contributionType: formDataInit.contribution,
        fundingGoal: parseInt(formDataInit.funding, 10) * 100,
        fundingGoalDeadline,
      };
      logger.log('calling createCommon(...)');

      const formattedData = {
        name: data.name,
        image: data.image,
        rules: data.rules,
        links: data.links,
        byline: 'data.byline',
        description: data.description,
        contributionType: data.contributionType,
        contributionAmount: data.contributionAmount,
        fundingGoalDeadline: data.fundingGoalDeadline,
      };

      navigation.navigate({
        name: 'FullScreenCreationLoader',
        params: {
          title: 'Creating your Common',
          message: 'This might take a couple of minutes.',
        },
      });

      const createCommonResponse = await DaoService.getInstance().createCommon(formattedData);

      if (createCommonResponse.status === 200) {
        setNewCommonAddress(createCommonResponse.data.id);
      } else {
        //navigation.pop();
        showErrorPopUp(bottomSheetStore, createCommonResponse);
      }

      return {commonAddress: createCommonResponse.data.id};
    } catch (e) {
      //navigation.pop();
      console.log('error -> ', e);
      showErrorPopUp(bottomSheetStore, e);

      navigation.pop();
    }
  };

  const displayString = () =>
    `${numberFormatter(form[CreateCommonForm.MINIMUM])}${
      CONTRIBUTION[form.contribution]
    }`;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <CreateStepNavigation navigation={navigation} title="Agenda" />
      <CreateStepDotHeader
        title="Final touches and review"
        currentIndex={4}
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
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}>
        <CreateStepHeader currentIndex={3} />
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
          }}>
          <Text style={stylesHeader.generalInfoTitle}>
            Final touches and review
          </Text>
          <Text style={stylesHeader.generalInfoSubtitle}>
            You will not be able to make changes to the Common info after it is
            published
          </Text>
          <CommonImage
            width={width}
            reviewFormStore={reviewFormStore}
            commonName={form[CreateCommonForm.NAME]}
            commonByLine={form[CreateCommonForm.BYLINE]}
          />
          <View
            style={{height: 1, width: width, backgroundColor: colors.grey4}}
          />
          <View style={{...styles.sectionTitle, justifyContent: 'center'}}>
            {/* <View style={{minWidth: 90, marginRight: 10}}>
              <CreateStep4Indicators
                title="Goal"
                number={numberFormatter(form[CreateCommonForm.FUNDING_GOAL])}
              />
            </View> */}
            <View style={{width: 120, marginHorizontal: 10}}>
              <CreateStep4Indicators
                title="Min. Contribution"
                value={displayString()}
                contribution
              />
            </View>

            <View style={{width: 120, marginHorizontal: 10}}>
              <CreateStep4Indicators
                title="Safety period"
                currencySymbol={false}
                value={moment
                  .unix(form[CreateCommonForm.DEADLINE])
                  .fromNow(true)}
                date={moment
                  .unix(form[CreateCommonForm.DEADLINE])
                  .format('MMM DD, YYYY')}
              />
            </View>
          </View>
          <View style={styles.sectionTitle}>
            <Text style={styles.textTitle}>About</Text>
          </View>
          <Text
            style={{
              ...styles.textContent,
              ...text.writingDirection(form[CreateCommonForm.DESCRIPTION]),
            }}>
            {form[CreateCommonForm.DESCRIPTION]}
          </Text>
          <>
            <View style={styles.sectionTitle}>
              <Text style={styles.textSubtitle}>Links</Text>
              {/* <TouchableOpacity
                style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
                <Icon
                  name="edit"
                  size={16}
                  style={{textAlign: 'right', alignSelf: 'flex-end'}}
                />
              </TouchableOpacity> */}
            </View>
            {form[CreateCommonForm.LINKS]?.length ? (
              form[CreateCommonForm.LINKS].map((x) => (
                <View key={`key_${CreateCommonForm.LINKS}_${x.title}`}>
                  <Text
                    onPress={() => {
                      navigation.navigate('Browser', {
                        url: x.value,
                      });
                    }}
                    style={{
                      display: 'flex',
                      flexFlow: 'row',
                      alignContent: 'center',
                      ...styles.linkText,
                      ...styles.textContent,
                    }}>
                    {x.title}
                  </Text>
                </View>
              ))
            ) : (
              <View />
            )}
          </>
          {form[CreateCommonForm.RULES]?.length > 0 ? (
            form[CreateCommonForm.RULES].map((rule, index) => (
              <View key={`key_${CreateCommonForm.RULES}_${index}`}>
                <Text
                  style={{
                    ...font.primary.regular,
                    ...font.fontSize(2),
                    marginTop: 20,
                    paddingHorizontal: 24,
                    color: colors.grey3,
                  }}>
                  Rule #{index + 1}
                </Text>
                <View style={[styles.sectionTitle, {marginTop: 10}]}>
                  <Text style={styles.textSubtitle}>{rule.title}</Text>
                </View>
                <Text style={styles.textContent}>{rule.value}</Text>
              </View>
            ))
          ) : (
            <View />
          )}
        </View>
      </ScrollView>
      <RequestStepActionButton
        title="Publish Common"
        formStore={agendaFormStore}
        onPress={() => confirmModal()}
      />
      <Modal
        isVisible={Boolean(newCommonAddress)}
        avoidKeyboard={true}
        backdropColor={colors.white}
        backdropOpacity={1}
        style={{padding: 0}}>
        <SentTemplate
          isCommonCreation={true}
          title="Your journey starts now"
          description="Your Common is ready. Spread the word and invite others to join you. You can always share it later."
          onClose={() => navigation.dispatch(StackActions.popToTop())}>
          <View style={styles.shareContainer}>
            <TouchableOpacity
              style={styles.modalRequestSentBtnPrimary}
              onPress={shareCommon}>
              <Text style={text.buttoncenterwhite}>Share now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalRequestSentBtnOutline}
              onPress={goToCommon}>
              <Text style={text.buttonblue}>Go to Common</Text>
            </TouchableOpacity>
          </View>
        </SentTemplate>
      </Modal>
    </SafeAreaView>
  );
};

CreateStep4.propTypes = {
  navigation: object,
  bottomSheetStore: object,
  userStore: object,
  route: shape({
    params: shape({
      formStores: shape({
        generalInfoFormStore: object.isRequired,
        fundingFormStore: object.isRequired,
        agendaFormStore: object.isRequired,
        reviewFormStore: object.isRequired,
      }).isRequired,
    }),
  }),
};

const stylesHeader = StyleSheet.create({
  generalInfoTitle: {
    marginTop: sizeM,
    ...font.primary.bold,
    ...font.fontSize(4),
    textAlign: 'center',
  },
  generalInfoSubtitle: {
    marginHorizontal: 20,
    marginTop: sizeS,
    color: colors.slate,
    marginBottom: sizeL,
    textAlign: 'center',
    lineHeight: sizeLineHeight,
    ...font.primary.regular,
    ...font.fontSize(2),
  },
});

const styles = StyleSheet.create({
  shareContainer: {
    flexDirection: 'column',
  },
  sectionTitle: {
    flexDirection: 'row',
    marginTop: 40,
    marginBottom: 10,
    paddingHorizontal: 24,
  },
  textTitle: {
    ...font.primary.bold,
    ...font.fontSize(4),
  },
  textSubtitle: {
    ...font.primary.bold,
    ...font.fontSize(3),
  },
  textContent: {
    ...font.primary.regular,
    ...font.fontSize(2),
    marginTop: 0,
    paddingHorizontal: 24,
    // marginBottom: 15,
  },
  uploadLogo: {
    alignSelf: 'flex-end',
    flex: 1,
    color: colors.mainBlue,
    ...font.primary.regular,
    ...font.fontSize(2),
    marginRight: 10,
  },
  linkText: {
    ...layout.marginTopS,
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.black,
    textDecorationLine: 'underline',
  },
  formImageFielAddIcon: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    padding: 2,
    backgroundColor: colors.mainBlue,
    borderWidth: 2,
    borderColor: colors.white,
  },
  modalRequestSentBtnOutline: {
    ...layout.btnOutline,
    ...layout.marginTopL,
    flexGrow: 0,
    width: '100%',
    alignSelf: 'stretch',
  },
  modalRequestSentBtnPrimary: {
    ...layout.btnPrimary,
    ...layout.marginTopL,
    flexGrow: 0,
    width: '100%',
  },
});

export default inject('bottomSheetStore', 'userStore')(observer(CreateStep4));
