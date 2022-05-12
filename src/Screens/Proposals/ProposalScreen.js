import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {
  LayoutAnimation,
  Dimensions,
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  Animated,
  Modal,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {text, layout, colors, sizeM, sizeS, sizeXS, font} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import {TabView} from 'react-native-tab-view';
import ProposalData from './ProposalData';
import DiscussionMessagesList from '~/Screens/DisscussionMessages/DiscussionMessagesList';
import Toast from '~/Util/Toast';
import BottomSheetModal from '~/Components/BottomSheetModal';
import ProposalService, {
  PROPOSAL_STAGE,
  PROPOSAL_STAGES_ACTIVE,
} from '~/Services/ProposalService';
import {UserAvatar} from '~/Components';
import {PROPOSAL_TYPE} from '~/Config';
import {inject, observer} from 'mobx-react';
import TabBarRenderer from '~/Components/TabView/TabBarRenderer';
import ProposalCardHeader from '~/Components/Proposals/ProposalCardHeader';
import {db} from '~/Firebase';
import {string, object, shape, func} from 'prop-types';
import logger from '~/Services/Logger';
import {LAYOUT_ANIMATION_CONFIG_SLOW} from '~/Util';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import {PROPOSAL_PAYMENT_STATE} from '~/Util/constants';
import DebtWarningProposalNote from './components/DebtWarningProposalNote';
import DebtErrorProposalNote from './components/DebtErrorProposalNote';
import ModalDebtProposalWarning from './components/ModalDebtProposalWarning';
import ModalDebtProposalError from './components/ModalDebtProposalError';
import ModalDebtProposalInsufficient from './components/ModalDebtProposalInsufficient';
import ModalConversion from '~/Components/Commons/ModalConversion';
import {isIsraelLocale} from '~/Util/locale';
import {rootStorePropTypes} from '~/Types/propTypes';
import ModerationFormStore from '~/Stores/FormStores/ModerationFormStore';
import * as ModerationForm from '~/Components/Forms/ModerationForm';
import ModerationService from '~/Services/ModerationService';
import ModerationActionSuccessModal from '~/Components/Moderation/ModerationActionSuccessModal';
import ModerationModal from '~/Components/Moderation/ModerationModal';
import {TITLES} from '~/Components/Moderation/constants';
import {copilot, walkthroughable, CopilotStep} from 'react-native-copilot';
import {TooltipComponent} from './components/ModalTooltip';
import {TOOLTIP_PROPOSAL_SEEN, TOOLTIP_PROPOSAL} from '~/Util/constants';
import {CurrencySymbols} from '~/Util/locale';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ModalProposalApproval from '~/Components/Modals/ModalProposalApproval';
import ModalProposalRejected from '~/Components/Modals/ModalProposalRejected';
import {EventTypeState} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {
  VOTE_COLORS_BY_STATUSES,
  VOTE_ICON_BY_STATUSES,
  VOTE_MESSAGES,
  VOTE_STATUSES,
} from '~/Util/constants/votes';
import {ModalVote} from './components/ModalVote';
import {VoteButton} from './components/VoteButton';

const CopilotView = walkthroughable(View);
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ProposalScreen = ({
  navigation,
  route: {
    params: {
      commonId,
      proposalId,
      tabIndex = 0,
      hasPermission,
      fromNotificationItem,
      eventType,
    },
  },
  rootStore,
  start, // copilot modal tooltip start
}) => {
  const insets = useSafeAreaInsets();
  const userStore = rootStore.userStore;
  const discussionMessageStore = rootStore.discussionMessageStore;
  const commonStore = rootStore.commonStore;
  const proposalStore = rootStore.proposalStore;
  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;
  const authStore = rootStore.authStore;
  const {userInfo, isDaoMember} = authStore;
  const currentUserPhotoUrl = userInfo?.photoURL;

  const [votingProcessState, setVotingProcessState] = useState({
    inProgress: false,
    error: false,
  });
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [inputHeight, setInputHeight] = useState(48);
  const [
    showBottomVotingButtonsContainer,
    setShowBottomVotingButtonsContainer,
  ] = useState(false);
  const [debtModalVisible, setDebtModalVisible] = useState(false);
  const [debtErrorModalVisible, setDebtErrorModalVisible] = useState(false);
  const [
    debtInsufficientModalVisible,
    setDebtInsufficientModalVisible,
  ] = useState(false);
  const [modalConversionVisible, setModalConversionVisible] = useState(false);
  const [moderationFormStore] = useState(new ModerationFormStore());
  const [action, setAction] = useState('Report');
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [showModerationSuccessModal, setShowModerationSuccessModal] = useState(
    false,
  );
  const [modalSuccessVisible, setModalSuccessVisible] = useState(
    fromNotificationItem && eventType === EventTypeState.fundingRequestAccepted,
  );
  const [modalRejectedVisible, setModalRejectedVisible] = useState(
    fromNotificationItem && eventType === EventTypeState.fundingRequestRejected,
  );

  const actualInputHeight = inputHeight + 50 + insets.bottom;

  // Sticky Tab Bar
  const [showStickyTabBar, setShowStickyTabBar] = useState(false);
  const stickyTabBarRef = useRef(null);
  const originTabBarRef = useRef(null);

  const [stickyTabBarState] = useState({animation: new Animated.Value(0)});

  // Top voting buttons ref
  const topVotingButtonsRef = useRef(null);

  const scrollViewRef = useRef(null);

  // Values for vote param required from the blockchain
  let currTabViewScroll = 0;

  useEffect(() => {
    const unsubscribeFromProposalDiscussionMessages = discussionMessageStore.subscribeToProposalDiscussionMessages(
      proposalId,
    );

    let unsubscribeFromProposalById = proposalStore.subscribeToProposalById(
      proposalId,
    );

    return () => {
      unsubscribeFromProposalDiscussionMessages &&
        unsubscribeFromProposalDiscussionMessages();

      unsubscribeFromProposalById && unsubscribeFromProposalById();
    };
  }, [proposalId]);

  const proposalInfo = proposalStore.getProposalById(proposalId);

  let currentUserVote;
  const filteredVotes = proposalInfo.votes.filter(
    (item) => item.voterId === userInfo?.uid,
  );
  if (filteredVotes.length !== 0) {
    currentUserVote = filteredVotes[0];
  }
  const userVoted = currentUserVote
    ? Object.values(currentUserVote).length !== 0
    : 0;

  useEffect(() => {
    const asyncData = async () => {
      try {
        const value = await AsyncStorage.getItem(TOOLTIP_PROPOSAL);
        if (value === null && !userVoted) {
          await AsyncStorage.setItem(
            TOOLTIP_PROPOSAL,
            TOOLTIP_PROPOSAL_SEEN.true,
          );
          start();
        }
      } catch (error) {
        logger.log(error);
      }
    };

    const unsubscribe = navigation.addListener('transitionEnd', (e) => {
      if (proposalInfo.state === PROPOSAL_STAGE.countdown) {
        asyncData();
      }
    });

    return unsubscribe;
  }, [navigation]);

  let viewerPermission = '';
  if (proposalInfo) {
    viewerPermission = rootStore.authStore.getPermission(
      proposalInfo?.id,
      auth()?.currentUser?.uid,
    );
  }

  const proposalCommon = proposalInfo?.commonId
    ? commonStore.getCommonById(proposalInfo.commonId)
    : null;
  const proposedUser = proposalInfo
    ? userStore.getUserById(proposalInfo.proposerId)
    : null;

  const showDebtInfo =
    proposalInfo?.isFundingRequest &&
    proposalInfo.isCountdown &&
    proposalInfo.fundingRequest.amount > 0;

  const showPaymentStatus =
    proposalInfo?.paymentState === PROPOSAL_PAYMENT_STATE.PENDING ||
    proposalInfo?.paymentState === PROPOSAL_PAYMENT_STATE.NOT_ATTEMPTED ||
    proposalInfo?.paymentState === PROPOSAL_PAYMENT_STATE.FAILED;

  const isMember = userInfo && isDaoMember(proposalCommon?.members || []);
  const isProposer = proposalInfo ? authStore.isProposer(proposalInfo) : false;

  const renderVoting =
    proposalInfo &&
    PROPOSAL_STAGES_ACTIVE.includes(proposalInfo?.state) &&
    isMember &&
    !proposalInfo.votes.some((vote) => vote.voterId === userInfo.uid);

  useEffect(() => {
    if (proposalInfo?.type === PROPOSAL_TYPE.Join) {
      navigation.setParams({
        title: 'Request to join',
        subtitle: proposalCommon?.name,
      });
    } else {
      navigation.setParams({
        title: proposalCommon?.name,
      });
    }
  }, [proposalId, votingProcessState]);

  const [userVote, setUserVote] = useState(
    currentUserVote?.voteId && {
      voteOutcome: currentUserVote.voteOutcome,
    },
  );

  const [voteType, setVoteType] = useState(false);
  const [index, setIndex] = useState(tabIndex);
  const [routes] = useState([
    {
      index: 0,
      key: 'info',
      icon: 'proposal',
      iconSelected: 'proposal-selected',
    },
    {
      index: 1,
      key: 'discussions',
      icon: 'discussion',
      iconSelected: 'discussion-selected',
    },
  ]);

  useEffect(() => {
    setShowStickyTabBar(index !== 0);
  }, [index]);

  const [inputText, setInputText] = useState(null);

  const inputRef = useRef();

  const renderTabBar = (currProps) =>
    proposalInfo && (
      <View style={{paddingBottom: 5}}>
        <TabBarRenderer
          originRef={originTabBarRef}
          jumpTo={originTabBarRef.current?.props?.jumpTo}
          indexChange={setIndex}
          {...currProps}
        />
      </View>
    );

  const messageInput = () => {
    const sendMessageToDiscussion = async () => {
      if (isSending || !userInfo?.uid) {
        return;
      }
      setIsSending(true);
      const message = inputText;
      if (!isEmptyMessage()) {
        inputRef.current.clear();

        db.collection('discussionMessage')
          .doc()
          .set({
            text: message,
            createTime: new Date(),
            ownerId: userInfo.uid,
            commonId: proposalInfo.commonId,
            ownerName: userInfo.displayName,
            ownerAvatar: userInfo.photoURL,
            discussionId: proposalId || proposalInfo.id,
          })
          .then(() => {
            Keyboard.dismiss();

            setIsSending(false);
            setInputText(null);
          })
          .catch((error) => {
            Toast.error(error);
            setIsSending(false);
          });
      } else {
        setIsSending(false);
      }
    };

    let viewStyle = styles.input;
    if (isMember) {
      viewStyle = {...viewStyle, borderBottomWidth: 0};
    }

    const isEmptyMessage = () => !(inputText && inputText.trim().length);

    return isMember || isProposer ? (
      <KeyboardAvoidingView
        style={{
          position: 'absolute',
          bottom: 0,
          flex: 1,
          color: '#fbfdff',
        }}>
        <View
          style={{
            ...styles.inputContainer,
            height: actualInputHeight,
          }}>
          <TextInput
            ref={inputRef}
            editable={true}
            fontSize={15}
            multiline
            placeholder="What do you think?"
            placeholderTextColor={colors.grey3}
            onChangeText={(currText) => setInputText(currText)}
            onContentSizeChange={(event) => {
              setInputHeight(event.nativeEvent.contentSize.height + 30); // 15 * 2 - vertical padding
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
      <View style={viewStyle}>
        <Text style={{...styles.joinCommonText}}>
          Only members or proposal creators can send messages
        </Text>
      </View>
    );
  };

  const openApprovalSheet = (voteOutcome) => {
    setVoteType(voteOutcome);
    setVoteModalVisible(true);
  };

  const viewUserProfile = () => {
    navigation.navigate('Profile', {
      userId: proposedUser.uid,
    });
  };

  const onVote = async (voteOutcome) => {
    setVotingProcessState({
      inProgress: true,
      error: false,
      processingVoteType: voteOutcome,
    });

    try {
      const voteData = {
        outcome: voteOutcome,
        proposalId: proposalId || proposalInfo.id,
      };

      const createVoteResponse = await ProposalService.createVote(voteData);
      if (createVoteResponse.status === 200) {
        closeVoteModal();
        // wait till modal hide for smooth ui
        setTimeout(() => {
          setVotingProcessState({inProgress: false, error: false});
        }, 1000);
        Toast.done(VOTE_MESSAGES[voteOutcome]);
        setUserVote({voteOutcome});
      } else {
        setVotingProcessState({
          inProgress: false,
          error: true,
          processingVoteType: null,
        });
        logger.log(createVoteResponse.status);
        Toast.error(`Status code ${createVoteResponse.status}`);
      }
    } catch (err) {
      setVotingProcessState({
        inProgress: false,
        error: err,
        processingVoteType: null,
      });
    }
  };

  const renderStickyBottomContent = () => {
    if (userVote?.voteOutcome) {
      let message = VOTE_MESSAGES[userVote.voteOutcome];
      let iconName = VOTE_ICON_BY_STATUSES[userVote.voteOutcome];
      let color = VOTE_COLORS_BY_STATUSES[userVote.voteOutcome];

      return (
        <View style={{...layout.content, ...layout.flexRow, padding: 0}}>
          <Icon
            name={iconName}
            color={color}
            size={12}
            style={layout.marginRightS}
          />
          <Text style={{...styles.votedByYouText, color}}>{message}</Text>
        </View>
      );
    }
  };

  const paymentStatusModal = () => {
    bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.PAYMENT_STATUS, {
      proposerName: proposedUser?.displayName,
      paymentState: proposalInfo?.paymentState,
    });
  };

  const renderDebWarningIfNeeded = () => {
    if (showDebtInfo) {
      return amount <= getAvailableFunds() ? (
        <DebtWarningProposalNote onPress={() => openDebtModal()} />
      ) : (
        <DebtErrorProposalNote onPress={() => openDebtErrorModal()} />
      );
    }
  };

  const initialLayout = {width: screenWidth};

  const headerContainerStyle = {
    ...layout.content,
    ...{paddingBottom: 0},
    ...(proposalInfo?.type === PROPOSAL_TYPE.FundingRequest && {
      ...layout.flexStart,
    }),
  };

  const amount = proposalInfo?.funding / 100;

  const onSetIndex = (item) => {
    LayoutAnimation.configureNext(LAYOUT_ANIMATION_CONFIG_SLOW);
    const isDiscussionTab = item === 1;
    setIsHeaderHidden(isDiscussionTab);

    Animated.timing(stickyTabBarState.animation, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start(() => {});

    setIndex(item);
  };

  const onTabViewScroll = (e) => {
    const currScrollY = e.nativeEvent.contentOffset.y;
    if (currScrollY > currTabViewScroll) {
      if (!isHeaderHidden) {
        LayoutAnimation.configureNext(LAYOUT_ANIMATION_CONFIG_SLOW);
        setIsHeaderHidden(true);
      }
    } else if (currScrollY < 1) {
      if (isHeaderHidden) {
        LayoutAnimation.configureNext(LAYOUT_ANIMATION_CONFIG_SLOW);
        setIsHeaderHidden(false);
      }
    }
  };

  const slideUp = {
    transform: [
      {
        translateY: stickyTabBarState.animation.interpolate({
          inputRange: [0.01, 1],
          outputRange: [0, 80],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  const getAvailableFunds = () => (proposalCommon?.balance || 0) / 100;

  const getAvailableFundsText = () => {
    const availableFunds = getAvailableFunds();

    return Math.abs(availableFunds) > 999
      ? Math.sign(availableFunds) *
          (Math.abs(availableFunds) / 1000).toFixed(1) +
          'K'
      : Math.sign(availableFunds) * Math.abs(availableFunds);
  };

  const [voteModalVisible, setVoteModalVisible] = useState(false);

  const closeVoteModal = () => {
    setVoteModalVisible(false);
  };

  const closeDebtModal = () => {
    setDebtModalVisible(false);
  };

  const openDebtModal = () => {
    setDebtModalVisible(true);
  };

  const closeDebtErrorModal = () => {
    setDebtErrorModalVisible(false);
  };

  const openDebtErrorModal = () => {
    setDebtErrorModalVisible(true);
  };

  const openDebtInsufficientModal = () => {
    if (proposalInfo?.state === PROPOSAL_STAGE.passedInsufficientBalance) {
      setDebtInsufficientModalVisible(true);
    }
  };

  const closeDebtInsufficientModal = () => {
    setDebtInsufficientModalVisible(false);
  };

  /**
   * For discussionMessages
   * @param  {[type]} actionType [description]
   * @param  {[type]} messageId  [description]
   * @return {[type]}            [description]
   */
  const onModerate = async (actionType, messageId) => {
    setAction(actionType);
    bottomSheetStore.hideBottomSheet();
    switch (actionType) {
      case 'Show':
        Toast.loading('Loading...');
        await ModerationService.show(
          messageId,
          proposalInfo.commonId,
          'discussionMessage',
        );
        Toast.hide();
        Toast.success('Done');
        setShowModerationSuccessModal(true);
        break;
      case 'Hide':
        Toast.loading('Loading...');
        await ModerationService.hide(
          messageId,
          'discussionMessage',
          proposalInfo.commonId,
        );
        Toast.hide();
        Toast.success('Done');
        setShowModerationSuccessModal(true);
        break;
      default:
        setShowModerationModal(true);
        break;
    }
  };

  const openMessageOptions = (message, itemType) => {
    if (message) {
      moderationFormStore.registerFormField(
        ModerationForm.ITEM_ID,
        'string',
        message.id,
      );
    }
    bottomSheetStore.showBottomSheet(
      BOTTOM_SHEET_TEMPLATES.SCREEN_COMMON_PROFILE_OPTIONS(),
      {
        onAction: (actionType) => onModerate(actionType, message.id),
        hasPermission,
        hasShare: true,
        moderatorOptions: {
          item: message,
        },
      },
    );
  };

  const onReportContent = async () => {
    setShowModerationModal(false);
    Toast.loading('Loading...');
    bottomSheetStore.hideBottomSheet();
    try {
      await ModerationService.report(
        TITLES.discussionMessage,
        moderationFormStore.getFormFieldsJson(),
      );
      Toast.hide();
      Toast.success('Done');
      setShowModerationSuccessModal(true);
    } catch (error) {
      Toast.hide();
      Toast.error('Something went wrong');
    }

    moderationFormStore.clearFormStoreState();
  };

  const stickyTabBarStyle = {
    position: 'absolute',
    top: -80,
    width: '100%',
    paddingBottom: 5,
    zIndex: 1,
  };

  const {
    approvedCount,
    abstainedCount,
    rejectedCount,
    allVoteCount,
  } = proposalStore.getVotesCounts(proposalInfo?.votes);

  const isDisabledVoteButton = useMemo(
    () => proposalInfo?.state !== PROPOSAL_STAGE.countdown,
    [proposalInfo?.state],
  );

  const VoteContainer = useCallback(
    () => (
      <CopilotStep order={1} name="info">
        <CopilotView
          style={{
            ...layout.content,
            paddingTop: 0,
            width: '100%',
            paddingHorizontal: 0,
          }}>
          <Text style={styles.voteContainerTitle}>What's your vote?</Text>
          <View style={styles.voteContainer}>
            <VoteButton
              onPress={(e) => openApprovalSheet(VOTE_STATUSES.APPROVED)}
              voteType={VOTE_STATUSES.APPROVED}
              votesFor={approvedCount}
              votesCount={allVoteCount}
              voteOutcome={currentUserVote?.voteOutcome}
              userInfo={userInfo}
              disabled={isDisabledVoteButton}
            />
            <VoteButton
              onPress={(e) => openApprovalSheet(VOTE_STATUSES.ABSTAINED)}
              voteType={VOTE_STATUSES.ABSTAINED}
              votesFor={abstainedCount}
              votesCount={allVoteCount}
              voteOutcome={currentUserVote?.voteOutcome}
              userInfo={userInfo}
              disabled={isDisabledVoteButton}
            />
            <VoteButton
              onPress={(e) => openApprovalSheet(VOTE_STATUSES.REJECTED)}
              voteType={VOTE_STATUSES.REJECTED}
              votesFor={rejectedCount}
              votesCount={allVoteCount}
              voteOutcome={currentUserVote?.voteOutcome}
              userInfo={userInfo}
              disabled={isDisabledVoteButton}
            />
          </View>

          <TouchableOpacity
            style={styles.voteCountButton}
            onPress={() => {
              navigation.navigate(NAVIGATION_SCREENS.VOTES_SCREEN, {
                proposalId: proposalId || proposalInfo.id,
                commonName: proposalCommon.name,
              });
            }}>
            <Text style={styles.voteCountButtonText}>
              {allVoteCount}/{proposalCommon.members?.length || 1} votes
            </Text>
            <Icon name="right-arrow" size={16} />
          </TouchableOpacity>
        </CopilotView>
      </CopilotStep>
    ),
    [
      userInfo,
      approvedCount,
      rejectedCount,
      abstainedCount,
      allVoteCount,
      currentUserVote,
    ],
  );

  const ProposalCardHeaderProps = useMemo(() => {
    if (proposalInfo?.type === PROPOSAL_TYPE.FundingRequest) {
      return {
        onPress: () => openDebtInsufficientModal(),
      };
    }
    return {
      authInfo: authStore.userInfo,
    };
  }, [authStore.userInfo, proposalInfo.type, openDebtInsufficientModal]);

  return (
    <React.Fragment>
      <ModerationModal
        title={'Comment'}
        visible={showModerationModal}
        setShowModerationModal={() => setShowModerationModal(false)}
        moderationFormStore={moderationFormStore}
        onReportContent={onReportContent}
        hasPermission={hasPermission}
      />
      <ModalProposalApproval
        isVisible={modalSuccessVisible}
        onPressClose={() => setModalSuccessVisible(false)}
        proposalInfo={proposalInfo}
      />
      <ModalProposalRejected
        isVisible={modalRejectedVisible}
        onPressClose={() => setModalRejectedVisible(false)}
        proposalInfo={proposalInfo}
      />
      <ModerationActionSuccessModal
        type={'comment'}
        visible={showModerationSuccessModal}
        setShowModerationSuccessModal={() =>
          setShowModerationSuccessModal(false)
        }
        action={action}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={debtModalVisible}>
        <ModalDebtProposalWarning
          amount={amount}
          onPressClose={() => closeDebtModal()}
        />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={debtErrorModalVisible}>
        <ModalDebtProposalError
          amount={amount}
          onPressClose={() => closeDebtErrorModal()}
        />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={debtInsufficientModalVisible}>
        <ModalDebtProposalInsufficient
          amount={amount}
          onPressClose={() => closeDebtInsufficientModal()}
        />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalConversionVisible}>
        <ModalConversion
          onPressClose={() =>
            setModalConversionVisible(!modalConversionVisible)
          }
          showAmount={true}
          amount={+amount.toFixed(2)}
          funds={+getAvailableFunds().toFixed(2)}
        />
      </Modal>
      <SafeAreaView
        style={{
          backgroundColor: colors.white,
        }}
      />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        {showStickyTabBar && (
          <Animated.View style={[stickyTabBarStyle, slideUp]}>
            <TabBarRenderer
              navigationState={{index, routes}}
              jumpTo={originTabBarRef.current?.props?.jumpTo}
              parentRef={originTabBarRef}
            />
          </Animated.View>
        )}

        <ScrollView
          style={{marginBottom: index === 0 ? 0 : inputHeight + 50}}
          ref={scrollViewRef}
          scrollEventThrottle={16}
          nestedScrollEnabled={true}
          contentContainerStyle={{}}
          onScroll={(e) => {
            onTabViewScroll(e);

            stickyTabBarRef?.current?.measure(
              (fx, fy, width, height, px, py) => {
                Animated.timing(stickyTabBarState.animation, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }).start();
              },
            );

            topVotingButtonsRef?.current?.measure(
              (fx, fy, width, height, px, py) => {
                setShowBottomVotingButtonsContainer(py < 0);
              },
            );
          }}>
          {proposalInfo && (
            <View
              style={
                isHeaderHidden
                  ? {height: 1, marginTop: -1, overflow: 'hidden'}
                  : {}
              }>
              <View style={headerContainerStyle}>
                {proposalInfo?.type === PROPOSAL_TYPE.FundingRequest ? (
                  <View style={{...layout.content, width: '100%', padding: 0}}>
                    {proposedUser && (
                      <UserAvatar
                        image={proposedUser?.photoURL}
                        displayName={proposedUser?.displayName}
                        imageStyle={{width: 46, height: 46}}
                      />
                    )}
                    <Text
                      style={{
                        ...text.h2Black,
                        ...layout.marginBottomL,
                        ...layout.marginTopXS,
                      }}>
                      {proposalInfo?.description?.title || 'Unknown title'}
                    </Text>
                  </View>
                ) : (
                  <React.Fragment>
                    {proposedUser ? (
                      <>
                        <UserAvatar
                          image={proposedUser?.photoURL}
                          imageStyle={{width: 64, height: 64}}
                          iconName="clock"
                        />

                        <View style={{...layout.content, ...layout.marginTopS}}>
                          <Text style={text.h2Black}>
                            {proposedUser
                              ? proposedUser.displayName
                              : 'unknown user'}
                          </Text>

                          <TouchableOpacity
                            style={{...layout.flexRow, ...layout.marginTopXS}}
                            onPress={viewUserProfile}>
                            <Text style={text.smallBlackText}>
                              View Profile
                            </Text>
                            <Icon name="right-arrow" size={20} />
                          </TouchableOpacity>
                        </View>
                      </>
                    ) : (
                      <Placeholder Animation={Fade}>
                        <PlaceholderMedia
                          size={60}
                          isRound={true}
                          style={{alignSelf: 'center', marginBottom: 40}}
                        />
                        <PlaceholderLine
                          width={50}
                          style={{alignSelf: 'center'}}
                        />
                        <PlaceholderLine
                          width={30}
                          style={{alignSelf: 'center', marginBottom: 28}}
                        />
                      </Placeholder>
                    )}
                  </React.Fragment>
                )}

                <View
                  style={[
                    styles.contributionCard,
                    {
                      backgroundColor:
                        proposalInfo.isFundingRequest &&
                        proposalInfo.isCountdown
                          ? amount <= getAvailableFunds()
                            ? colors.iceBlue2
                            : colors.againstLightOpacity
                          : colors.iceBlue2,
                      borderBottomRightRadius: showDebtInfo ? 0 : 20,
                      borderBottomLeftRadius:
                        proposalInfo.isFundingRequest &&
                        proposalInfo.isCountdown &&
                        proposalInfo.fundingRequest.amount > 0
                          ? 0
                          : 20,
                    },
                  ]}>
                  <View style={styles.requestedAmountContainer}>
                    <Text
                      style={{...text.smallBlackText, ...layout.marginRightS}}>
                      {proposalInfo.isFundingRequest
                        ? amount > 0
                          ? 'Requested amount'
                          : 'No funding requested'
                        : 'Contribution:'}
                    </Text>
                    <Text style={text.h2Black}>
                      {amount > 0
                        ? `${CurrencySymbols.SHEKEL}${amount}`
                        : `${CurrencySymbols.SHEKEL}0`}
                    </Text>
                    <Text
                      style={{...text.smallBlackText, ...layout.marginRightS}}>
                      {proposalInfo.type === PROPOSAL_TYPE.Join &&
                        proposalCommon?.metadata?.contributionType ===
                          'monthly' &&
                        ' per month'}
                    </Text>
                  </View>
                  {isIsraelLocale &&
                    amount > 0 &&
                    proposalInfo.isFundingRequest && (
                      <View style={styles.conversionContainer}>
                        <Pressable
                          onPress={() =>
                            setModalConversionVisible(!modalConversionVisible)
                          }>
                          <Image
                            source={require('~/Assets/ils.png')}
                            width={15}
                            height={15}
                            style={{margin: 15}}
                          />
                        </Pressable>
                      </View>
                    )}

                  {showDebtInfo && (
                    <Text style={text.smallBlackText}>{`Available funds: ${
                      CurrencySymbols.SHEKEL
                    }${getAvailableFundsText()}`}</Text>
                  )}
                </View>
                {renderDebWarningIfNeeded()}
                <View style={styles.proposalStatusContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      if (showPaymentStatus) {
                        paymentStatusModal();
                      }
                    }}>
                    <ProposalCardHeader
                      isScreenHeader={true}
                      state={proposalInfo?.state}
                      paymentStatus={proposalInfo?.paymentState}
                      closingAt={proposalInfo?.countdown}
                      hasPermission={hasPermission}
                      viewerPermission={viewerPermission}
                      {...ProposalCardHeaderProps}
                    />
                  </TouchableOpacity>
                </View>

                <VoteContainer />
              </View>
            </View>
          )}

          <View
            ref={stickyTabBarRef}
            collapsable={false}
            style={{
              flex: 1,
              minHeight: screenHeight,
              backgroundColor: colors.paleGrey,
            }}>
            <TabView
              navigationState={{index, routes}}
              renderScene={() => null}
              onIndexChange={onSetIndex}
              initialLayout={initialLayout}
              renderTabBar={renderTabBar}
              style={{backgroundColor: colors.paleGrey, flex: 0}}
              sceneContainerStyle={{height: 0}}
            />

            <View style={{paddingTop: showStickyTabBar ? 100 : 0, flex: 1}}>
              {index === 0 && (
                <ProposalData proposalId={proposalId || proposalInfo.id} />
              )}

              {index === 1 && (
                <DiscussionMessagesList
                  discussionId={proposalId || proposalInfo.id}
                  proposal={proposalInfo}
                  scrollViewRef={scrollViewRef}
                  hasPermission={hasPermission}
                  commonId={proposalInfo.commonId}
                  openMessageOptions={(message) => openMessageOptions(message)}
                  isMember={isMember}
                  inputHeight={-35}
                  inputRef={inputRef}
                />
              )}
            </View>
          </View>
        </ScrollView>

        {index === 0 ? (
          renderVoting &&
          showBottomVotingButtonsContainer && (
            <View style={styles.actionButtonContainer}>
              {renderStickyBottomContent()}
            </View>
          )
        ) : (
          <React.Fragment>{messageInput()}</React.Fragment>
        )}
      </SafeAreaView>
      <BottomSheetModal
        style={layout.optionsModal}
        isVisible={voteModalVisible}
        onClose={closeVoteModal}>
        <ModalVote
          onVote={onVote}
          votingProcessState={votingProcessState}
          voteType={voteType}
          currentUserPhotoUrl={currentUserPhotoUrl}
          onPressClose={closeVoteModal}
          isMember={isMember}
        />
      </BottomSheetModal>
    </React.Fragment>
  );
};

ProposalScreen.propTypes = {
  navigation: object,
  route: shape({
    params: shape({
      proposalId: string,
    }),
  }),
  rootStore: rootStorePropTypes,
  start: func,
};

const styles = StyleSheet.create({
  inputContainer: {
    width: screenWidth,
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
  voteContainerTitle: {
    marginBottom: 16,
    fontSize: 14,
    color: colors.black,
    ...font.primary.bold,
  },
  voteContainer: {
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 16,
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  voteCountButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteCountButtonText: {
    fontSize: 14,
    ...font.primary.regular,
    letterSpacing: 0.28,
  },
  // New styles
  contributionCard: {
    ...layout.content,
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingVertical: 14,
  },
  requestedAmountContainer: {
    ...layout.content,
    ...layout.flexRow,
    padding: 0,
    flex: 1,
  },
  proposalProgressBar: {
    width: '100%',
    borderRadius: 7,
    height: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    ...layout.marginTopS,
  },
  proposalInnerProgressBar: {
    borderRadius: 6,
    backgroundColor: colors.lightishGreen,
    height: 8,
  },
  proposalProgressInfo: {
    ...layout.content,
    ...layout.flexRow,
    alignSelf: 'stretch',
    padding: 0,
    justifyContent: 'space-between',
  },
  topSheetVotingText: {
    ...text.smallBlackText,
    ...font.primary.bold,
    ...layout.marginBottomM,
  },
  bottomSheetVotingText: {
    ...text.smallBlackText,
    ...layout.marginBottomXS,
  },
  actionButtonContainer: {
    padding: 0,
    paddingVertical: sizeXS,
    paddingBottom: 40,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'stretch',
    width: '100%',
    shadowColor: 'rgba(79, 92, 105, 0.1)',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 4,
  },
  actionBtnStyle: {
    ...layout.btnOutline,
    borderRadius: 10,
    position: 'relative',
    height: 48,
  },
  conversionContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
    flex: 1,
    right: 0,
  },
  votedByYouText: {
    ...text.buttonblue,
    ...text.bold,
  },
  inputBorder: {
    flex: 1,
    flexDirection: 'row',
    borderColor: colors.grey4,
    borderWidth: 1,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 40,
  },
  joinCommonText: {
    ...text.textFieldplaceholder,
    color: colors.greySubtitle,
    marginTop: sizeS,
    marginBottom: sizeM,
    alignSelf: 'center',
  },
  proposalStatusContainer: {
    marginTop: 16,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const circleSvgPath = ({position, canvasSize, size}) =>
  `M0,0H${canvasSize.x}V${canvasSize.y}H0V0ZM${position.x._value},${
    position.y._value
  }H${position.x._value + size.x._value - 10}a 20 20 0 0 1 20 20 V${
    position.y._value + size.y._value - 20
  }a 20 20 0 0 1 -20 20H${position.x._value + 10}a 20 20 0 0 1 -20 -20V${
    position.y._value + 20
  }a 20 20 0 0 1 20 -20Z`;

export default inject('rootStore')(
  observer(
    copilot({
      stepNumberComponent: () => <View />,
      overlay: 'svg',
      tooltipComponent: TooltipComponent,
      tooltipStyle: {
        backgroundColor: colors.mainBlue,
        borderRadius: 17,
        width: screenWidth * 0.75,
        alignItems: 'center',
        height: 190,
      },
      arrowColor: colors.mainBlue,
      backdropColor: 'rgba(0, 0, 0, 0.2)',
      svgMaskPath: circleSvgPath,
      ...(Platform.OS === 'android' && {verticalOffset: 25}),
    })(ProposalScreen),
  ),
);
