import auth from '@react-native-firebase/auth';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {inject, observer} from 'mobx-react';
import {object, shape, string} from 'prop-types';
import React, {useEffect, useRef, useState} from 'react';
import Animated, {
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import * as ModerationForm from '~/Components/Forms/ModerationForm';
import {ACTIONS, TITLES} from '~/Components/Moderation/constants';
import ModerationFormStore from '~/FormStores/ModerationFormStore';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import DiscussionMessagesList from '~/Screens/DisscussionMessages/DiscussionMessagesList';
import DiscussionService from '~/Services/DiscussionService';
import ModerationService from '~/Services/ModerationService';
import {colors, font, layout, sizeM, sizeS, sizeXL, text} from '~/Theme';
import {rootStorePropTypes} from '~/Types/propTypes';
import Toast from '~/Util/Toast.js';
import {db} from '../../Firebase';
const {height, width} = Dimensions.get('window');

const KeyboardView = Animated.createAnimatedComponent(KeyboardAvoidingView);

const DiscussionChat = ({
  navigation,
  commonId,
  discussionId,
  fromNotificationItem,
  rootStore,
}) => {
  const commonStore = rootStore.commonStore;
  const discussionStore = rootStore.discussionStore;
  const authStore = rootStore.authStore;
  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const currentUser = auth().currentUser;

  const dataState = discussionStore.getDiscussionById(discussionId);

  if (!commonId && dataState) {
    commonId = dataState.commonId;
  }

  const currCommon = commonId ? commonStore.getCommonById(commonId) : null;
  const hasPermission = authStore.getPermission(
    commonId,
    authStore?.userInfo?.uid,
  );
  const [inputText, setInputText] = useState(null);
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
      BOTTOM_SHEET_TEMPLATES.SCREEN_COMMON_PROFILE_OPTIONS,
      {
        onAction: (actionType) => onModerate(actionType, message.id),
        hasPermission,
        moderatorOptions: {
          item: message,
        },
      },
    );
  };

  const onChangeText = (currText) => setInputText(currText);

  const onContentSizeChange = (event) => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  const hideDescription = () => {
    dataState.isExpanded = false;
  };

  const showDescription = () => {
    dataState.isExpanded = true;
  };
  const isEmptyMessage = () => !(inputText && inputText.trim().length);

  const keyboardHeight = useSharedValue(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        console.log('-----keyboardDidShowListener', event);
        keyboardHeight.value = withTiming(
          Math.abs(event.endCoordinates.height - event.startCoordinates.height),
        );
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      (event) => {
        console.log('-----event', event);
        keyboardHeight.value = withTiming(0);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const translationY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event, context) => {
    translationY.value = event.contentOffset.y;
  });

  const rTextInputStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: translationY.value - keyboardHeight.value + 200, // + height / 2 + 50 - keyboardHeight.value,
        },
      ],
    }),
    [keyboardHeight],
  );

  return (
    <KeyboardAvoidingView
      style={[
        {
          flex: 1,
          color: '#fbfdff',
        },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={0}>
      <Animated.ScrollView
        style={styles.scrollView}
        ref={scrollRef}
        scrollEventThrottle={16}
        onScroll={scrollHandler}>
        <DiscussionMessagesList
          discussionId={discussionId}
          inputRef={inputRef}
          scrollViewRef={scrollRef}
          hasPermission={hasPermission}
          commonId={commonId}
          openMessageOptions={(message) => openMessageOptions(message)}
          isMember={isMember}
        />
        <Animated.View
          style={[{position: 'absolute', top: 0}, rTextInputStyle]}>
          {isMember ? (
            // <KeyboardAvoidingView
            //   style={[
            //     {
            //       color: '#fbfdff',
            //     },
            //   ]}
            //   // behavior={Platform.OS === 'ios' ? 'padding' : null}
            //   keyboardVerticalOffset={0}>
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
                onChangeText={onChangeText}
                onContentSizeChange={onContentSizeChange}
                onBlur={showDescription}
                onFocus={hideDescription}
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
          ) : (
            <View style={{paddingTop: 10}}>
              <Text style={{...styles.joinCommonText}}>
                Only members can send messages
              </Text>
            </View>
          )}
        </Animated.View>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
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
  scrollView: {
    flex: 1,
    paddingBottom: 30,
    backgroundColor: colors.paleLilacTwo,
  },
});

export default inject('rootStore')(observer(DiscussionChat));
