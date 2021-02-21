import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Modal,
} from 'react-native';
import {observer, inject} from 'mobx-react';
import Icon from '~/Assets/iconfont/Icon';
import {colors, layout, font, text, sizeM, sizeS, sizeXL} from '~/Theme';
import Toast from '~/Util/Toast.js';
import moment from 'moment';
import NavigationBar from 'react-native-navbar';
import auth from '@react-native-firebase/auth';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import ImageView from 'react-native-image-viewing';
import {db} from '../../Firebase';
import {object, shape, string} from 'prop-types';
import Hyperlink from 'react-native-hyperlink';
import DiscussionMessagesList from '~/Screens/DisscussionMessages/DiscussionMessagesList';

import {rootStorePropTypes} from '~/Types/propTypes';
import {updateDiscussionLastMessage} from '~/Services/ListServices/DiscussionListService';
import ModerationFormStore from '~/FormStores/ModerationFormStore';
import * as ModerationForm from '~/Components/Forms/ModerationForm';
import {Hide} from '~/Components';
import ModerationService from '~/Services/ModerationService';
const {width} = Dimensions.get('window');

const Discussions = ({
  navigation,
  route: {
    params: {commonId, discussionId, data, hasPermission},
  },
  rootStore,
}) => {
  const commonStore = rootStore.commonStore;
  const discussionStore = rootStore.discussionStore;
  const authStore = rootStore.authStore;
  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;
  const userStore = rootStore.userStore;

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const currentUser = auth().currentUser;
  const dataState = discussionStore.getDiscussionById(discussionId);
  const user = userStore.getUserById(dataState.ownerId);

  const [inputText, setInputText] = useState(null);
  const [imageGalleryIndex, setImageGalleryIndex] = useState(-1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [inputHeight, setInputHeight] = useState(false);
  const [moderationFormStore] = useState(new ModerationFormStore());
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [action, setAction] = useState('Report');

  const isMember =
    authStore.userInfo &&
    authStore.isDaoMember(commonStore.getCommonById(commonId)?.members);

  useEffect(() => {}, [commonId, discussionId, currentUser]);

  const showLoginScreen = () => {
    bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.LOGIN_SHEET_SCREEN);
  };

  const sendMessageToDiscussion = async () => {
    if (isSending) {
      return;
    }
    setIsSending(true);

    if (!currentUser) {
      showLoginScreen();
      setIsSending(false);
      return;
    }

    const message = inputText;
    if (message && message.trim().length) {
      inputRef.current.clear();

      db.collection('discussionMessage')
        .doc()
        .set({
          text: message,
          createTime: new Date(),
          ownerId: currentUser.uid,
          commonId: commonId,
          discussionId: discussionId,
        })
        .then(async (msg) => {
          Keyboard.dismiss();
          setInputText('');
          await updateDiscussionLastMessage(discussionId, currentUser.uid);
        })
        .catch((error) => {
          Toast.error(error);
        })
        .finally(() => {
          setIsSending(false);
        });
    } else {
      Toast.error('Empty Message');
      setIsSending(false);
    }
  };

  const headerImages = () => (
    <>
      {dataState.images ? (
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{marginBottom: 20}}>
          <View style={styles.imageGallery}>
            <View style={{width: 20}} />
            {dataState.images.map((currImage, currIndex) => (
              <View key={`proposalImg_${currIndex}`}>
                <TouchableOpacity
                  onPress={() => setImageGalleryIndex(currIndex)}>
                  <Image
                    key={currIndex}
                    style={{
                      ...styles.galleryImage,
                      ...{width: width * 0.8},
                    }}
                    resizeMode="cover"
                    source={{uri: currImage.value}}
                  />
                </TouchableOpacity>
              </View>
            ))}
            <View style={{width: 20}} />
          </View>
        </ScrollView>
      ) : null}
    </>
  );

  const headerFiles = () => (
    <>
      {dataState.files &&
        dataState.files.map((f, index) => (
          <View style={styles.adRow} key={`discussion_file_${index}`}>
            <Icon name="file" color={colors.mainBlue} size={16} />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Browser', {
                  url: f.value,
                })
              }>
              <Text style={styles.adsText}>{fileName(f.value)}</Text>
            </TouchableOpacity>
          </View>
        ))}
    </>
  );

  const fileName = (url) => {
    url = url.split('_');
    return url[url.length - 2];
  };

  const header = () => (
    // <SafeAreaView flex={1}>
    <>
      <NavigationBar
        statusBar={{hidden: true}}
        style={{
          height: 48,
        }}
        title={{
          title: dataState.title,
          style: [text.h2Black, {paddingLeft: 50, paddingRight: 20}],
          ellipsizeMode: 'tail',
          numberOfLines: 1,
        }}
        leftButton={
          <TouchableOpacity
            style={{justifyContent: 'center'}}
            onPress={() => navigation.pop()}>
            <Icon name="left-arrow" size={32} style={{marginLeft: 10}} />
          </TouchableOpacity>
        }
        // rightButton={
        //   <TouchableOpacity
        //     style={{justifyContent: 'center'}}
        //     onPress={openOptionsMenu}>
        //     <Icon
        //       name="menu-horizontal"
        //       size={32}
        //       style={{marginRight: 10}}
        //     />
        //   </TouchableOpacity>
        // }
      />
      <View style={{overflow: 'hidden', paddingBottom: 5}}>
        <View style={styles.headerContainer}>
          {isExpanded ? (
            <View
              style={{
                paddingTop: 20,
                paddingHorizontal: 20,
                maxHeight: '94%',
              }}>
              <ScrollView>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={styles.avatar}
                    source={user.photoURL ? {uri: user.photoURL} : null}
                  />
                  <View style={{flex: 1, paddingHorizontal: 10}}>
                    <Text style={styles.displayName}>{user.displayName}</Text>
                    {/* <Text style={{color: colors.grey3}}>0.1% REP</Text> */}
                    <Text style={styles.date}>
                      {moment(dataState.createTime.toDate()).fromNow()}
                    </Text>
                  </View>
                </View>

                <View>
                  <Hyperlink
                    linkDefault={true}
                    linkStyle={styles.hyperLinkStyle}>
                    <Text style={styles.message}>{dataState.message}</Text>
                  </Hyperlink>
                </View>

                {headerImages()}
                {headerFiles()}
              </ScrollView>

              <TouchableOpacity
                style={{alignItems: 'center', paddingVertical: 10}}
                onPress={() => {
                  setIsExpanded(!isExpanded);
                }}>
                <Image
                  style={{height: 10, width: 60}}
                  source={require('../../Assets/collapse.png')}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={{alignItems: 'center', paddingVertical: 10}}
                onPress={() => {
                  setIsExpanded(!isExpanded);
                }}>
                <Image
                  style={{height: 10, width: 60}}
                  source={require('../../Assets/expand.png')}
                />
              </TouchableOpacity>
            </>
          )}
          {/* <View
            style={{
              height: 4,
              marginTop: 10,
              // paddingHorizontal: -20,
              marginHorizontal: -20,
              backgroundColor: colors.grey4,
            }}
          /> */}
        </View>
      </View>
      {/* </SafeAreaView> */}
    </>
  );

  const onModerate = async (action, messageId) => {
    bottomSheetStore.hideBottomSheet();
    if (action === 'Show') {
      await ModerationService.getInstance().show(messageId, commonId, 'discussionMessage');
      bottomSheetStore.hideBottomSheet();
      moderationFormStore.clearFormStoreState();
    } else {
      setShowModerationModal(true);
    }
  };

  const openMessageOptions = (action, message) => {
    moderationFormStore.registerFormField(ModerationForm.ITEM_ID, 'string', message.id);
    setAction(action);
    bottomSheetStore.showBottomSheet(
      BOTTOM_SHEET_TEMPLATES.SCREEN_COMMON_PROFILE_OPTIONS,
      {
        onAction: () => onModerate(action, message.id),
        moderatorOptions: {
          item: message,
          actions: [action],
        },
      },
    );
  };

  const onHideContent = async () => {
    setShowModerationModal(false);
    bottomSheetStore.hideBottomSheet();
    await ModerationService.getInstance().hide('discussionMessage', commonId, moderationFormStore.getFormFieldsJson());
    moderationFormStore.clearFormStoreState();
  };

  const moderationModal = () => (
    <Modal
      visible={showModerationModal}
      transparent={true}
      animationType="slide"
      onBackdropPress={() => setShowModerationModal(false)}
      >
      <Hide title={`${action} Comment`}
        onCancel={() => setShowModerationModal(false)}
        onHideContent={() => onHideContent()}
        formStore={moderationFormStore}
      />
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeView}>
      {header()}
      <ScrollView style={{flex: 1, paddingBottom: 30}} ref={scrollRef}>
        <DiscussionMessagesList
          discussionId={discussionId}
          inputRef={inputRef}
          scrollViewRef={scrollRef}
          hasPermission={hasPermission}
          commonId={commonId}
          openMessageOptions={(action, message) => openMessageOptions(action, message)}
        />
      </ScrollView>
      {moderationModal()}

      {isMember ? (
        <KeyboardAvoidingView
          style={{
            position: 'absolute',
            bottom: 0,
            flex: 1,
            color: '#fbfdff',
          }}>
          <View style={styles.inputContainer}>
            <View
              style={[styles.input, {height: Math.max(35, inputHeight + 50)}]}>
              <TextInput
                ref={inputRef}
                editable={true}
                fontSize={15}
                multiline
                placeholder="What do you think?"
                onChangeText={(currText) => setInputText(currText)}
                onContentSizeChange={(event) => {
                  setInputHeight(event.nativeEvent.contentSize.height);
                }}
                style={{
                  flex: 1,
                  maxHeight: 120,
                  paddingVertical: 10,
                  marginHorizontal: 10,
                  height: Math.max(35, inputHeight + 32),
                }}
              />
              <TouchableOpacity
                onPress={sendMessageToDiscussion}
                style={{
                  paddingRight: 15,
                  justifyContent: 'center',
                }}>
                <Icon
                  name="send-message"
                  size={20}
                  color={
                    inputText && inputText.trim()
                      ? colors.mainBlue
                      : colors.grey3
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.input}>
          <Text style={{...styles.joinCommonText}}>
            Only members can send messages
          </Text>
        </View>
      )}

      <ImageView
        images={
          dataState.images ? dataState.images.map((x) => ({uri: x.value})) : []
        }
        imageIndex={imageGalleryIndex}
        visible={imageGalleryIndex > -1}
        onRequestClose={() => setImageGalleryIndex(-1)}
        // FooterComponent={ImageGalleryFooter}
      />
    </SafeAreaView>
  );
};

