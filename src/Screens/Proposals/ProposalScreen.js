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
} from 'react-native';
import {text, layout, colors, sizeM, sizeS, sizeXS, font} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import {TabView} from 'react-native-tab-view';
import ProposalData from './ProposalData';
import ProposalDiscussion from './ProposalDiscussion';
import ApprovalSheetScreen from '../BottomSheetScreens/ApprovalSheetScreen';
import Toast from '~/Util/Toast';
import BottomSheetModal from '~/Components/BottomSheetModal';
import ProposalService from '~/Services/ProposalService';
import {UserAvatar, BottomRightButton} from '~/Components';
import {PROPOSAL_STAGES_ACTIVE} from '~/Services/ProposalService';
import {PROPOSAL_TYPE} from '~/Config';
import UserService from '~/Services/UserService';
import DaoService from '~/Services/DaoService';
import {observer, inject} from 'mobx-react';
import TabBarRenderer from '~/Components/TabView/TabBarRenderer';
import ProposalCardHeader from '~/Components/Proposals/ProposalCardHeader';
import {db} from '~/Firebase';
import {string, func, object, shape, oneOfType, number} from 'prop-types';
import logger from '~/Services/Logger';
import {LAYOUT_ANIMATION_CONFIG} from '~/Util';
import {BOTTOM_SHEET_TEMPLATES} from '~/Stores/BottomSheetStore';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ProposalScreen = ({
  navigation,
  bottomSheetStore,
  userStore: {
    userInfo,
    isDaoMember,
    ...userStore
  },
  route: {
    params: {
      commonBalance,
      proposalId,
      proposalCardInfo,
    },
  },
}) => {
  const [votingProcessState, setVotingProcessState] = useState({inProgress: false, error: false});
  const [proposalScreenInfo, setProposalScreenInfo] = useState(proposalCardInfo);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isProposer, setIsProposer] = useState(false);
  const [inputHeight, setInputHeight] = useState(false);
  const [showBottomVotingButtonsContainer, setShowBottomVotingButtonsContainer] = useState(false);
  const [showPaymentStatus, setShowPaymentStatus] = useState(false);
  const renderVoting =
    proposalScreenInfo?.proposalInfo &&
    PROPOSAL_STAGES_ACTIVE.includes(proposalScreenInfo?.proposalInfo?.state) &&
    isMember &&
    !proposalScreenInfo?.proposalInfo.votes.some((vote) => vote.voter === userInfo.safeAddress);


  // Sticky Tab Bar
  const [showStickyTabBar, setShowStickyTabBar] = useState(false);
  const stickyTabBarRef = useRef(null);
  const originTabBarRef = useRef(null);

  const [stickyTabBarState] = useState({animation: new Animated.Value(0)});

  // Top voting buttons ref
  const topVotingButtonsRef = useRef(null);

  const scrollViewRef = useRef(null);

  // Values for vote param required from the blockchain
  const VOTE_APPROVE = 'approved';
  const VOTE_REJECT = 'rejected';
  let currTabViewScroll = 0;

  useEffect(() => {
    let unsubscribe = null;

    const loadProposalInfo = async (currProposalInfo, currProposalDao) => {
      let currProposedUser = null;
      let funding = null;

      if (currProposalInfo.type === PROPOSAL_TYPE.Join) {
        funding = currProposalInfo.join.funding;
        currProposedUser = await UserService.getInstance().getUserById(
          currProposalInfo.proposerId
        );

        LayoutAnimation.configureNext(LAYOUT_ANIMATION_CONFIG);
        navigation.setParams({
          subtitle: currProposalDao?.metadata?.name,
        });
      }
      //FundingRequest proposal
      else {
        currProposedUser = await UserService.getInstance().getUserById(
          currProposalInfo.proposerId
        );
        funding = currProposalInfo.fundingRequest.amount;

        navigation.setParams({
          title: currProposalDao?.metadata?.name,
        });
      }

      if (currProposalInfo.state === 'passed') {
        setShowPaymentStatus(true);
      }
      setProposalScreenInfo(
        {
          proposalInfo: {...currProposalInfo, funding},
          proposedUser: currProposedUser,
          proposalDao: currProposalDao,
        }
      );
    };

    const getProposalInfo = async (currProposalId) => {
      try {
        unsubscribe = await ProposalService.getInstance().subscribeToProposalById(currProposalId,
          async (updatedProposalInfo) => {
            if (updatedProposalInfo.type === PROPOSAL_TYPE.Join) {
              navigation.setParams({
                title: 'Request to join',
              });
            }

            const currentDao = await DaoService.getInstance().getDaoById(updatedProposalInfo.commonId);

            setIsMember(userInfo && isDaoMember(currentDao?.members || []));
            setIsProposer(userStore.isProposer(updatedProposalInfo));
            await loadProposalInfo(updatedProposalInfo, currentDao);
          }
        );

      } catch (error) {
        logger.log('error: ', error);
        Toast.error(error?.toString());
      }
    };

    if (proposalId) {
      logger.log(`proposalId --> ${proposalId}`);
      getProposalInfo(proposalId);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [proposalId, votingProcessState]);

  const [
    isApprovalBottomModalVisible,
    setIsApprovalBottomModalVisible,
  ] = useState(false);

  const [isVoteByYou, setIsVoteByYou] = useState(false);
  const [voteType, setVoteType] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {index: 0, key: 'info', icon: 'proposal', iconSelected: 'proposal-selected'},
    {index: 1, key: 'discussions', icon: 'discussion', iconSelected: 'discussion-selected'},
  ]);

  const [inputText, setInputText] = useState(null);

  const inputRef = useRef();

  const renderTabBar = (currProps) => proposalScreenInfo?.proposalInfo && (
    <View style={{paddingBottom: 5}}>
      <TabBarRenderer originRef={originTabBarRef} jumpTo={originTabBarRef.current?.props?.jumpTo}
        indexChange={setIndex} {...currProps} />
    </View>
  );

  const messageInput = () => {
    const sendMessageToDiscussion = async () => {
      if (isSending || !userInfo?.uid) {
        return;
      }
      setIsSending(true);
      const message = inputText;
      if (message && message.trim().length) {
        inputRef.current.clear();

        db.collection('discussionMessage')
          .doc()
          .set({
            text: message,
            createTime: new Date(),
            ownerId: userInfo.uid,
            ownerName: userInfo.displayName,
            ownerAvatar: userInfo.photoURL,
            discussionId: proposalId || proposalScreenInfo?.proposalInfo.id,
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
        Toast.error('Empty Message');
        setIsSending(false);
      }
    };

    let viewStyle = styles.input;
    if (isMember) {
      viewStyle = {...viewStyle, borderBottomWidth: 0};
    }

    return (
      <KeyboardAvoidingView
        style={{
          position: 'absolute',
          bottom: 0,
          flex: 1,
          color: '#fbfdff',
        }}
      >
        <View style={viewStyle}>
          {(isMember || isProposer) ? (
            <View style={styles.inputBorder}>
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
              >
                <Icon
                  name="send-message"
                  size={20}
                  color={
                    inputText && inputText.trim()
                      ? colors.mainBlue
                      : colors.grey3}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={{...styles.joinCommonText}}>
              Only members or proposal creators can send messages
            </Text>
          )}
        </View>

        <View
          style={{
            height: 30,
            backgroundColor: colors.white,
          }}
        />
      </KeyboardAvoidingView>
    );
  };

  const openApprovalSheet = (isApproval) => {
    setVoteType(isApproval);
    setIsApprovalBottomModalVisible(true);
  };

  const closeApprovalSheet = (e) => {
    setIsApprovalBottomModalVisible(false);
  };

  const viewUserProfile = () => {
    navigation.navigate('Profile', {userId: proposalScreenInfo?.proposedUser.uid});
  };

  const onVote = async (isApproved) => {
    setVotingProcessState({
      inProgress: true,
      error: false,
    });

    try {
      const voteData = {
        outcome: isApproved ? VOTE_APPROVE : VOTE_REJECT,
        proposalId: proposalId || proposalScreenInfo?.proposalInfo.id,
      };

      const createVoteResponse = await ProposalService.getInstance().createVote(voteData);
      if (createVoteResponse.status === 200) {
        setVotingProcessState({inProgress: false, error: false});
        closeApprovalSheet();
        Toast.done(isApproved ? 'Approved by you' : 'Rejected by you');
        setIsVoteByYou({isApproved: isApproved});
      } else {
        setVotingProcessState({inProgress: false, error: true});
        logger.log(createVoteResponse.status);
        Toast.error(`Status code ${createVoteResponse.status}`);
      }
    } catch (err) {
      setVotingProcessState({inProgress: false, error: true});
      logger.log(err);
      Toast.error(err.message);
    }
  };

  const renderStickyBottomContent = () => {
    if (isVoteByYou) {
      let message = 'Rejected by you';
      let iconName = 'close';
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
    console.log('called', BOTTOM_SHEET_TEMPLATES.PAYMENT_FAILED)
    /*bottomSheetStore.showBottomSheet(
      BOTTOM_SHEET_TEMPLATES.PAYMENT_FAILED
    )*/
  };

  const renderVotingButtons = (reference) => {
    LayoutAnimation.configureNext(LAYOUT_ANIMATION_CONFIG);
    return (
      (PROPOSAL_STAGES_ACTIVE.some((stg) => stg === proposalScreenInfo?.proposalInfo?.state)) && (
        <View ref={reference} style={{...layout.content, padding: 0, width: '100%'}}>
          <Text style={reference ? styles.topSheetVotingText : styles.bottomSheetVotingText}>What's your vote?</Text>
          <View style={layout.flexRow}>
            <TouchableOpacity
              onPress={(e) => openApprovalSheet(true)}
              style={{...styles.actionBtnStyle, ...layout.marginRightS}}
            >
              <Icon name="approved-24" color={colors.lightishGreen} size={24}/>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={(e) => openApprovalSheet(false)}
              style={{...styles.actionBtnStyle, ...layout.marginLeftS}}>
              <Icon name="reject-24" color={colors.against} size={24}/>
            </TouchableOpacity>
          </View>
        </View>
      ));
  };

  const initialLayout = {width: screenWidth};

  const headerContainerStyle = {
    ...layout.content,
    ...{paddingBottom: 0},
    ...proposalScreenInfo?.proposalInfo.type === PROPOSAL_TYPE.FundingRequest && {...layout.flexStart},
  };

  const votesFor = proposalScreenInfo?.proposalInfo?.votesFor;
  const votesAgainst = proposalScreenInfo?.proposalInfo?.votesAgainst;

  const progressBarWidthPercent = proposalScreenInfo?.proposalInfo
    ? (votesFor / (votesFor + votesAgainst) * 100) : 0;


  const votesCount = votesFor + votesAgainst;

  const onSetIndex = (item) => {
    LayoutAnimation.configureNext(LAYOUT_ANIMATION_CONFIG);
    const isDiscussionTab = item === 1;
    setIsHeaderHidden(isDiscussionTab);

    if (!isDiscussionTab && showStickyTabBar) {
      Animated.timing(stickyTabBarState.animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(
        () => {
          setShowStickyTabBar(false);
        });
    }

    setIndex(item);
  };

  const onTabViewScroll = (e) => {
    const currScrollY = e.nativeEvent.contentOffset.y;
    if (currScrollY > currTabViewScroll) {
      if (!isHeaderHidden) {
        LayoutAnimation.configureNext(LAYOUT_ANIMATION_CONFIG);
        setIsHeaderHidden(true);
      }
    } else if (currScrollY < 1) {
      if (isHeaderHidden) {
        LayoutAnimation.configureNext(LAYOUT_ANIMATION_CONFIG);
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

  const stickyTabBarStyle = {position: 'absolute', top: -80, width: '100%', paddingBottom: 5, zIndex: 1};

  return (
    <React.Fragment>
      <SafeAreaView
        style={{
          backgroundColor: colors.white,
        }}
      />

      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}
      >

        {showStickyTabBar && (
          <Animated.View style={[stickyTabBarStyle, slideUp]}>
            <TabBarRenderer navigationState={{index, routes}} jumpTo={originTabBarRef.current?.props?.jumpTo}
              parentRef={originTabBarRef}/>
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

            stickyTabBarRef?.current?.measure((fx, fy, width, height, px, py) => {
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
                  }).start(
                    () => {
                      setShowStickyTabBar(isVisible);
                    });
                }
              }
            });

            topVotingButtonsRef?.current?.measure((fx, fy, width, height, px, py) => {
              setShowBottomVotingButtonsContainer(py < 0);
            });
          }}
        >
          {proposalScreenInfo?.proposalInfo && (
            <View style={isHeaderHidden ? {height: 1, marginTop: -1, overflow: 'hidden'} : {}}>
              <View style={headerContainerStyle}>
                {proposalScreenInfo?.proposalInfo.type === PROPOSAL_TYPE.FundingRequest ? (
                  <View style={{...layout.content, width: '100%', padding: 0}}>
                    <ProposalCardHeader
                      isScreenHeader={true}
                      isBoosted={true}
                      stage={proposalScreenInfo?.proposalInfo?.state}
                      winningOutcome={proposalScreenInfo?.proposalInfo?.winningOutcome}
                    />
                    {proposalScreenInfo?.proposedUser && (

                      <UserAvatar
                        image={proposalScreenInfo?.proposedUser?.photoURL}
                        displayName={proposalScreenInfo?.proposedUser?.displayName}
                        imageStyle={{width: 46, height: 46}}
                      />

                    )}
                    <Text style={{...text.h2Black, ...layout.marginBottomL, ...layout.marginTopXS}}>
                      {proposalScreenInfo?.proposalInfo?.description?.title || 'Unknown title'}
                    </Text>
                  </View>
                ) : (
                  <React.Fragment>
                    <ProposalCardHeader
                      isScreenHeader={true}
                      isBoosted={true}
                      stage={proposalScreenInfo?.proposalInfo?.state}
                      winningOutcome={proposalScreenInfo?.proposalInfo?.winningOutcome}
                    />

                    {proposalScreenInfo?.proposedUser ? (
                      <>
                        <UserAvatar
                          image={proposalScreenInfo?.proposedUser?.photoURL}
                          imageStyle={{width: 64, height: 64}}
                          iconName={'clcok'}
                        />

                        <View style={{...layout.content, ...layout.marginTopS}}>
                          <Text style={text.h2Black}>
                            {proposalScreenInfo?.proposedUser
                              ? proposalScreenInfo?.proposedUser.displayName
                              : 'unknown user'
                            }
                          </Text>


                          <TouchableOpacity style={{...layout.flexRow, ...layout.marginTopXS}}
                            onPress={viewUserProfile}>
                            <Text style={text.smallBlackText}>View Profile</Text>
                            <Icon name="right-arrow" size={20}/>
                          </TouchableOpacity>

                        </View>
                      </>
                    ) :
                      (<Placeholder Animation={Fade}>
                        <PlaceholderMedia
                          size={60}
                          isRound={true}
                          style={{alignSelf: 'center', marginBottom: 40}}
                        />
                        <PlaceholderLine width={50} style={{alignSelf: 'center'}}/>
                        <PlaceholderLine width={30} style={{alignSelf: 'center', marginBottom: 28}}/>
                      </Placeholder>)
                    }
                  </React.Fragment>
                )}

                <View style={styles.contributionCard}>

                  <View style={styles.requestedAmountContainer}>
                    <Text style={{...text.smallBlackText, ...layout.marginRightS}}>
                      {proposalScreenInfo?.proposalInfo.type === PROPOSAL_TYPE.FundingRequest ?
                        'Requested amount' : 'Contribution'}
                    </Text>
                    <Text style={text.h2Black}>
                      {`$${proposalScreenInfo?.proposalInfo.type === PROPOSAL_TYPE.FundingRequest
                        ? proposalScreenInfo?.proposalInfo.fundingRequest.amount / 100
                        : proposalScreenInfo?.proposalInfo.join.funding / 100}`}

                      {
                        proposalScreenInfo?.proposalInfo.type === PROPOSAL_TYPE.Join &&
                        proposalScreenInfo?.proposalDao?.metadata?.contribution === 'monthly' && '/mo'}
                    </Text>
                  </View>
                  {proposalScreenInfo?.proposalInfo.type === PROPOSAL_TYPE.FundingRequest
                  && <Text
                    style={text.smallBlackText}>{`Available funds: ${commonBalance !== undefined ? '$' + commonBalance / 100 : ''}`}</Text>
                  }
                </View>

                <View style={{...layout.content, width: '100%', paddingHorizontal: 0}}>

                  <View style={styles.proposalProgressInfo}>
                    <View
                      style={{...layout.content, ...layout.flexRow, padding: 0}}>
                      <Icon
                        name="user-approved"
                        color={colors.lightishGreen}
                        size={25}
                        style={layout.marginRightXS}/>
                      <Text style={text.lightishGreenText}>
                        {votesFor}
                      </Text>
                    </View>

                    <Text style={text.smallBlackText}>
                      {votesCount === 0 ? 'No votes yet' : `${votesCount} ${votesCount > 1 ? 'votes' : 'vote'}`}
                    </Text>

                    <View
                      style={{...layout.content, ...layout.flexRow, padding: 0}}>
                      <Text style={text.againstText}>
                        {votesAgainst}
                      </Text>
                      <Icon
                        name="user-rejected"
                        color={colors.against}
                        size={25}
                        style={layout.marginLeftXS}/>
                    </View>
                  </View>
                  <View style={{
                    ...styles.proposalProgressBar,
                    ...{backgroundColor: isNaN(progressBarWidthPercent) ? colors.grey4 : colors.against},
                  }}>
                    <View
                      style={{...styles.proposalInnerProgressBar, width: `${progressBarWidthPercent}%`}}
                    />
                  </View>
                </View>

                <View style={{...layout.flexRow, justifyContent: 'space-between', width: '100%'}}>
                  {renderVoting && renderVotingButtons(topVotingButtonsRef)}
                </View>
              </View>
            </View>
          )}

          <View ref={stickyTabBarRef} collapsable={false} style={{flex: 1, minHeight: screenHeight, backgroundColor: colors.paleGrey}}>
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
                <ProposalData
                  proposalId={proposalId || proposalScreenInfo?.proposalInfo.id}
                  proposalInfo={proposalScreenInfo?.proposalInfo}
                  showMore={() => onSetIndex(1)}
                />
              )}

              {index === 1 && (
                <ProposalDiscussion
                  proposalId={proposalId || proposalScreenInfo?.proposalInfo.id}
                  proposal={proposalScreenInfo?.proposalInfo}
                  inputRef={inputRef}
                  scrollViewRef={scrollViewRef}
                />
              )}
            </View>
          </View>
        </ScrollView>

        {index === 0 ? renderVoting
          && showBottomVotingButtonsContainer && (
          <View style={styles.actionButtonContainer}>
            {renderStickyBottomContent()}
          </View>
        ) : (
          <React.Fragment>
            {messageInput()}
          </React.Fragment>
        )}

        {showPaymentStatus && paymentStatusModal()}
      </SafeAreaView>

      <BottomSheetModal
        isVisible={isApprovalBottomModalVisible}
        onClose={closeApprovalSheet}
      >
        <ApprovalSheetScreen
          voteType={voteType}
          onApprove={onVote}
          onClose={closeApprovalSheet}
          votingProcessState={votingProcessState}
        />
      </BottomSheetModal>
    </React.Fragment>
  );
};

ProposalScreen.propTypes = {
  navigation: object,
  userStore: shape({
    userInfo: object,
    isDaoMember: func,
  }),
  route: shape({
    params: shape({
      commonBalance: oneOfType([
        object,
        number,
        string,
      ]),
      proposalId: string,
    }),
  }),
};

const styles = StyleSheet.create({
  // New styles
  contributionCard: {
    ...layout.content,
    width: '100%',
    backgroundColor: colors.iceBlue2,
    borderRadius: 28,
    paddingVertical: 14,
  },
  requestedAmountContainer: {
    ...layout.content,
    ...layout.flexRow,
    padding: 0,
  },
  stickyVotingContainer: {
    ...layout.flexRow,
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
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
    width: Dimensions.get('window').width * 0.9,
    textAlign: 'center',
  },
});


export default inject(
  'userStore',
  'bottomSheetStore'
)(observer(ProposalScreen));
