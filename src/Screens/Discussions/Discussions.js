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
import DiscussionService from '~/Services/DiscussionService';
import ModerationFormStore from '~/FormStores/ModerationFormStore';
import * as ModerationForm from '~/Components/Forms/ModerationForm';
import ModerationService from '~/Services/ModerationService';
import ModerationActionSuccessModal from '~/Components/Moderation/ModerationActionSuccessModal';
import ModerationModal from '~/Components/Moderation/ModerationModal';
import {TITLES, ACTIONS} from '~/Components/Moderation/constants';
import Loader from '~/Components/Loader';
const {width} = Dimensions.get('window');

const Discussions = ({
  navigation,
  route: {
    params: {commonId, discussionId, fromNotificationItem},
  },
  rootStore,
}) => {
  const redirectBack = !commonId && fromNotificationItem;
  const commonStore = rootStore.commonStore;
  const discussionStore = rootStore.discussionStore;
  const authStore = rootStore.authStore;
  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;
  const userStore = rootStore.userStore;

  console.log('----discussionId', discussionId, commonId);

  const inputRef = useRef(null);

  const currentUser = auth().currentUser;

  const dataState = discussionStore.getDiscussionById(discussionId);

  if (!commonId && dataState) {
    commonId = dataState.commonId;
  }

  const user = dataState?.ownerId
    ? userStore.getUserById(dataState?.ownerId)
    : null;

  console.log('---commonId', commonId, dataState?.commonId);
  const currCommon = commonId ? commonStore.getCommonById(commonId) : null;
  const hasPermission = authStore.getPermission(
    commonId,
    authStore?.userInfo?.uid,
  );
  const [inputText, setInputText] = useState(null);
  const [imageGalleryIndex, setImageGalleryIndex] = useState(-1);
  const [isSending, setIsSending] = useState(false);
  const [inputHeight, setInputHeight] = useState(false);
  const [moderationFormStore] = useState(new ModerationFormStore());
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [showModerationSuccessModal, setShowModerationSuccessModal] =
    useState(false);
  const [action, setAction] = useState(ACTIONS.report);

  const isMember =
    authStore.userInfo &&
    (currCommon ? authStore.isDaoMember(currCommon?.members) : false);

  useEffect(() => {}, [commonId, discussionId, currentUser]);

  useEffect(() => {
    let unsubscribeFromDiscussionMessages = null;
    if (fromNotificationItem) {
      unsubscribeFromDiscussionMessages =
        rootStore.discussionMessageStore.subscribeToProposalDiscussionMessages(
          discussionId,
        );
    }

    return () => {
      unsubscribeFromDiscussionMessages && unsubscribeFromDiscussionMessages();
    };
  }, [discussionId]);

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
    if (!isEmptyMessage()) {
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
          await DiscussionService.updateDiscussionLastMessage(
            discussionId,
            currentUser.uid,
          );
        })
        .catch((error) => {
          Toast.error(error);
        })
        .finally(() => {
          setIsSending(false);
        });
    } else {
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

  const navigateBack = () =>
    fromNotificationItem && !redirectBack
      ? navigation.replace('CommonProfile', {commonId})
      : navigation.pop();

  const header = () => (
    // <SafeAreaView flex={1}>
    <>
      <NavigationBar
        statusBar={{hidden: true}}
        style={{
          height: 60,
        }}
        title={{
          title: dataState.title,
          style: {
            ...text.h2Black,
            maxWidth: '70%',
            whiteSpace: 'wrap',
          },
          ellipsizeMode: 'tail',
        }}
        leftButton={
          <TouchableOpacity
            style={{justifyContent: 'center'}}
            onPress={() => navigateBack()}>
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
      <View
        style={{
          overflow: 'hidden',
          paddingBottom: 5,
          maxHeight: '50%',
          backgroundColor: colors.paleLilacTwo,
        }}>
        <View style={styles.headerContainer}>
          {dataState.isExpanded ? (
            <View
              style={{
                paddingTop: 20,
                paddingHorizontal: 20,
                shadowColor: 'rgba(0, 0, 0, 0.12)',
              }}>
              <ScrollView style={{maxHeight: '90%'}}>
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
                  dataState.isExpanded = !dataState.isExpanded;
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
                  dataState.isExpanded = !dataState.isExpanded;
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

  /**
   * For discussionMessages
   * @param  {[type]} actionType [description]
   * @param  {[type]} messageId  [description]
   * @return {[type]}            [description]
   */
  const onModerate = async (actionType, messageId) => {
    setAction(actionType);
    if (messageId) {
      moderationFormStore.registerFormField(
        ModerationForm.ITEM_ID,
        'string',
        messageId,
      );
    }
    bottomSheetStore.hideBottomSheet();

    const resp = await ModerationService.onModerate(
      actionType,
      messageId,
      commonId,
      TITLES.discussionMessage,
    );

    resp === ACTIONS.report
      ? setShowModerationModal(true)
      : resp && setShowModerationSuccessModal(true);
  };

  const openMessageOptions = (message, itemType) => {
    bottomSheetStore.showBottomSheet(
      BOTTOM_SHEET_TEMPLATES.SCREEN_COMMON_PROFILE_OPTIONS(),
      {
        onAction: (actionType) => onModerate(actionType, message.id),
        hasPermission,
        moderatorOptions: {
          item: message,
        },
      },
    );
  };

  const onReportContent = async () => {
    setShowModerationModal(false);
    Toast.loading('Reporting content...');
    bottomSheetStore.hideBottomSheet();
    await ModerationService.report(
      TITLES.discussionMessage,
      moderationFormStore.getFormFieldsJson(),
    );
    Toast.hide();
    Toast.success('Done');
    setShowModerationSuccessModal(true);
    moderationFormStore.clearFormStoreState();
  };

  if (!dataState) {
    return (
      <View style={{...styles.safeView, ...layout.content}}>
        <Loader />
      </View>
    );
  }

  const isEmptyMessage = () => !(inputText && inputText.trim().length);

  return (
    <SafeAreaView style={styles.safeView}>
      {header()}
      <ModerationModal
        title={TITLES.comment}
        visible={showModerationModal}
        setShowModerationModal={() => setShowModerationModal(false)}
        moderationFormStore={moderationFormStore}
        onReportContent={() => onReportContent()}
        hasPermission={hasPermission}
      />
      <ModerationActionSuccessModal
        type={TITLES.comment.toLowerCase()}
        visible={showModerationSuccessModal}
        setShowModerationSuccessModal={() =>
          setShowModerationSuccessModal(false)
        }
        action={action}
      />
      <DiscussionMessagesList
        discussionId={discussionId}
        hasPermission={hasPermission}
        commonId={commonId}
        openMessageOptions={(message) => openMessageOptions(message)}
        isMember={isMember}
        inputHeight={inputHeight + 50}
        isSending={isSending}
      />

      {isMember ? (
        <KeyboardAvoidingView
          style={{
            position: 'absolute',
            bottom: 0,
            flex: 1,
            color: '#fbfdff',
          }}
          keyboardVerticalOffset={0}>
          <View
            style={{
              ...styles.inputContainer,
              height: Math.max(100, inputHeight + 50),
            }}>
            {/* should be added in better discussion batch 3
            <TouchableOpacity
              onPress={() => {}}
              style={{
                justifyContent: 'center',
              }}>
              <Icon name="add-24" size={30} color={colors.mainBlue} />
            </TouchableOpacity>*/}
            <TextInput
              ref={inputRef}
              editable={true}
              fontSize={15}
              multiline
              placeholder="What do you think?"
              placeholderTextColor={colors.grey3}
              onChangeText={(currText) => setInputText(currText)}
              onContentSizeChange={(event) => {
                setInputHeight(event.nativeEvent.contentSize.height);
              }}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={sendMessageToDiscussion}
              style={{
                justifyContent: 'center',
              }}
              disabled={isEmptyMessage()}>
              <Icon
                name="send-message"
                size={25}
                color={isEmptyMessage() ? colors.grey3 : colors.mainBlue}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={{paddingTop: 10}}>
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
  inputContainer: {
    width,
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: colors.white,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  input: {
    backgroundColor: colors.paleLilacTwo,
    borderTopColor: colors.grey4,
    borderTopWidth: 1,
    width: '75%',
    flexDirection: 'row',
    borderRadius: 40,
    textAlignVertical: 'center',
    paddingTop: Platform.OS === 'ios' ? 15 : 10,
    paddingBottom: Platform.OS === 'ios' ? 15 : 10,
    paddingHorizontal: 15,
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
