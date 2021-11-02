import React, {useState, useRef, useEffect} from 'react';
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
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {text, layout, colors, sizeM, sizeS, sizeXS, font} from '~/Theme';
import Icon, {IconNames} from '~/Assets/iconfont/Icon';
import {TabBar, TabView} from 'react-native-tab-view';
import ProposalData from './ProposalData';
import DiscussionMessagesList from '~/Screens/DisscussionMessages/DiscussionMessagesList';
import ApprovalSheetScreen from '../BottomSheetScreens/ApprovalSheetScreen';
import Toast from '~/Util/Toast';
import BottomSheetModal from '~/Components/BottomSheetModal';
import ProposalService, {PROPOSAL_STAGE} from '~/Services/ProposalService';
import {UserAvatar} from '~/Components';
import {PROPOSAL_STAGES_ACTIVE} from '~/Services/ProposalService';
import {PROPOSAL_TYPE} from '~/Config';
import {inject, observer} from 'mobx-react';
import TabBarRenderer from '~/Components/TabView/TabBarRenderer';
import ProposalCardHeader from '~/Components/Proposals/ProposalCardHeader';
import {db} from '~/Firebase';
import {string, object, shape} from 'prop-types';
import logger from '~/Services/Logger';
import {LAYOUT_ANIMATION_CONFIG, LAYOUT_ANIMATION_CONFIG_SLOW} from '~/Util';
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
import {ModalApproval} from './components/ModalApproval';
import ModalConversion from '~/Components/Commons/ModalConversion';
import {isIsraelLocale} from '~/Util/locale';
import {rootStorePropTypes} from '~/Types/propTypes';
import ModerationFormStore from '~/FormStores/ModerationFormStore';
import * as ModerationForm from '~/Components/Forms/ModerationForm';
import ModerationService from '~/Services/ModerationService';
import ModerationActionSuccessModal from '~/Components/Moderation/ModerationActionSuccessModal';
import ModerationModal from '~/Components/Moderation/ModerationModal';
import {ModalChangeVote} from './components/ModalChangeVote';
import {useNavigation, useRoute} from '@react-navigation/native';
import {RouteProp} from '@react-navigation/native';
import RootStore from '~/Stores/RootStore';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import {IProposalEntity, IProposalVote} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {VotingPannel} from '~/Screens/Proposals/VotingPannel';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface ProposalProps {
  rootStore: RootStore;
}
interface ProposalRouteProps {
  proposalId: string;
  tabIndex: number;
  hasPermission: boolean;
  fromNotificationItem: boolean;
}

