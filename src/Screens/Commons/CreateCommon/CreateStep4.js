import React, {useEffect, useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {observer, inject} from 'mobx-react';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';
import Icon from '../../../Assets/iconfont/Icon';
import CreateStepHeader from './CreateStepHeader';
import CreateStepNavigation from './CreateStepNavigation';
import CreateCommonForm from '../../../Components/Forms/CreateCommonForm';
import WalletManager from '../../../Util/WalletManager';
import FirebaseService from '../../../Services/FirebaseService';
import CreateStepDotHeader from './CreateStepDotHeader';
import RequestStepActionButton from '../RequestStepActionButton';
import {numberFormatter, showErrorPopUp} from '../../../Util';
import Toast from '../../../Util/Toast';
import Modal from 'react-native-modal';
import SentTemplate from '../../../Components/ModalTemplates/SentTemplate';
import ArcService from '../../../Services/ArcService';
import Share from 'react-native-share';
import { BlurView } from '../../../Components';


const {width} = Dimensions.get('window');
import {CommonActions} from '@react-navigation/native';
import {
  colors,
  font,
  text,
  layout,
  sizeM,
  sizeS,
  sizeL,
  sizeLineHeight,
} from '../../../Theme';

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

import CreateStep4Indicators from './CreateStep4Indicators';

const CreateStep4 = props => {
  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const [newCommonAddress, setNewCommonAddress] = useState(false);

  const form = {
    ...props.generalInfoFormStore.getChangedFormFieldsJson(),
    ...props.fundingFormStore.getChangedFormFieldsJson(),
    ...props.agendaFormStore.getChangedFormFieldsJson(),
    ...props.reviewFormStore.getChangedFormFieldsJson(),
  };

  console.log(form);
  const [templateIndex, setTemplateIndex] = useState(1);
  const getImageUrl = index =>
    `https://firebasestorage.googleapis.com/v0/b/common-daostack.appspot.com/o/public_img%2Fcover_template_0${index}.png?alt=media`;
  const [imageURI, setImageURI] = useState(
    getImageUrl(1 + Math.floor(Math.random() * Math.floor(7))),
  );
  /* [avatarURL, setAvatarURL] = useState(null);
  */

  //set default value for Avatar and Image fields
  useEffect(() => {
    props.reviewFormStore.registerFormField(CreateCommonForm.AVATAR);
    props.reviewFormStore.registerFormField(CreateCommonForm.IMAGE);

    props.reviewFormStore.fieldChanged(CreateCommonForm.IMAGE, imageURI);
  }, []);

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 125],
      extrapolate: 'clamp',
    });
    // const height = scrollY.value > 100 ? 125 : 0;
    setHeaderHeight(height);
  }, [scrollY]);

  const changeIndex = number => {
    let index = templateIndex + number;
    if (index <= 1) {
      index = 1;
    }

    if (index >= 8) {
      index = 8;
    }
    setTemplateIndex(index);
    const currImageUrl = getImageUrl(index);
    props.reviewFormStore.fieldChanged(CreateCommonForm.IMAGE, currImageUrl);
    setImageURI(currImageUrl);
  };

  const goToCommon = () => {
    const navigate = CommonActions.navigate({
      name: 'CommonProfile',
      params: {
        commonId: newCommonAddress.toLowerCase(),
      },
    });
    props.navigation.popToTop();
    props.navigation.dispatch(navigate);
  };

  const pickImage = isAvatar => {
    const options = {
      title: (isAvatar && 'Select Avatar') || 'Select profile image',
      quality: 0.7,
      allowsEditing: isAvatar,
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        Toast.error(response.error);
        console.log('ImagePicker Error: ', response.error);
      } else {
        Toast.loading('Uploading...');
        FirebaseService.getInstance()
          .uploadImage(response.uri)
          .then(url => {
            Toast.hide();
            Toast.success('Done');
            if (isAvatar) {
              //setAvatarURL(url);
              props.reviewFormStore.fieldChanged(CreateCommonForm.AVATAR, url);
            } else {
              props.reviewFormStore.fieldChanged(CreateCommonForm.IMAGE, url);
              setImageURI(url);
            }
          })
          .catch(error => Toast.error(error));
      }
    });
  };

  const shareCommon = event => {
    const { name } = props.generalInfoFormStore.getChangedFormFieldsJson();
    const currCommonId = newCommonAddress.toLowerCase();
    const options = {
      url: `https://app.common.io/common/${currCommonId}`,
      title: "Let's make it happen",
      message: `Join in ${name} common`,
    };
    Share.open(options);
  };
  const forgeCommon = async () => {
    try {
      const address = props.userStore.userInfo.safeAddress;
      const formDataInit = {...form};

      const fundingGoalDeadline = formDataInit[CreateCommonForm.DEADLINE];

      const data = {
        ...formDataInit,
        founderAddresses: address,
        minFeeToJoin: parseInt(formDataInit.minimum, 10) * 100,
        fundingGoal: parseInt(formDataInit.funding, 10) * 100,
        fundingGoalDeadline,
      };
      console.log('calling createCommon(...)');

      props.navigation.navigate({
        name: 'FullScreenCreationLoader',
        params: {
          title: 'Creating your Common',
          message: 'This might take a couple of minutes.',
        },
      });

      const commonAddress = await ArcService.getInstance().createCommon(
        data,
        props.navigation,
      );

      if (commonAddress) {
        setNewCommonAddress(commonAddress);
      }

      return {commonAddress};
    } catch (e) {
      props.navigation.pop();
      showErrorPopUp(props.bottomSheetStore, e.message);
    }
  };

  // console.log('FORM -> ', form);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <CreateStepNavigation navigation={props.navigation} title="Agenda" />
      <CreateStepDotHeader
        title="Final touches and review"
        currentIndex={4}
        navigation={props.navigation}
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
        ])}>
        <CreateStepHeader currentIndex={3} />
        <View
          style={{
            flex: 1,
            // alignItems: 'center',
            // padding: 24,
            backgroundColor: 'white',
          }}>
          <Text style={stylesHeader.generalInfoTitle}>
            Final touches and review
          </Text>
          <Text style={stylesHeader.generalInfoSubtitle}>
            You will not be able to make changes to the common info after it is
            published
          </Text>
          <View
            style={{
              height: 225,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{
                position: 'absolute',
                height: 225,
                width: width,
                backgroundColor: colors.grey4,
              }}
              source={{
                uri: imageURI,
              }}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 15,
                right: 15,
                padding: 10,
                color: 'white',
              }}
              onPress={() => pickImage(false)}>
              <BlurView style={{padding: 12, borderRadius: 14}}>
                <Icon name={'addpicture'} color="white" size={20} />
              </BlurView>
            </TouchableOpacity>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={{
                  padding: 10,
                  opacity: templateIndex === 1 ? 0.5 : 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                }}
                onPress={() => changeIndex(-1)}>
                <Icon name="left-arrow" color="white" size={35} />
              </TouchableOpacity>
              <View width={width - 100}>
                <Text style={styles.titleName}>
                  {form[CreateCommonForm.NAME]}
                </Text>
                <Text style={styles.byline}>
                  {form[CreateCommonForm.BYLINE]}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  padding: 10,
                  opacity: templateIndex === 8 ? 0.5 : 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                }}
                onPress={() => changeIndex(1)}>
                <Icon name="right-arrow" color="white" size={35} />
              </TouchableOpacity>
            </View>
          </View>

          {/* {avatarURL === null ? (
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 10,
                marginVertical: 15,
              }}>
              <Text
                style={{
                  ...font.primary.regular,
                  ...font.fontSize(2),
                  marginLeft: 10,
                  color: colors.grey,
                  flex: 1,
                  alignSelf: 'flex-start',
                }}>
                Have an avatar for your Common?
              </Text>
              <TouchableOpacity onPress={() => pickImage(true)}>
                <Text style={styles.uploadLogo}>Upload logo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{marginBottom: 30}}>
              <Text style={{color: colors.slate, fontSize: 14, margin: 24}}>
                Avatar
              </Text>
              <View style={{width: 70, alignSelf: 'center'}}>
                <Image
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 58,
                    width: 58,
                    borderRadius: 29,
                    backgroundColor: colors.grey4,
                    borderColor: colors.grey4,
                    borderWidth: 0.5,
                  }}
                  resizeMode="cover"
                  source={{uri: avatarURL}}
                />
                <TouchableOpacity
                  style={styles.formImageFielAddIcon}
                  onPress={() => setAvatarURL(null)}>
                  <Icon name="delete" size={15} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )} */}
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
                number={numberFormatter(form[CreateCommonForm.MINIMUM])}
              />
            </View>

            <View style={{width: 120, marginHorizontal: 10}}>
              <CreateStep4Indicators
                title="Period"
                currencySymbol={false}
                number={moment
                  .unix(form[CreateCommonForm.DEADLINE])
                  .format('MMM DD, YYYY')}
              />
            </View>
          </View>
          <View style={styles.sectionTitle}>
            <Text style={styles.textTitle}>About</Text>
          </View>
          <Text style={styles.textContent}>
            {form[CreateCommonForm.DESCRIPTION]}
          </Text>
          <>
            <View style={styles.sectionTitle}>
              <Text style={styles.textSubtitle}>Course of action</Text>
            </View>
            <Text style={styles.textContent}>
              {form[CreateCommonForm.ACTION]}
            </Text>
          </>
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
              form[CreateCommonForm.LINKS].map(x => (
                <Text
                  key={`key_${CreateCommonForm.LINKS}_${x}`}
                  style={styles.textContent}>
                  {x.title}
                </Text>
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
                <Text style={styles.textContent}>{rule.url}</Text>
              </View>
            ))
          ) : (
            <View />
          )}
        </View>
      </ScrollView>
      <RequestStepActionButton
        title="Publish Common"
        pass={props.agendaFormStore.isFormActionEnabled()}
        onPress={forgeCommon}
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
          onClose={() => props.navigation.dispatch(StackActions.popToTop())}>
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

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  shareContainer: {
    flexDirection: 'column',
  },
  container: {
    backgroundColor: colors.white,
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    marginVertical: 10,
    marginHorizontal: 10,
    justifyContent: 'center',
    borderRadius: 2,
    height: 50,
  },
  placeholderText: {
    color: colors.grey3,
  },
  text: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.black,
  },
  readMoreButton: {
    ...font.primary.regular,
    ...font.fontSize(1),
    color: colors.grey3,
  },
  continueButton: {
    width: '100%',
    height: 48,
    borderRadius: 32,
    marginTop: 45,
    flexDirection: 'row',
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
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
  titleName: {
    color: colors.white,
    textAlign: 'center',
    alignSelf: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    ...font.primary.bold,
    ...font.fontSize(4),
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 4,
  },
  byline: {
    width: '100%',
    color: colors.white,
    textAlign: 'center',
    alignSelf: 'center',
    ...font.primary.regular,
    ...font.fontSize(2),
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

export default inject(
  'bottomSheetStore',
  'generalInfoFormStore',
  'fundingFormStore',
  'agendaFormStore',
  'reviewFormStore',
  'userStore',
  'daoStore',
)(observer(CreateStep4));
