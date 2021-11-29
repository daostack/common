import auth from '@react-native-firebase/auth';
import {inject, observer} from 'mobx-react';
import React, {ReactElement, useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TextInput,
  TextInputContentSizeChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Icon from '~/Assets/iconfont/Icon';
import {db} from '~/Firebase';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import DiscussionMessagesList from '~/Screens/DisscussionMessages/DiscussionMessagesList';
import DiscussionService from '~/Services/DiscussionService';
import {colors} from '~/Theme';
import {RootStore} from '~/Types/store';
import {KEYBOARD_EVENTS} from '~/Util/constants/keyboard';
import Toast from '~/Util/Toast.js';
import {styles} from './styles';

const ANIMATION_DURATION = 500;
const INPUT_OFFSET = 50;
const INITIAL_TEXT_INPUT_VIEW_HEIGHT = 100;

interface Props {
  commonId: string;
  discussionId: string;
  rootStore: RootStore;
  isHeaderExpanded: boolean;
  fromNotificationItem: boolean;
  openMessageOptions: (message: string) => void;
}

const Chat = ({
  commonId,
  discussionId,
  fromNotificationItem,
  rootStore,
  isHeaderExpanded,
  openMessageOptions,
}: Props): ReactElement => {
  const commonStore = rootStore.commonStore;
  const discussionStore = rootStore.discussionStore;
  const authStore = rootStore.authStore;
  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;

  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

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
  const [inputText, setInputText] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [inputHeight, setInputHeight] = useState(0);

  const isMember =
    authStore.userInfo &&
    (currCommon ? authStore.isDaoMember(currCommon?.members) : false);

  useEffect(() => {
    let unsubscribeFromDiscussionMessages: FirestoreUnsubscribeFn | null = null;
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
    bottomSheetStore.showBottomSheet(
      BOTTOM_SHEET_TEMPLATES.LOGIN_SHEET_SCREEN,
      null,
    );
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
      inputRef.current?.clear();

      db.collection('discussionMessage')
        .doc()
        .set({
          text: message,
          createTime: new Date(),
          ownerId: currentUser.uid,
          commonId: commonId,
          discussionId: discussionId,
        })
        .then(async () => {
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

  const onChangeText = (currText: string) => setInputText(currText);

  const onContentSizeChange = (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
  ) => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  const hideDescription = () => {
    dataState!.isExpanded = false;
  };

  const showDescription = () => {
    dataState!.isExpanded = true;
  };
  const isEmptyMessage = () => !(inputText && inputText?.trim().length);

  const keyboardHeight = useSharedValue(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      KEYBOARD_EVENTS.keyboardWillShow,
      (event) => {
        if (
          event.endCoordinates.height > Number(event.startCoordinates?.height)
        ) {
          scrollRef.current?.scrollToEnd({animated: true});
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
      () => {
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

  const inputTranslateY = useDerivedValue(() => {
    const textInputCalc = isMember
      ? 100 +
        keyboardHeight.value +
        (inputHeight > INPUT_OFFSET ? inputHeight - INPUT_OFFSET : 0)
      : 0;
    return translationY.value + scrollViewHeight.value - textInputCalc;
  }, [keyboardHeight, inputHeight, isMember]);

  const rTextInputStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: inputTranslateY.value,
        },
      ],
    }),
    [],
  );

  function handleScrollViewOnLayout(event: LayoutChangeEvent) {
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
        <Animated.View style={[styles.inputContainer, rTextInputStyle]}>
          <KeyboardAvoidingView keyboardVerticalOffset={0}>
            <View
              style={{
                ...styles.inputWrapper,
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
        <Animated.View style={[styles.inputContainer, rTextInputStyle]}>
          <View style={styles.nonMemberContainer}>
            <Text style={{...styles.joinCommonText}}>
              Only members can send messages
            </Text>
          </View>
        </Animated.View>
      )}
    </Animated.ScrollView>
  );
};

export const DiscussionChat = inject('rootStore')(observer(Chat));
