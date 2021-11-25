import auth from '@react-native-firebase/auth';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {inject, observer} from 'mobx-react';
import React, {useEffect, useRef, useState} from 'react';
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
import Animated, {
  Easing,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Icon from '~/Assets/iconfont/Icon';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import DiscussionMessagesList from '~/Screens/DisscussionMessages/DiscussionMessagesList';
import DiscussionService from '~/Services/DiscussionService';
import {colors, sizeS, sizeXL, text} from '~/Theme';
import Toast from '~/Util/Toast.js';
import {KEYBOARD_EVENTS} from '~/Util/constants/keyboard';
import {db} from '../../Firebase';

const {width} = Dimensions.get('window');
const ANIMATION_DURATION = 500;
const INPUT_OFFSET = 50;
const INITIAL_TEXT_INPUT_VIEW_HEIGHT = 100;

const DiscussionChat = ({
  navigation,
  commonId,
  discussionId,
  fromNotificationItem,
  rootStore,
  isHeaderExpanded,
  openMessageOptions,
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

  const isMember =
    authStore.userInfo &&
    (currCommon ? authStore.isDaoMember(currCommon?.members) : false);

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
      KEYBOARD_EVENTS.keyboardWillShow,
      (event) => {
        if (event.endCoordinates.height > event.startCoordinates.height) {
          scrollRef.current.scrollToEnd({animated: true});
          keyboardHeight.value = withTiming(event.endCoordinates.height - 35, {
            duration: ANIMATION_DURATION,
            easing: Easing.out(Easing.exp),
          });
        } else {
          keyboardHeight.value = withTiming(0, {
            duration: ANIMATION_DURATION,
            easing: Easing.out(Easing.exp),
          });
        }
      },
    );

    const keyboardWillHideListener = Keyboard.addListener(
      KEYBOARD_EVENTS.keyboardWillHide,
      (event) => {
        keyboardHeight.value = withTiming(0, {
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.exp),
        });
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const translationY = useSharedValue(0);
  const scrollViewHeight = useSharedValue(0);
  const scrollViewContentSize = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        translationY.value = event.contentOffset.y;
        scrollViewHeight.value = event.layoutMeasurement.height;
        scrollViewContentSize.value = event.contentSize.height;
      },
    },
    [isHeaderExpanded],
  );

  const rTextInputStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY:
            translationY.value +
            scrollViewHeight.value -
            INITIAL_TEXT_INPUT_VIEW_HEIGHT -
            keyboardHeight.value -
            (inputHeight > INPUT_OFFSET ? inputHeight - INPUT_OFFSET : 0),
        },
      ],
    }),
    [keyboardHeight, inputHeight],
  );

  function handleScrollViewOnLayout(event) {
    'worklet';
    const {height: scrollLayoutHeight} = event.nativeEvent.layout;
    scrollViewHeight.value = scrollLayoutHeight;
  }

  return (
    <Animated.ScrollView
      style={styles.scrollView}
      ref={scrollRef}
      scrollEventThrottle={16}
      onLayout={handleScrollViewOnLayout}
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
      {isMember ? (
        <Animated.View style={[styles.textInputContainer, rTextInputStyle]}>
          <KeyboardAvoidingView keyboardVerticalOffset={0}>
            <View
              style={{
                ...styles.inputContainer,
                height: Math.max(
                  INITIAL_TEXT_INPUT_VIEW_HEIGHT,
                  inputHeight + INPUT_OFFSET,
                ),
              }}>
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
          </KeyboardAvoidingView>
        </Animated.View>
      ) : (
        <View style={styles.nonMemberContainer}>
          <Text style={{...styles.joinCommonText}}>
            Only members can send messages
          </Text>
        </View>
      )}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingBottom: 30,
    backgroundColor: colors.paleLilacTwo,
  },
  inputContainer: {
    position: 'absolute',
    top: 0,
  },
  inputWrapper: {
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
  joinCommonText: {
    ...text.textFieldplaceholder,
    width,
    textAlign: 'center',
    color: colors.greySubtitle,
    paddingTop: sizeS,
    paddingBottom: sizeXL,
    alignSelf: 'center',
  },
  nonMemberContainer: {
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
  },
});

export default inject('rootStore')(observer(DiscussionChat));