const ProposalScreen = ({rootStore}: ProposalProps) => {
  const navigation = useNavigation();
  const route: RouteProp<{params: ProposalRouteProps}, 'params'> = useRoute();
  const {
    proposalId,
    tabIndex = 0,
    hasPermission,
    fromNotificationItem,
  } = route.params;
  const userStore = rootStore.userStore;
  const discussionMessageStore = rootStore.discussionMessageStore;
  const commonStore = rootStore.commonStore;
  const proposalStore = rootStore.proposalStore;
  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;
  const authStore = rootStore.authStore;
  const uiStore = rootStore.uiStore;
  const {userInfo, isDaoMember} = authStore;
  const {conversionRate} = uiStore;
  const сurrentUserPhotoUrl = userInfo ? userInfo.photoURL : 'template';

  const [votingProcessState, setVotingProcessState] = useState({
    inProgress: false,
    error: false,
  });
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [inputHeight, setInputHeight] = useState(0);
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
  const [changeVoteModalVisible, setChangeVoteModalVisible] = useState(false);
  const [voteModalVisible, setVoteModalVisible] = useState(false);
  const [testVar, setTestVar] = useState(false);

  // Sticky Tab Bar
  const [showStickyTabBar, setShowStickyTabBar] = useState(false);
  const stickyTabBarRef = useRef(null);
  const originTabBarRef = useRef<TabBar<any>>(null);

  const [stickyTabBarState] = useState({animation: new Animated.Value(0)});

  // Top voting buttons ref
  const topVotingButtonsRef = useRef(null);

  const scrollViewRef = useRef(null);

  // Values for vote param required from the blockchain
  const VOTE_APPROVE = 'approved';
  const VOTE_REJECT = 'rejected';
  let currTabViewScroll = 0;

  useEffect(() => {
    const unsubscribeFromProposalDiscussionMessages = discussionMessageStore.subscribeToProposalDiscussionMessages(
      proposalId,
    );

    let unsubscribeFromProposalById: FirestoreUnsubscribeFn;
    if (fromNotificationItem) {
      unsubscribeFromProposalById = proposalStore.subscribeToProposalById(
        proposalId,
      );
    }

    return () => {
      unsubscribeFromProposalDiscussionMessages &&
        unsubscribeFromProposalDiscussionMessages();

      unsubscribeFromProposalById && unsubscribeFromProposalById();
    };
  }, [proposalId]);

  const proposalInfo = proposalStore.getProposalById(proposalId);
  let currentUserVote: IProposalVote | {} = {};
  if (proposalInfo) {
    const filteredVotes = proposalInfo.votes.filter((item) => item.voterId === userInfo?.uid);
    if (filteredVotes?.length !== 0) {
      currentUserVote = filteredVotes[0];
    }
  }

  let viewerPermission = '';
  if (proposalInfo) {
    viewerPermission = rootStore.authStore.getPermission(
      proposalInfo?.id,
      auth()?.currentUser?.uid,
    );
  }

  const proposalCommon = proposalInfo
    ? commonStore.getCommonById(proposalInfo.commonId)
    : null;
  const proposedUser = proposalInfo
    ? userStore.getUserById(proposalInfo.proposerId)
    : null;

  const showDebtInfo =
    proposalInfo?.isFundingRequest &&
    proposalInfo.isCountdown &&
    proposalInfo.fundingRequest &&
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

  const [
    isApprovalBottomModalVisible,
    setIsApprovalBottomModalVisible,
  ] = useState(false);

  const [isVoteByYou, setIsVoteByYou] = useState(false);
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

  const [inputText, setInputText] = useState('');

  const inputRef = useRef<TextInput>();

  const renderTabBar = (currProps: any) =>
    proposalInfo && (
      <View style={{paddingBottom: 5}}>
        <TabBarRenderer
          originRef={originTabBarRef}
          jumpTo={originTabBarRef.current && originTabBarRef.current.props?.jumpTo}
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
        if (inputRef.current) {
          inputRef.current.clear();
        }

        db.collection('discussionMessage')
          .doc()
          .set({
            text: message,
            createTime: new Date(),
            ownerId: userInfo.uid,
            ownerName: userInfo.displayName,
            ownerAvatar: userInfo.photoURL,
            discussionId: proposalId || proposalInfo?.id,
          })
          .then(() => {
            Keyboard.dismiss();

            setIsSending(false);
            setInputText('');
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
        <View style={viewStyle}>
          <View style={styles.inputBorder}>
            <TextInput
              ref={inputRef}
              editable={true}
              fontSize={15}
              multiline
              placeholder="What do you think?"
              onChangeText={(currText: string) => setInputText(currText)}
              onContentSizeChange={(event) => {
                setInputHeight(event.nativeEvent.contentSize.height);
              }}
              style={{
                flex: 1,
                padding: 0,
                marginHorizontal: 10,
                maxHeight: 110,
                height: Math.max(35, inputHeight + 10),
              }}
            />
            <TouchableOpacity
              onPress={sendMessageToDiscussion}
              style={{
                paddingRight: 15,
                justifyContent: 'center',
              }}
              disabled={isEmptyMessage()}>
              <Icon
                name="send-message"
                size={20}
                color={isEmptyMessage() ? colors.grey3 : colors.mainBlue}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            height: 30,
            backgroundColor: colors.white,
          }}
        />
      </KeyboardAvoidingView>
    ) : (
      <View style={viewStyle}>
        <Text style={{...styles.joinCommonText}}>
          Only members or proposal creators can send messages
        </Text>
      </View>
    );
  };

  const openApprovalSheet = (isApproval) => {
    setVoteType(isApproval);
    // setIsApprovalBottomModalVisible(true);
    setVoteModalVisible(true);
  };

  const closeApprovalSheet = (e) => {
    setIsApprovalBottomModalVisible(false);
  };

  const viewUserProfile = () => {
    navigation.navigate('Profile', {
      userId: proposedUser?.uid,
    });
  };

  const onVote = async (isApproved: boolean) => {
    setVotingProcessState({
      inProgress: true,
      error: false,
    });

    try {
      const voteData = {
        outcome: isApproved ? VOTE_APPROVE : VOTE_REJECT,
        proposalId: proposalId || proposalInfo?.id,
      };

      const createVoteResponse = await ProposalService.getInstance().createVote(
        voteData,
      );
      if (createVoteResponse.status === 200) {
        setVotingProcessState({inProgress: false, error: false});
        // closeApprovalSheet();
        closeVoteModal();
        Toast.done(isApproved ? 'Approved by you' : 'Rejected by you');
        setIsVoteByYou(isApproved);
      } else {
        setVotingProcessState({inProgress: false, error: true});
        logger.log(createVoteResponse.status);
        Toast.error(`Status code ${createVoteResponse.status}`);
      }
    } catch (err) {
      setVotingProcessState({
        inProgress: false,
        error: err,
      });
    }
  };

  const renderStickyBottomContent = () => {
    if (isVoteByYou) {
      let message = 'Rejected by you';
      let iconName: IconNames = 'close';
      let color = colors.error;

      if (isVoteByYou.isApproved) {
        message = 'Approved by you';
        iconName = 'check';
        color = colors.lightishGreen;
      }

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

  const renderVotingButtons = (reference) => {
    LayoutAnimation.configureNext(LAYOUT_ANIMATION_CONFIG);
    return (
      PROPOSAL_STAGES_ACTIVE.some((stg) => stg === proposalInfo?.state) && (
        <View
          ref={reference}
          style={{...layout.content, padding: 0, width: '100%'}}>
          <Text
            style={
              reference
                ? styles.topSheetVotingText
                : styles.bottomSheetVotingText
            }>
            What's your vote?
          </Text>
          <View style={layout.flexRow}>
            <TouchableOpacity
              onPress={(e) => openApprovalSheet(true)}
              style={{...styles.actionBtnStyle, ...layout.marginRightS}}>
              <Icon name="approved-24" color={colors.lightishGreen} size={24} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={(e) => openApprovalSheet(false)}
              style={{...styles.actionBtnStyle, ...layout.marginLeftS}}>
              <Icon name="reject-24" color={colors.against} size={24} />
            </TouchableOpacity>
          </View>
        </View>
      )
    );
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

    if (!isDiscussionTab && showStickyTabBar) {
      Animated.timing(stickyTabBarState.animation, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }).start(() => {
        setShowStickyTabBar(false);
      });
    }

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

  const closeChangeVoteModal = () => {
    setChangeVoteModalVisible(false);
  };

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
          proposalInfo?.commonId,
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
          proposalInfo?.commonId,
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

  const openMessageOptions = (message) => {
    if (message) {
      moderationFormStore.registerFormField(
        ModerationForm.ITEM_ID,
        'string',
        message.id,
      );
    }
    bottomSheetStore.showBottomSheet(
      BOTTOM_SHEET_TEMPLATES.SCREEN_COMMON_PROFILE_OPTIONS,
      {
        onAction: (actionType: string) => onModerate(actionType, message.id),
        hasPermission,
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
    await ModerationService.report(
      'discussionMessage',
      proposalInfo?.commonId,
      moderationFormStore.getFormFieldsJson(),
    );
    Toast.hide();
    Toast.success('Done');
    setShowModerationSuccessModal(true);
    moderationFormStore.clearFormStoreState();
  };

  return (
    <React.Fragment>
      <ModerationModal
        title={'Comment'}
        visible={showModerationModal}
        setShowModerationModal={() => setShowModerationModal(false)}
        moderationFormStore={moderationFormStore}
        onReportContent={() => onReportContent()}
        hasPermission={hasPermission}
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
          amount={+(amount * conversionRate).toFixed(2)}
          funds={+(getAvailableFunds() * conversionRate).toFixed(2)}
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
          <Animated.View style={[styles.stickyTabBar, slideUp]}>
            <TabBarRenderer
              navigationState={{index, routes}}
              jumpTo={originTabBarRef.current?.props?.jumpTo}
              parentRef={originTabBarRef}
            />
          </Animated.View>
        )}

        <ScrollView
          style={{}}
          ref={scrollViewRef}
          scrollEventThrottle={16}
          nestedScrollEnabled={true}
          contentContainerStyle={{}}
          onScroll={(e) => {
            onTabViewScroll(e);

            stickyTabBarRef?.current?.measure(
              (fx, fy, width, height, px, py) => {
                const isVisible = py < 0;

                if (isVisible !== showStickyTabBar) {
                  if (isVisible) {
                    setShowStickyTabBar(isVisible);
                    Animated.timing(stickyTabBarState.animation, {
                      toValue: 1,
                      duration: 200,
                      useNativeDriver: true,
                    }).start();
                  } else {
                    Animated.timing(stickyTabBarState.animation, {
                      toValue: 0,
                      duration: 300,
                      useNativeDriver: true,
                    }).start(() => {
                      setShowStickyTabBar(isVisible);
                    });
                  }
                }
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
                        onPress={() => openDebtInsufficientModal()}
                        hasPermission={hasPermission}
                        viewerPermission={viewerPermission}
                      />
                    </TouchableOpacity>
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
                        authInfo={authStore.userInfo}
                        viewerPermission={viewerPermission}
                      />
                    </TouchableOpacity>

                    {proposedUser ? (
                      <>
                        <UserAvatar
                          image={proposedUser?.photoURL}
                          imageStyle={{width: 64, height: 64}}
                          iconName={'clcok'}
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
                        proposalInfo.fundingRequest &&
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
                      {amount > 0 ? `$${amount}` : '$0'}
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
                    <Text
                      style={
                        text.smallBlackText
                      }>{`Available funds: $${getAvailableFundsText()}`}</Text>
                  )}
                </View>
                {renderDebWarningIfNeeded()}

                <VotingPannel
                  currentUserVote={currentUserVote}
                  сurrentUserPhotoUrl={сurrentUserPhotoUrl}
                  proposalInfo={proposalInfo}
                />

                <TouchableOpacity style={{alignSelf: 'center', marginBottom: 16}} onPress={() => setChangeVoteModalVisible(true)}>
                  <Text style={text.blackActionText}>{ testVar ? 'Change your vote' : ' '}</Text>
                </TouchableOpacity>

                <View
                  style={{
                    ...layout.flexRow,
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  {renderVoting && renderVotingButtons(topVotingButtonsRef)}
                </View>
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
                <ProposalData proposalId={proposalId || proposalInfo?.id} />
              )}

              {index === 1 && (
                <DiscussionMessagesList
                  discussionId={proposalId || proposalInfo?.id}
                  proposal={proposalInfo}
                  inputRef={inputRef}
                  scrollViewRef={scrollViewRef}
                  hasPermission={hasPermission}
                  commonId={proposalInfo?.commonId}
                  openMessageOptions={(message) => openMessageOptions(message)}
                  isMember={isMember}
                />
              )}
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity onPress={() => setTestVar(!testVar)}>
            <Text>YO</Text>
          </TouchableOpacity>
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
        isVisible={isApprovalBottomModalVisible}
        onClose={closeApprovalSheet}>
        <ApprovalSheetScreen
          voteType={voteType}
          onApprove={onVote}
          onClose={closeApprovalSheet}
          votingProcessState={votingProcessState}
        />
      </BottomSheetModal>
      <BottomSheetModal
        style={styles.voteModal}
        isVisible={voteModalVisible}
        onClose={closeVoteModal}>
        <ModalApproval onVote={onVote} voteType={voteType} сurrentUserPhotoUrl={сurrentUserPhotoUrl} onPressClose={closeVoteModal} />
      </BottomSheetModal>
      <BottomSheetModal
        style={styles.voteModal}
        isVisible={changeVoteModalVisible}
        onClose={closeChangeVoteModal}>
        <ModalChangeVote onVote={onVote} voteType={voteType} сurrentUserPhotoUrl={сurrentUserPhotoUrl} onPressClose={closeChangeVoteModal} />
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
};

const styles = StyleSheet.create({
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
  stickyVotingContainer: {
    ...layout.flexRow,
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
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
  input: {
    backgroundColor: colors.white,
    borderColor: colors.grey4,
    justifyContent: 'center',
    borderBottomWidth: 1,
    width: screenWidth,
    flexDirection: 'row',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,

    borderTopWidth: 1,
    borderTopColor: colors.grey2,
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
  voteModal: {
    paddingTop: 16,
    borderRadius: 27,
  },
  stickyTabBar: {
    position: 'absolute',
    top: -80,
    width: '100%',
    paddingBottom: 5,
    zIndex: 1,
  },
});

export default inject('rootStore')(observer(ProposalScreen));
