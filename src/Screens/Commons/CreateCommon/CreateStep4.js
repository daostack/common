import React, {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {inject, observer} from 'mobx-react';
import {StackActions} from '@react-navigation/native';

import moment from 'moment';
import CreateCommonForm from '~/Components/Forms/CreateCommonForm';
import RequestStepActionButton from '../RequestStepActionButton';
import {numberFormatter, showErrorPopUp} from '~/Util';

import Modal from 'react-native-modal';
import SentTemplate from '~/Components/ModalTemplates/SentTemplate';
import Share from 'react-native-share';
import CreateStep4Indicators from './CreateStep4Indicators';
import {CommonActions} from '@react-navigation/native';
import {object, shape} from 'prop-types';
import CommonImage from '~/Components/Commons/CommonImage';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import {Bold} from '~/Components/Text/Bold';
import Icon from '~/Assets/iconfont/Icon';
import {createCommon} from '~/Services/ListServices/CommonListService';

import {colors, font, text, layout, sizeM, sizeL, sizeXL} from '~/Theme';
import logger from '~/Services/Logger';
import {rootStorePropTypes} from '~/Types/propTypes';

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
  rootStore,
}) => {
  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;
  const authStore = rootStore.authStore;

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

  const minContribution = form[CreateCommonForm.ZERO_CONTRIBUTION]
    ? '0'
    : form[CreateCommonForm.MINIMUM];

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

  const shareCommon = () => {
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

      const contributionAmount = parseFloat(formDataInit.minimum, 10) * 100;

      const data = {
        ...formDataInit,
        founderId: authStore.userInfo?.uid,
        fundingMinimumAmount: contributionAmount,
        contributionAmount,
        fundingType: formDataInit.contribution,
      };
      logger.log('calling createCommon(...)');

      const formattedData = {
        name: data.name,
        image: data.image,
        rules: [], // TODO: Change Link component to new fields { title, url } data.rules,
        links: [], //escapeUrl(data.links),
        byline: data.byline || '',
        description: data.description || '',
      };

      navigation.navigate({
        name: 'FullScreenCreationLoader',
        params: {
          title: 'Creating your Common',
          message: 'This might take a couple of minutes.',
        },
      });

      const createCommonResponse = await createCommon({
        ...formattedData,
        fundingMinimumAmount: data.contributionAmount,
        fundingType: 'OneTime', // TODO: change funding types
      });

      if (createCommonResponse.id) {
        setNewCommonAddress(createCommonResponse.id);
      } else {
        //navigation.pop();
        showErrorPopUp(bottomSheetStore, createCommonResponse);
      }

      return {commonAddress: createCommonResponse.id};
    } catch (e) {
      navigation.pop();
      showErrorPopUp(bottomSheetStore, e);

      navigation.pop();
    }
  };

  const displayString = () =>
    `${numberFormatter(minContribution)}${CONTRIBUTION[form.contribution]}`;

  return (
    <StepDotLayout
      navigation={navigation}
      stepDotHeaderTitle="Final touches and review"
      navTitle="Final touches and review"
      currentIndex={4}
      isRequestButtonSticky={false}
      prependedArea={
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
      }
      requestStepActionButton={
        <RequestStepActionButton
          title="Publish Common"
          formStore={agendaFormStore}
          onPress={() => forgeCommon()}
          isSticky={false}
        />
      }>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <Text style={stylesHeader.generalInfoTitle}>
          Final touches and review
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
              amount={minContribution}
            />
          </View>

          <View style={{width: 120, marginHorizontal: 10}}>
            <CreateStep4Indicators
              title="Safety period"
              currencySymbol={false}
              value={moment().fromNow(true)}
              date={moment().format('MMM DD, YYYY')}
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
          {form[CreateCommonForm.LINKS]?.length &&
            form[CreateCommonForm.LINKS].map((x) => (
              <View
                key={`key_${CreateCommonForm.LINKS}_${x.title}`}
                style={styles.iconStyle}>
                <Icon
                  name="link"
                  size={16}
                  style={{textAlign: 'right', alignSelf: 'flex-end'}}
                />
                <Text
                  onPress={() => {
                    navigation.navigate('Browser', {
                      url: x.value,
                    });
                  }}
                  style={{...styles.linkText, flex: 'row'}}>
                  {x.title}
                </Text>
              </View>
            ))}
        </>
        {form[CreateCommonForm.RULES]?.length > 0 &&
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
          ))}
        <>
          <View style={styles.sectionTitle}>
            <Text style={styles.textTitle}>Minimum contribution</Text>
          </View>
          <Text style={styles.textContent}>
            ${minContribution}{' '}
            <Bold boldText={form[CreateCommonForm.CONTRIBUTION]} /> contribution
          </Text>
          {form.zeroContribution && (
            <Text style={styles.textContent}>
              Members will be able to join the Common without a personal
              contribution
            </Text>
          )}
        </>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            To publish the Common, add a personal contribution.
            <Bold
              boldText=" Don't worry, you will be able to
            make changes "
            />
            to the Common info after it is published.
          </Text>
        </View>
      </View>
    </StepDotLayout>
  );
};

CreateStep4.propTypes = {
  navigation: object,
  rootStore: rootStorePropTypes,
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
    marginBottom: sizeL,
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
    marginBottom: 15,
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
    display: 'flex',
    alignContent: 'center',
    paddingLeft: 10,
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
  text: {
    fontSize: 15,
    textAlign: 'center',
    ...font.lineHeight(0),
    color: colors.slate,
    paddingHorizontal: 5,
  },
  textContainer: {
    alignSelf: 'center',
    borderRadius: 14,
    backgroundColor: colors.lighterBlue,
    marginTop: sizeXL,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconStyle: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    marginLeft: 20,
    alignContent: 'flex-start',
  },
});

export default inject('rootStore')(observer(CreateStep4));
