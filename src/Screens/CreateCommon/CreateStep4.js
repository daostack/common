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
import {colors} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import CreateStepHeader from './CreateStepHeader';
import CreateStepNavigation from './CreateStepNavigation';
import CreateCommonForm from '../../Components/Forms/CreateCommonForm';
import {IpfsClient} from '../../Config';
import WalletManager from '../../Util/WalletManager';
import FirebaseService from '../../Services/FirebaseService';
import CreateStepDotHeader from './CreateStepDotHeader';
import {numberFormatter} from '../../Util';

import ArcService from '../../Services/ArcService';
const {width} = Dimensions.get('window');

const firebaseService = new FirebaseService();

const CreateStep4 = props => {
  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const form = props.createCommonFormStore.getChangedFormFieldsJson();
  const [templateIndex, setTemplateIndex] = useState(1);
  const [imageURI, setImageURI] = useState(
    'https://firebasestorage.googleapis.com/v0/b/common-daostack.appspot.com/o/public_img%2Fcover_template_01.png?alt=media',
  );
  const [avatarURL, setAvatarURL] = useState(null);

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
    setImageURI(
      `https://firebasestorage.googleapis.com/v0/b/common-daostack.appspot.com/o/public_img%2Fcover_template_0${index}.png?alt=media`,
    );
  };

  useEffect(() => {
    props.createCommonFormStore.registerFormField(
      CreateCommonForm.AVATAR,
      'url',
    );
    props.createCommonFormStore.registerFormField(
      CreateCommonForm.IMAGE,
      'url',
    );
  }, [props.createCommonFormStore]);

  const pickImage = isAvatar => {
    const options = {
      title: 'Select Avatar',
      quality: 0.7,
      allowsEditing: isAvatar,
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        // toast.error(response.error);
        console.log('ImagePicker Error: ', response.error);
      } else {
        // const source = { uri: response.uri };
        // toast.loading('Uploading...');
        firebaseService
          .uploadImage(response.uri)
          .then(url => {
            toast.hide();
            if (isAvatar) {
              setAvatarURL(url);
              props.createCommonFormStore.fieldChanged(
                CreateCommonForm.AVATAR,
                url,
              );
            } else {
              props.createCommonFormStore.fieldChanged(
                CreateCommonForm.IMAGE,
                url,
              );
              setImageURI(url);
            }
          })
          .catch(error => toast.error(error));
      }
    });
  };

  const ipfsUpload = async formData =>
    // TODO: use arc.saveIPFSData({ name: formData.name}) once https://github.com/daostack/arc.js/issues/468 is resolved
    IpfsClient.addAndPinString(
      JSON.stringify({
        name: formData.name,
        byline: formData.byline,
        description: formData.description,
        courseOfAction: formData.action,
        // TODO: actuall add the values here (as an arry probably)
        mainValue1: formData.funding,
        mainValue2: formData.minimum,
        mainValue3: 'empty value',
      }),
    );
  // TODO: use arc.saveIPFSData({ name: formData.name}) here
  const forgeCommon = async () => {
    const commonFormData = props.createCommonFormStore.getChangedFormFieldsJson();
    console.log('saving data on ipfs: ', commonFormData);
    const ipfsHash = await ipfsUpload(commonFormData);

    const formData = props.createCommonFormStore.getChangedFormFieldsJson();
    const manager = await WalletManager.getInstance();
    const address = await manager.getAddress();
    console.log('owner account: ', address);

    // TODO: get form data for fundingGoalDeadline; these are in secondSinceEpoch
    const deadline = '1621679337'; // in may 2021
    const data = {
      name: formData.name,
      founderAddresses: address,
      tokenDist: [0],
      repDist: [100],
      minFeeToJoin: parseInt(formData.minimum, 10),
      fundingGoal: formData.funding,
      fundingGoalDeadline: deadline,
      ipfsHash,
    };
    console.log('calling createCommon(...)');

    const commonAddress = await ArcService.getInstance().createCommon(
      data,
      props.navigation,
      props.daoStore,
    );

    if (commonAddress) {
      props.navigation.dispatch(StackActions.popToTop());
    }

    return {commonAddress};
  };

  // const creationError = event => {
  //   errorSheetRef.current.snapTo(1);
  //   errorSheetRef.current.snapTo(1);
  // };

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
          <Text
            style={{
              marginTop: 24,
              fontWeight: '700',
              fontSize: 18,
              textAlign: 'center',
            }}>
            Final touches and review
          </Text>
          <Text
            style={{
              marginTop: 12,
              marginBottom: 23,
              textAlign: 'center',
              marginHorizontal: 20,
            }}>
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
              <Icon name="add-picture" color="white" size={20} />
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

          {avatarURL === null ? (
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 10,
                marginVertical: 15,
              }}>
              <Text style={{flex: 1, alignSelf: 'flex-start'}}>
                Have an avatar for you Common?
              </Text>
              <TouchableOpacity onPress={() => pickImage(true)}>
                <Text
                  style={{
                    alignSelf: 'flex-end',
                    flex: 1,
                    color: colors.mainBlue,
                    fontSize: 16,
                    fontFamily: 'Roboto',
                    fontWeight: 'bold',
                  }}>
                  Upload avatar
                </Text>
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
          )}
          <View
            style={{height: 1, width: width, backgroundColor: colors.grey4}}
          />
          <View style={styles.sectionTitle}>
            <View style={{minWidth: 90, marginRight: 10}}>
              <Text
                style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
                ${numberFormatter(form[CreateCommonForm.FUNDING_GOAL])}
              </Text>
              <Text style={{fontSize: 14, textAlign: 'center', marginTop: 10}}>
                Goal
              </Text>
            </View>
            <View style={{width: 90, marginHorizontal: 10}}>
              <Text
                style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
                ${numberFormatter(form[CreateCommonForm.MINIMUM])}
              </Text>
              <Text style={{fontSize: 14, textAlign: 'center', marginTop: 10}}>
                Contribution
              </Text>
            </View>
          </View>
          <View style={styles.sectionTitle}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>About</Text>
          </View>
          <Text style={styles.textContent}>
            {form[CreateCommonForm.DESCRIPTION]}
          </Text>
          <>
            <View style={styles.sectionTitle}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                Course of action
              </Text>
            </View>
            <Text style={styles.textContent}>
              {form[CreateCommonForm.ACTION]}
            </Text>
          </>
          <>
            <View style={styles.sectionTitle}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>Link</Text>
              {/* <TouchableOpacity
                style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
                <Icon
                  name="edit"
                  size={16}
                  style={{textAlign: 'right', alignSelf: 'flex-end'}}
                />
              </TouchableOpacity> */}
            </View>
            {form[CreateCommonForm.LINKS].length ? (
              form[CreateCommonForm.LINKS].map(x => (
                <Text style={styles.textContent}>{x}</Text>
              ))
            ) : (
              <View />
            )}
          </>
          <>
            <View style={styles.sectionTitle}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>Deadline</Text>
            </View>
            <Text style={styles.textContent}>
              {moment(form[CreateCommonForm.DEADLINE]).format('MMM DD, YYYY')}
            </Text>
          </>

          {form[CreateCommonForm.RULES].length ? (
            form[CreateCommonForm.RULES].map((rule, index) => (
              <>
                <Text
                  style={{
                    fontSize: 14,
                    marginTop: 20,
                    paddingHorizontal: 24,
                    color: colors.grey3,
                  }}>
                  Rule #{index + 1}
                </Text>
                <View style={[styles.sectionTitle, {marginTop: 10}]}>
                  <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                    {rule.title}
                  </Text>
                </View>
                <Text style={styles.textContent}>{rule.description}</Text>
              </>
            ))
          ) : (
            <View />
          )}
        </View>
        <TouchableOpacity style={styles.continueButton} onPress={forgeCommon}>
          <Text
            style={{
              fontSize: 16,
              color: 'white',
              fontWeight: '700',
            }}>
            Publish Common
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
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
    fontSize: 15,
    color: colors.black,
  },
  readMoreButton: {
    fontSize: 12,
    // fontWeight: '700',
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
    flex: 1,
    paddingHorizontal: 24,
  },
  textContent: {
    fontSize: 14,
    marginTop: 0,
    paddingHorizontal: 24,
    marginBottom: 15,
  },
  titleName: {
    color: 'white',
    opacity: 0.8,
    textAlign: 'center',
    alignSelf: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 4,
  },
  byline: {
    width: '100%',
    color: 'white',
    opacity: 0.8,
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: 'Roboto',
    fontSize: 14,
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
});

export default inject(
  'createCommonFormStore',
  'daoStore',
)(observer(CreateStep4));