Discussions.propTypes = {
  rootStore: rootStorePropTypes.isRequired,
  navigation: object,
  route: shape({
    params: shape({
      commonId: string,
      discussionId: string,
      data: object,
    }),
  }),
};

const styles = StyleSheet.create({
  message: {
    marginVertical: 10,
    lineHeight: 24,
    color: colors.black,
    ...font.primary.regular,
    ...font.fontSize(2),
  },
  date: {
    color: colors.formPlaceholderColor,
    ...font.primary.regular,
    ...font.fontSize(2),
  },
  displayName: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.black,
  },
  title: {
    ...font.fontSize(3),
    ...font.primary.bold,
    color: colors.black,
    textAlign: 'center',
    // textAlignVertical: 'center',
    flex: 1,
    lineHeight: 20,
  },
  galleryImage: {
    marginRight: 15,
    width: 120,
    height: 250,
    borderRadius: 10,
    backgroundColor: colors.grey4,
  },
  safeView: {
    flex: 1,
    backgroundColor: colors.paleGrey,
  },
  imageGallery: {
    ...layout.flexRow,
    ...layout.flexStart,

    width: '100%',
  },
  avatar: {
    width: 35,
    height: 35,
    backgroundColor: colors.grey4,
    borderRadius: 17.5,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 10,
    backgroundColor: colors.mainBlue,
  },
  inputContainer: {
    flex: 1,
    height: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#fbfdff',
  },
  input: {
    // backgroundColor: colors.white,
    backgroundColor: '#fbfdff',
    borderTopColor: colors.grey4,
    borderTopWidth: 1,
    minHeight: 65,
    maxHeight: 140,
    width: width,
    flexDirection: 'row',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  textInput: {
    flex: 1,
    paddingTop: 0,
    marginBottom: Platform.OS === 'ios' ? 10 : 0,
    marginHorizontal: 10,
  },
  sendMessageIcon: {
    marginBottom: Platform.OS === 'ios' ? 10 : 0,
  },
  timeHeader: {
    textAlign: 'center',
    marginVertical: 3,
    color: colors.grey3,
    ...font.fontSize(2),
    ...font.primary.regular,
  },

  sheetTitle: {
    ...font.fontSize(4),
    ...font.primary.bold,
    color: colors.black,
    paddingVertical: 15,
    textAlign: 'center',
  },
  bottomSheet: {
    paddingBottom: 40,
  },
  modalStyle: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  sheetText: {
    ...font.fontSize(3),
    ...font.primary.bold,
    color: colors.black,
    marginLeft: 10,
  },
  sheetButton: {
    flexDirection: 'row',
    width: width,
    paddingHorizontal: 30,
    paddingVertical: 20,
    marginHorizontal: 20,
    justifyContent: 'flex-start',
  },
  adsText: {
    ...font.fontSize(2),
    textDecorationLine: 'underline',
    ...font.primary.regular,
    ...layout.marginLeftXS,
  },

  adRow: {
    alignItems: 'center',
    ...layout.flexRow,
    alignSelf: 'stretch',
    paddingVertical: sizeM,
  },
  joinCommonText: {
    ...text.textFieldplaceholder,
    width,
    textAlign: 'center',
    color: colors.greySubtitle,
    paddingTop: sizeS,
    paddingBottom: sizeXL,
    alignSelf: 'center',
  },
  emptyContainer: {
    flex: 0.8,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    ...font.fontSize(3),
    ...font.primary.bold,
    paddingVertical: 12,
  },
  emptyBody: {
    textAlign: 'center',
    ...font.fontSize(2),
    ...font.primary.regular,
  },
  headerContainer: {
    backgroundColor: colors.white,
    // flex: 1,
    paddingBottom: 0,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 5,
    shadowOpacity: 0.8,
    elevation: 5,
  },
  hyperLinkStyle: {
    textDecorationLine: 'underline',
    color: colors.mainBlue,
  },
});

export default inject('rootStore')(observer(Discussions));
