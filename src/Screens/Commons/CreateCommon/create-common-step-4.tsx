import React, {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {observer} from 'mobx-react';
import {StackActions} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/core';
import Modal from 'react-native-modal';

import {numberFormatter, showErrorPopUp} from '~/Util';
import SentTemplate from '~/Components/ModalTemplates/SentTemplate';
import CreateStep4Indicators from './CreateStep4Indicators';
import CommonImage from '~/Components/Commons/CommonImage';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import {Bold} from '~/Components/Text/Bold';
import Icon from '~/Assets/iconfont/Icon';

import {colors, font, text, layout, sizeM, sizeL, sizeXL} from '~/Theme';
import {shareCommon} from '~/Services';
import {useStore} from '~/Stores';
import RequestStepActionButton from '../RequestStepActionButton';

const {width} = Dimensions.get('window');
const CONTRIBUTION = {
  monthly: '/mo',
  'one-time': '',
};

const CreateCommonStep4Screen: React.FC = () => {
  const {
    uiStore: {bottomSheetStore},
    formStores,
  } = useStore();
  const navigation = useNavigation();
  const [newCommonAddress, setNewCommonAddress] = useState(false);

  const minContribution = formStores.formResults.zeroContribution
    ? '0'
    : formStores.formResults.minimum;

  const goToCommon = React.useCallback(() => {
    const common = formStores.forgedCommon;
    if (common) {
      navigation.dispatch(StackActions.popToTop());
      navigation.navigate('CommonProfile', {commonId: common.id});
    }
  }, []);

  React.useEffect(() => {
    if (formStores.forgingCommon) {
      navigation.navigate({
        name: 'FullScreenCreationLoader',
        params: {
          title: 'Creating your Common',
          message: 'This might take a couple of minutes.',
        },
      });
    }
  }, []);
  React.useEffect(() => {
    if (formStores.forgingCommonError) {
      showErrorPopUp(bottomSheetStore, formStores.forgingCommonError);
      navigation.dispatch(StackActions.pop());
    }
  }, [formStores.forgingCommonError]);

  const displayString = () =>
    `${numberFormatter(minContribution)}${CONTRIBUTION[form.contribution]}`;

  return (
    <StepDotLayout
      stepDotHeaderTitle="Final touches and review"
      navTitle="Final touches and review"
      currentIndex={4}
      isRequestButtonSticky={false}
      prependedArea={
        <Modal
          isVisible={Boolean(formStores.forgedCommon)}
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
                onPress={() => shareCommon(common)}>
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
          formStore={formStores.agendaFormStore}
          onPress={formStores.forgeCommon}
          isSticky={false}
        />
      }
      closeDialog={function (): void {
        throw new Error('Function not implemented.');
      }}
      onScrollEndDrag={function (): void {
        throw new Error('Function not implemented.');
      }}
      appendedArea={undefined}
      layoutTitle={undefined}
      onContentSizeChange={function (): void {
        throw new Error('Function not implemented.');
      }}>
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

export default observer(CreateCommonStep4Screen);
