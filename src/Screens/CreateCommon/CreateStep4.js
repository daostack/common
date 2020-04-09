import React, {useEffect, useRef, useState} from 'react';
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
import {colors} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import {observer, inject} from 'mobx-react';
const {width, height} = Dimensions.get('window');
import CreateStepHeader from './CreateStepHeader';
import CreateStepNavigation from './CreateStepNavigation';
import CreateCommonForm from '../../Components/Forms/CreateCommonForm';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';
import FirebaseService from '../../Services/FirebaseService';
import {useToast} from '../../Util/Toast'

const firebaseService = new FirebaseService()

const CreateStep4 = props => {
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const form = props.createCommonFormStore.getChangedFormFieldsJson();
  const [templateIndex, setTemplateIndex] = useState(1);
  const [imageURI, setImageURI] = useState('https://firebasestorage.googleapis.com/v0/b/common-daostack.appspot.com/o/public_img%2Fcover_template_01.png?alt=media')

  console.log(form['name']);

  const toast = useToast();

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
    setImageURI(`https://firebasestorage.googleapis.com/v0/b/common-daostack.appspot.com/o/public_img%2Fcover_template_0${index}.png?alt=media`)
  };

  const pickImage = () => {
    const options = {
      title: 'Select Avatar',
      quality: 0.6,
      allowsEditing: true,
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        toast.error(response.error)
        console.log('ImagePicker Error: ', response.error);
      } else {
        console.log('TTTTTTT')
        // const source = { uri: response.uri };
        toast.loading('Uploading...');
        firebaseService.uploadImage(response.uri).then(url => {
          toast.hide();
          setImageURI(response.uri);
          console.log('RRRRR', url);
        }).catch(error =>
          toast.error(error)
        )
      }
    });
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <CreateStepNavigation navigation={props.navigation} title="Agenda" />
      <Animated.View style={[styles.header, {height: headerHeight}]}>
        <View style={styles.bar}>
          <View
            style={{
              marginTop: 80,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          <Text style={styles.title}>Review</Text>
        </View>
      </Animated.View>
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
              style={{position: 'absolute', height: 225, width: width, backgroundColor: colors.grey4}}
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
              onPress={() => pickImage()}>
              <Icon name="add-picture" color='white' size={20} />
            </TouchableOpacity>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity style={{padding: 10, opacity: templateIndex === 1 ? 0.5 : 1,alignSelf: 'flex-start'}} onPress={() => changeIndex(-1)}>
                <Icon name="left-arrow" color="white" size={35} />
              </TouchableOpacity>
            <Text style={styles.titleName}>{form[CreateCommonForm.FIELD_NAME]}</Text>
              <TouchableOpacity style={{padding: 10, opacity: templateIndex === 8 ? 0.5 : 1, alignSelf: 'flex-end'}} onPress={() => changeIndex(1)}>
                <Icon name="right-arrow" color="white" size={35} />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 10,
              marginVertical: 15,
            }}>
            <Text style={{flex: 1, alignSelf: 'flex-start'}}>
              Have an avatar for you Common?
            </Text>
            <TouchableOpacity>
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
          <View
            style={{height: 1, width: width, backgroundColor: colors.grey4}}
          />
          <View style={styles.sectionTitle}>
            <View style={{minWidth: 90, marginRight: 10}}>
              <Text
                style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
                ${form[CreateCommonForm.FIELD_FUNDING_GOAL]}
              </Text>
              <Text style={{fontSize: 14, textAlign: 'center', marginTop: 10}}>
                Goal
              </Text>
            </View>
            <View style={{width: 90, marginHorizontal: 10}}>
              <Text
                style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
                ${form[CreateCommonForm.FIELD_MINIMUM]}
              </Text>
              <Text style={{fontSize: 14, textAlign: 'center', marginTop: 10}}>
                Contribution
              </Text>
            </View>
            <TouchableOpacity
              style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
              <Icon
                name="edit"
                size={16}
                style={{textAlign: 'right', alignSelf: 'flex-end'}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.sectionTitle}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>About</Text>
            <TouchableOpacity
              style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
              <Icon
                name="edit"
                size={16}
                style={{textAlign: 'right', alignSelf: 'flex-end'}}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.textContent}>
          {form[CreateCommonForm.FIELD_DESCRIPTION]}
          </Text>
          <>
            <View style={styles.sectionTitle}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                Course of action
              </Text>
              <TouchableOpacity
                style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
                <Icon
                  name="edit"
                  size={16}
                  style={{textAlign: 'right', alignSelf: 'flex-end'}}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.textContent}>
             {form[CreateCommonForm.FIELD_ACTION]}
            </Text>
          </>
          <>
            <View style={styles.sectionTitle}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>Link</Text>
              <TouchableOpacity
                style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
                <Icon
                  name="edit"
                  size={16}
                  style={{textAlign: 'right', alignSelf: 'flex-end'}}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.textContent}>https://www.google.com/</Text>
          </>
          <>
            <View style={styles.sectionTitle}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>Deadline</Text>
              <TouchableOpacity
                style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
                <Icon
                  name="edit"
                  size={16}
                  style={{textAlign: 'right', alignSelf: 'flex-end'}}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.textContent}>{moment(form[CreateCommonForm.FIELD_DEADLINE]).format('MMM DD, YYYY')}</Text>
          </>
          <>
            <Text
              style={{
                fontSize: 14,
                marginTop: 20,
                paddingHorizontal: 24,
                color: colors.grey3,
              }}>
              Rule #1
            </Text>
            <View style={[styles.sectionTitle, {marginTop: 10}]}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                No promotions or spam
              </Text>
              <TouchableOpacity
                style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
                <Icon
                  name="edit"
                  size={16}
                  style={{textAlign: 'right', alignSelf: 'flex-end'}}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.textContent}>
              We created this community to help you along your journey. Links to
              sponsored content or brands will vote you out.
            </Text>
          </>
          <>
            <Text
              style={{
                fontSize: 14,
                marginTop: 20,
                paddingHorizontal: 24,
                color: colors.grey3,
              }}>
              Rule #2
            </Text>
            <View style={[styles.sectionTitle, {marginTop: 10}]}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                Be courteous and kind to others
              </Text>
              <TouchableOpacity
                style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
                <Icon
                  name="edit"
                  size={16}
                  style={{textAlign: 'right', alignSelf: 'flex-end'}}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.textContent}>
              We're all in this together to create a nurturing enviroment. Let's
              teat everyone with resprct. Healthy debates are natural, but
              kindness is required.
            </Text>
          </>
        </View>
        <TouchableOpacity
          style={styles.continueButton}
          // onPress={push}
        >
          <Text
            style={{
              fontSize: 16,
              color: 'white',
              fontWeight: '700',
            }}>
            Continue to Review
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
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.grey5,
    borderColor: colors.mainBlue,
    borderWidth: 1,
    marginHorizontal: 5,
  },
  dot2: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.grey5,
    borderColor: colors.grey3,
    borderWidth: 1,
    marginHorizontal: 5,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    overflow: 'hidden',
    zIndex: 999,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
  },
  bar: {
    marginTop: 28,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    // bottomborder: 'solid',
  },
  title: {
    backgroundColor: 'transparent',
    color: colors.black,
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    paddingVertical: 10,
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
  },
  titleName: {
    width: '70%',
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
});

export default inject('createCommonFormStore')(observer(CreateStep4));
