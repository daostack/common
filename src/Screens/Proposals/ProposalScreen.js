import React, {useState, useRef, useEffect} from 'react';
import {
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
import ArcService from '~/Services/ArcService';
import {UserAvatar} from '~/Components';
import {PROPOSAL_STAGES_ACTIVE} from '~/Services/ProposalService';
import {PROPOSAL_TYPE} from '~/Config';
import UserService from '~/Services/UserService';
import DaoService from '~/Services/DaoService';
import {observer, inject} from 'mobx-react';
import TabBarRenderer from '~/Components/TabView/TabBarRenderer';
import moment from 'moment';
import ProposalCardHeader from '~/Components/Proposals/ProposalCardHeader';
import {db} from '~/Firebase';
import {string, func, object, shape, oneOfType, number} from 'prop-types';
import logger from '~/Services/Logger';

const screenWidth = Dimensions.get('window').width;

const ProposalScreen = ({
  navigation,
  userStore: {
    userInfo,
    isDaoMember,
    ...userStore
  },
  bottomSheetStore,
  route: {
    params: {
      commonBalance,
      proposalId,
    },
  },
}) => {
  const [ votingProcessState, setVotingProcessState ] = useState({inProgress: false, error: false});
  const [ proposalInfo, setProposalInfo ] = useState(false);
  const [ proposedUser, setProposedUser ] = useState(false);
  const [ isSending, setIsSending ] = useState(false);
  const [ isMember, setIsMember ] = useState(false);
  const [ isProposer, setIsProposer ] = useState(false);
  const [ showBottomVotingButtonsContainer, setShowBottomVotingButtonsContainer ] = useState(false);
  const renderVoting =
    proposalInfo &&
    PROPOSAL_STAGES_ACTIVE.includes(proposalInfo?.stageStr) &&
    isMember &&
    !proposalInfo.votes.some((vote) => vote.voter === userInfo.safeAddress);


  // Sticky Tab Bar
  const [ showStickyTabBar, setShowStickyTabBar ] = useState(false);
  const stickyTabBarRef = useRef(null);
  const originTabBarRef = useRef(null);

  const [stickyTabBarState] = useState({animation: new Animated.Value(0)});

  // Top voting buttons ref
  const topVotingButtonsRef = useRef(null);

  const scrollViewRef = useRef(null);

  // Values for vote param required from the blockchain
  const VOTE_APPROVE = 1;
  const VOTE_REJECT = 2;

  useEffect(() => {
    let unsubscribe = null;

    const loadProposalInfo = async (currProposalInfo) => {
      let proposedMemberId = null;
      let funding = null;

      if (currProposalInfo.type === PROPOSAL_TYPE.Join) {
        proposedMemberId = currProposalInfo.join.proposedMemberId;
        funding = currProposalInfo.description.funding;
      }
      //FundingRequest proposal
      else {
        const proposedMember = await UserService.getInstance().getUserByAddress(
          currProposalInfo.fundingRequest.beneficiary
        );
        proposedMemberId = proposedMember.id;
        funding = currProposalInfo.fundingRequest.amount;
      }
      const currProposedUser = await UserService.getInstance().getUserById(
        proposedMemberId
      );
      setProposedUser(currProposedUser);
      setProposalInfo({...currProposalInfo, funding});

      navigation.setParams({
        ...(currProposalInfo.type === 'Join' && {
          title: currProposedUser.displayName,
        }),
        subtitle: currProposalInfo.type === 'Join' && 'Request To Join',
      });
    };

    const getProposalInfo = async (currProposalId) => {
      try {
        const currProposalInfo = await ProposalService.getInstance().getProposalInfo(
          currProposalId
        );
        const currentDao = await DaoService.getInstance().getDaoById(currProposalInfo.dao);

        setIsMember(userInfo && isDaoMember(currentDao.members));
        setIsProposer(userStore.isProposer(currProposalInfo));

        await loadProposalInfo(currProposalInfo);
        unsubscribe = await ProposalService.getInstance().subscribeToProposalById(currProposalId,
          async (updatedProposalInfo) => {
            await loadProposalInfo(updatedProposalInfo);
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
  }, [ proposalId ]);

  const [
    isApprovalBottomModalVisible,
    setIsApprovalBottomModalVisible,
  ] = useState(false);

  const [ isVoteByYou, setIsVoteByYou ] = useState(false);
  const [ voteType, setVoteType ] = useState(false);
  const [ index, setIndex ] = useState(0);
  const [ routes ] = useState([
    {index: 0, key: 'info', icon: 'proposal', iconSelected: 'proposal-selected'},
    {index: 1, key: 'discussions', icon: 'discussion', iconSelected: 'discussion-selected'},
  ]);

  const [ inputText, setInputText ] = useState(null);

  const inputRef = useRef();

  const renderTabBar = (currProps) => (
    <View style={{paddingBottom: 5}} />
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
            discussionId: proposalId,
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
                onChangeText={(currText) => setInputText(currText)}
                style={{
                  flex: 1,
                  height: 18,
                  marginHorizontal: 10,
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

  async function timeout(ms) { //pass a time in milliseconds to this function
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const viewUserProfile = () => {
    navigation.navigate('Profile', {userId: proposedUser.uid});
  };

  const onVote = async (isApproved) => {
    setVotingProcessState({inProgress: true, error: false});

    try {
      const voteData = {vote: isApproved ? VOTE_APPROVE : VOTE_REJECT};

      await timeout(3000);

      if (proposalInfo.type === PROPOSAL_TYPE.Join) {
        await ArcService.voteForJoinProposal(
          proposalId,
          voteData
        );
      } else {
        await ArcService.voteForFundingRequestProposal(
          proposalId,
          voteData
        );
      }

      setVotingProcessState({inProgress: false, error: false});
      closeApprovalSheet();
      Toast.done(isApproved ? 'Approved by you' : 'Rejected by you');
      setIsVoteByYou({isApproved: isApproved});

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

  const renderVotingButtons = (reference) => (
    (moment().isBefore(moment.unix(proposalInfo?.closingAt)) || !proposalInfo?.closingAt) && (
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


  const initialLayout = {width: screenWidth};

  const headerContainerStyle = {
    ...layout.content,
    ...{paddingBottom: 0},
    ...proposalInfo.type === PROPOSAL_TYPE.FundingRequest && {...layout.flexStart},
  };

  const [votesFor, votesAgainst] = [+proposalInfo?.votesFor, +proposalInfo?.votesAgainst];

  const progressBarWidthPercent = proposalInfo
    ? (votesFor / (votesFor + votesAgainst) * 100) : 0;


  const votesCount = votesFor + votesAgainst;

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

  const stickyTabBarStyle = {position: 'absolute', top: -80, width: '100%', paddingBottom: 5, zIndex: 999};

  return (
    <React.Fragment>
      <SafeAreaView style={{backgroundColor: colors.white}}/>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <Animated.View style={[stickyTabBarStyle, slideUp]}>
          <TabBarRenderer navigationState={{index, routes}} jumpTo={originTabBarRef.current?.props?.jumpTo} parentRef={originTabBarRef} indexChange={setIndex} />
        </Animated.View>

        <ScrollView
          style={{
            flex: 1,
            backgroundColor: colors.white,
          }}
          ref={scrollViewRef}
          scrollEventThrottle={16}
          onScroll={(e) => {
            //e.nativeEvent.contentOffset.y
            stickyTabBarRef?.current?.measure( (fx, fy, width, height, px, py) => {
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
                  setShowStickyTabBar(isVisible);
                  Animated.timing(stickyTabBarState.animation, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                  }).start();
                }
              }
            });

            topVotingButtonsRef?.current?.measure((fx, fy, width, height, px, py) => {
              setShowBottomVotingButtonsContainer(py < 0);
            });
          }}
        >
          {proposalInfo && (
            <View style={{...headerContainerStyle}}>
              {proposalInfo.type === PROPOSAL_TYPE.FundingRequest ? (
                <View style={{...layout.content, width: '100%', padding: 0}}>
                  <ProposalCardHeader
                    isScreenHeader={true}
                    isBoosted={true}
                    stage={proposalInfo?.stageStr}
                    winningOutcome={proposalInfo?.winningOutcome}
                    closingAt={proposalInfo.closingAt}
                  />

                  <UserAvatar
                    image={proposedUser?.photoURL}
                    displayName={proposedUser?.displayName}
                    imageStyle={{width: 46, height: 46}}
                  />

                  <Text style={{...text.h2Black, ...layout.marginBottomL, ...layout.marginTopXS}}>
                    {proposalInfo?.description?.title || 'Unknown title'}
                  </Text>
                </View>
              ) : (
                <React.Fragment>
                  <ProposalCardHeader
                    isScreenHeader={true}
                    isBoosted={true}
                    stage={proposalInfo?.stageStr}
                    winningOutcome={proposalInfo?.winningOutcome}
                    closingAt={proposalInfo.closingAt}
                  />

                  <UserAvatar
                    image={proposedUser?.photoURL}
                    imageStyle={{width: 64, height: 64}}
                    iconName={'clcok'}
                  />

                  <View style={{...layout.content, ...layout.marginTopS}}>
                    <Text style={text.h2Black}>
                      {proposedUser
                        ? proposedUser.displayName
                        : 'unknown user'
                      }
                    </Text>

                    {proposedUser && (
                      <TouchableOpacity style={{...layout.flexRow, ...layout.marginTopXS}} onPress={viewUserProfile}>
                        <Text style={text.smallBlackText}>View Profile</Text>
                        <Icon name="right-arrow" size={20}/>
                      </TouchableOpacity>
                    )}

                  </View>
                </React.Fragment>
              )}

              <View style={styles.contributionCard}>

                <View style={styles.requestedAmountContainer}>
                  <Text style={{...text.smallBlackText, ...layout.marginRightS}}>
                    {proposalInfo.type === PROPOSAL_TYPE.FundingRequest ?
                      'Requested amount' : 'Contribution'}
                  </Text>
                  <Text style={text.h2Black}>{`$${proposalInfo.type === PROPOSAL_TYPE.FundingRequest
                    ? proposalInfo.fundingRequest.amount / 100
                    : proposalInfo.description.funding / 100}`}
                  </Text>
                </View>
                {proposalInfo.type === PROPOSAL_TYPE.FundingRequest
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
          )}

          <View ref={stickyTabBarRef}>
            <TabView
              navigationState={{index, routes}}
              renderScene={() => null}
              onIndexChange={setIndex}
              initialLayout={initialLayout}
              renderTabBar={renderTabBar}
              style={{backgroundColor: colors.paleGrey}}

            />

            {index === 0 && (
              <ProposalData
                proposalId={proposalId}
                proposalInfo={proposalInfo}
                showMore={() => setIndex(1)}
              />
            )}

            {index === 1 && (
              <ProposalDiscussion
                proposalId={proposalId}
                inputRef={inputRef}
                scrollViewRef={scrollViewRef}
              />
            )}
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
    </React.Fragment>
  );
};

ProposalScreen.propTypes = {
  navigation: object,
  userStore: shape({
    userInfo: object,
    isDaoMember: func,
  }),
  bottomSheetStore: object,
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
    // borderwidth: 1,
    borderBottomWidth: 1,
    // height: 60,
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
    elevation: 4,
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
