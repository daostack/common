import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import { text, layout, colors, sizeM, sizeS, sizeXS, font } from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import { TabView } from 'react-native-tab-view';
import ProposalData from './ProposalData';
import ProposalDiscussion from './ProposalDiscussion';
import ApprovalSheetScreen from '../BottomSheetScreens/ApprovalSheetScreen';
import Toast from '../../Util/Toast';
import BottomSheetModal from '../../Components/BottomSheetModal';
import ProposalService from '../../Services/ProposalService';
import ArcService from '../../Services/ArcService';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const { width } = Dimensions.get('window');
import { UserAvatar } from '../../Components';

import FirebaseService from '../../Services/FirebaseService';
import { PROPOSAL_STAGES_ACTIVE } from '../../Services/ProposalService';
import { PROPOSAL_TYPE } from '../../Services/ProposalService';
import { db } from '../../Firebase';
import { observer, inject } from 'mobx-react';
import TabBarRenderer from '../../Components/TabView/TabBarRenderer';
import moment from 'moment';
import ProposalCardHeader from '../../Components/Proposals/ProposalCardHeader';

const ProposalScreen = ({ navigation, route, userStore, bottomSheetStore, props }) => {
  const [ votingProcessState, setVotingProcessState ] = useState({ inProgress: false, error: false });
  const [ proposalInfo, setProposalInfo ] = useState(false);
  const [ proposedUser, setProposedUser ] = useState(false);
  const [ daoInfo, setDaoInfo ] = useState({});
  const [ isSending, setIsSending ] = useState(false);
  const [ isMember, setIsMember ] = useState(false);
  const [ showBottomVotingButtonsContainer, setShowBottomVotingButtonsContainer ] = useState(false);
  const routeProposalId = route?.params.proposalId;
  const commonBalance = route?.params.commonBalance;
  const renderVoting =
    proposalInfo &&
    PROPOSAL_STAGES_ACTIVE.includes(proposalInfo?.stageStr) &&
    isMember &&
    !proposalInfo.votes.some(
      vote => vote.voter === userStore.userInfo.safeAddress
    );

  // Sticky Tab Bar
  const [ showStickyTabBar, setShowStickyTabBar ] = useState(false);
  const stickyTabBarRef = useRef(null);
  const originTabBarRef = useRef(null);

  // Top voting buttons ref
  const topVotingButtonsRef = useRef(null);

  // Values for vote param required from the blockchain
  const VOTE_APPROVE = 1;
  const VOTE_REJECT = 2;

  useEffect(() => {
    let unsubscribe = null;

    const loadProposalInfo = async (currProposalInfo) => {
      let proposedMemberId = null;
      let funding = null;

      if (currProposalInfo.type === PROPOSAL_TYPE.JoinAndQuit) {
        proposedMemberId = currProposalInfo.joinAndQuit.proposedMemberId;
        funding = currProposalInfo.description.funding;
      }
      //FundingRequest proposal
      else {
        const proposedMember = await FirebaseService.getInstance().getUserByAddress(
          currProposalInfo.fundingRequest.beneficiary
        );
        proposedMemberId = proposedMember.id;
        funding = currProposalInfo.fundingRequest.amount;
      }
      const currProposedUser = await FirebaseService.getInstance().getUserById(
        proposedMemberId
      );

      setProposedUser(currProposedUser);
      setProposalInfo({ ...currProposalInfo, ...{ funding: funding } });
    };

    const getProposalInfo = async proposalId => {
      try {
        let currProposalInfo = await ProposalService.getInstance().getProposalInfo(
          proposalId
        );
        const currentDao = await db.collection('daos').doc(currProposalInfo.dao).get().then((dao) => dao.data());
        const isMember = userStore.userInfo && userStore.isDaoMember(currentDao.members);
        setIsMember(isMember);
        setDaoInfo(currentDao);
        await loadProposalInfo(currProposalInfo);
        unsubscribe = await ProposalService.getInstance().subscribeToProposalById(proposalId,
          async (updatedProposalInfo) => {
            await loadProposalInfo(updatedProposalInfo);
          }
        );

      } catch (error) {
        console.log('error: ', error);
        Toast.error(error?.toString());
      }
    };

    if (routeProposalId) {
      console.log(`proposalId --> ${routeProposalId}`);
      getProposalInfo(routeProposalId);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [ routeProposalId ]);

  const [
    isApprovalBottomModalVisible,
    setIsApprovalBottomModalVisible,
  ] = useState(false);

  const [ isVoteByYou, setIsVoteByYou ] = useState(false);
  const [ voteType, setVoteType ] = useState(false);
  const [ index, setIndex ] = useState(0);
  const [ routes ] = useState([
    { key: 'info', icon: 'proposal', iconSelected: 'proposal-selected' },
    { key: 'discussions', icon: 'discussion', iconSelected: 'discussion-selected' },
  ]);

  const [ inputHeight, setInputHeight ] = useState(60);
  const [ inputText, setInputText ] = useState(null);

  const inputRef = useRef();

  const renderTabBar = currProps => (
    <View style={{ paddingBottom: 5 }}>
      <TabBarRenderer originRef={originTabBarRef} {...currProps}/>
    </View>
  );
  const hasPassedExpiryDate = moment().isAfter(moment.unix(proposalInfo?.closingAt));

  const messageInput = () => {
    const sendMessageToDiscussion = async () => {

      if (isSending || !userInfo?.uid) {
        return;
      }
      setIsSending(true);

      const userInfo = auth().currentUser;
      const message = inputText;
      if (message && message.trim().length) {
        firestore()
          .collection('discussionMessage')
          .doc()
          .set({
            text: message,
            createTime: new Date(),
            ownerId: userInfo.uid,
            ownerName: userInfo.displayName,
            ownerAvatar: userInfo.photoURL,
            discussionId: routeProposalId,
          })
          .then(() => {
            inputRef.current.clear();
            Keyboard.dismiss();
            setIsSending(false);
          })
          .catch(error => {
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
      viewStyle = { ...viewStyle, ...{ borderBottomWidth: 0 } };
    }

    return (
      <KeyboardAvoidingView
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ position: 'absolute', bottom: 0, flex: 1, color: '#fbfdff' }}>
        <View style={viewStyle}>
          {isMember ? (
            <View style={styles.inputBorder}>
              <TextInput
                ref={inputRef}
                editable={true}
                multiline={true}
                onContentSizeChange={e =>
                  setInputHeight(e.nativeEvent.contentSize.height)
                }
                style={{ flex: 1, height: inputHeight, marginHorizontal: 10 }}
                fontSize={15}
                onChangeText={currText => setInputText(currText)}
              />
              <TouchableOpacity
                style={{ paddingRight: 15, justifyContent: 'center' }}
                onPress={sendMessageToDiscussion}>
                <Icon
                  name="edit"
                  size={20}
                  color={
                    inputText && inputText.trim()
                      ? colors.mainBlue
                      : colors.grey3
                  }
                />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={{ ...styles.joinCommonText }}>
              {'Only members can send messages'}
            </Text>
          )}
        </View>
        <View style={{ height: 30, backgroundColor: colors.white }}/>
      </KeyboardAvoidingView>
    );
  };

  const openApprovalSheet = isApproval => {
    setVoteType(isApproval);
    setIsApprovalBottomModalVisible(true);
  };

  const closeApprovalSheet = e => {
    setIsApprovalBottomModalVisible(false);
  };

  async function timeout(ms) { //pass a time in milliseconds to this function
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const viewUserProfile = () => {
    navigation.navigate('Profile', { userId: proposedUser.uid });
  };

  const onVote = async isApproved => {
    setVotingProcessState({ inProgress: true, error: false });

    try {
      // let votingResponse = null;
      const voteData = { vote: isApproved ? VOTE_APPROVE : VOTE_REJECT };

      await timeout(3000);

      if (proposalInfo.type === PROPOSAL_TYPE.JoinAndQuit) {
        await ArcService.getInstance().voteForJoinAndQuitProposal(
          routeProposalId,
          voteData
        );
      } else {
        await ArcService.getInstance().voteForFundingRequestProposal(
          routeProposalId,
          voteData
        );
      }

      // console.log('votingResponse -> ', votingResponse);
      setVotingProcessState({ inProgress: false, error: false });
      closeApprovalSheet();
      Toast.done(isApproved ? 'Approved by you' : 'Rejected by you');
      setIsVoteByYou({ isApproved: isApproved });

    } catch (err) {
      setVotingProcessState({ inProgress: false, error: true });
      console.log(err);
      //closeApprovalSheet();
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
        <View style={{ ...layout.content, ...layout.flexRow, ...{ padding: 0 } }}>
          <Icon
            name={iconName}
            color={color}
            size={12}
            style={layout.marginRightS}
          />
          <Text style={{ ...styles.votedByYouText, ...{ color: color } }}>
            {message}
          </Text>
        </View>
      );
    } else {
      return (
        !hasPassedExpiryDate
        && <View style={styles.stickyVotingContainer}>{renderVotingButtons()}</View>
      );
    }
  };

  const renderVotingButtons = (reference) => {
    return (moment().isBefore(moment.unix(proposalInfo?.closingAt)) || !proposalInfo?.closingAt)
      ? (
        <View ref={reference} style={{ ...layout.content, padding: 0, width: '100%' }}>
          <Text style={reference ? styles.topSheetVotingText : styles.bottomSheetVotingText}>Whats your vote?</Text>
          <View style={layout.flexRow}>
            <TouchableOpacity
              onPress={e => openApprovalSheet(true)}
              style={{ ...styles.actionBtnStyle, ...layout.marginRightS }}>
              <Icon name="approved-24" color={colors.lightishGreen} size={24}/>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={e => openApprovalSheet(false)}
              style={{ ...styles.actionBtnStyle, ...layout.marginLeftS }}>
              <Icon name="reject-24" color={colors.against} size={24}/>
            </TouchableOpacity>
          </View>
        </View>
      ) : null;
  };


  const initialLayout = { width: Dimensions.get('window').width };

  const headerContainerStyle =
    proposalInfo.type === PROPOSAL_TYPE.FundingRequest
      ? {
        ...layout.content,
        ...layout.flexStart,
        ...{ paddingBottom: 0 },
      }
      : {
        ...layout.content,
        ...{ paddingBottom: 0 },
      };


  let progressBarWidthPercent = 0;

  if (proposalInfo) {
    progressBarWidthPercent =
      (proposalInfo.votesFor /
        (proposalInfo.votesFor + proposalInfo.votesAgainst)) *
      100;
  }

  const votesCount = proposalInfo.votesFor + proposalInfo.votesAgainst;

  return (
    <>
      <SafeAreaView style={{ backgroundColor: colors.white }}/>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        {showStickyTabBar && (
          <View style={{ position: 'absolute', top: 0, width: '100%', paddingBottom: 5, zIndex: 999 }}>
            <TabBarRenderer navigationState={{ index: 0, routes: routes }} parentRef={originTabBarRef}/>
          </View>)}
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: colors.white,
          }}
          scrollEventThrottle={16}
          onScroll={(e) => {
            //e.nativeEvent.contentOffset.y
            stickyTabBarRef?.current?.measure((fx, fy, width, height, px, py) => {
              const isVisible = py < 76;
              if (isVisible !== showStickyTabBar) {
                setShowStickyTabBar(isVisible);
              }
            });

            topVotingButtonsRef?.current?.measure((fx, fy, width, height, px, py) => {
              setShowBottomVotingButtonsContainer(py < 0);
            });
          }}>
          {proposalInfo && (
            <View style={{ ...headerContainerStyle }}>
              {proposalInfo.type === PROPOSAL_TYPE.FundingRequest ? (
                <View style={{ ...layout.content, ...{ width: '100%', padding: 0 } }}>
                  <ProposalCardHeader
                    isScreenHeader={true}
                    isBoosted={true}
                    stage={proposalInfo?.stageStr}
                    winningOutcome={proposalInfo?.winningOutcome}
                    hasPassedExpiryDate={hasPassedExpiryDate}
                    closingAt={proposalInfo.closingAt}
                  />
                  <UserAvatar
                    image={proposedUser?.photoURL}
                    displayName={proposedUser?.displayName}
                    imageStyle={{ width: 46, height: 46 }}
                  />
                  <Text style={{ ...text.h2Black, ...layout.marginBottomL, ...layout.marginTopXS }}>
                    {proposalInfo?.description?.title || 'Unknown title'}
                  </Text>
                </View>
              ) : (
                <>
                  <ProposalCardHeader
                    isScreenHeader={true}
                    isBoosted={true}
                    stage={proposalInfo?.stageStr}
                    winningOutcome={proposalInfo?.winningOutcome}
                    hasPassedExpiryDate={hasPassedExpiryDate}
                    closingAt={proposalInfo.closingAt}
                  />
                  <UserAvatar
                    image={proposedUser?.photoURL}
                    imageStyle={{ width: 64, height: 64 }}
                    iconName={'clcok'}
                  />
                  <View style={{ ...layout.content, ...layout.marginTopS }}>
                    <Text style={{ ...text.h2Black }}>
                      {proposedUser ? proposedUser.displayName : 'unknown user'}
                    </Text>

                    {proposedUser ?
                      <TouchableOpacity style={{ ...layout.flexRow, ...layout.marginTopXS }} onPress={viewUserProfile}>
                        <Text style={text.smallBlackText}>View Profile</Text>
                        <Icon name="right-arrow" size={20}/>
                      </TouchableOpacity>
                      : null}

                  </View>
                </>
              )}

              <View style={styles.contributionCard}>

                <View style={styles.requestedAmountContainer}>
                  <Text style={{ ...text.smallBlackText, ...layout.marginRightS }}>
                    {proposalInfo.type === PROPOSAL_TYPE.FundingRequest ?
                      'Requested amount' : 'Contribution'}
                  </Text>
                  <Text style={text.h2Black}>{`$${
                    proposalInfo.type === PROPOSAL_TYPE.FundingRequest
                      ? proposalInfo.fundingRequest.amount / 100
                      : proposalInfo.description.funding / 100
                  }`}
                  </Text>
                </View>
                {proposalInfo.type === PROPOSAL_TYPE.FundingRequest
                  ? <Text
                    style={text.smallBlackText}>{`Available funds: ${commonBalance !== undefined ? '$' + commonBalance / 100 : ''}`}</Text>
                  : null
                }

              </View>

              <View style={{ ...layout.content, width: '100%', paddingHorizontal: 0 }}>

                <View style={styles.proposalProgressInfo}>
                  <View
                    style={{ ...layout.content, ...layout.flexRow, ...{ padding: 0 } }}>
                    <Icon
                      name="user-approved"
                      color={colors.lightishGreen}
                      size={25}
                      style={layout.marginRightXS}
                    />
                    <Text style={text.lightishGreenText}>
                      {proposalInfo.votesFor}
                    </Text>
                  </View>

                  <Text style={text.smallBlackText}>
                    {votesCount === 0 ? 'No votes yet' : `${votesCount} ${votesCount > 1 ? 'votes' : 'vote'}`}
                  </Text>

                  <View
                    style={{ ...layout.content, ...layout.flexRow, ...{ padding: 0 } }}>
                    <Text style={text.againstText}>
                      {proposalInfo.votesAgainst}
                    </Text>
                    <Icon
                      name="user-rejected"
                      color={colors.against}
                      size={25}
                      style={layout.marginLeftXS}
                    />
                  </View>
                </View>
                <View style={{
                  ...styles.proposalProgressBar,
                  ...{ backgroundColor: isNaN(progressBarWidthPercent) ? colors.grey4 : colors.against },
                }}>
                  <View
                    style={{
                      ...styles.proposalInnerProgressBar,
                      ...{
                        width: `${progressBarWidthPercent}%`,
                      },
                    }}
                  />
                </View>
              </View>

              <View style={{ ...layout.flexRow, justifyContent: 'space-between', width: '100%' }}>
                {renderVoting && renderVotingButtons(topVotingButtonsRef)}
              </View>

            </View>
          )}

          <View ref={stickyTabBarRef}>
            <TabView
              navigationState={{ index, routes }}
              renderScene={() => null}
              onIndexChange={setIndex}
              initialLayout={initialLayout}
              renderTabBar={renderTabBar}
              style={
                {
                  backgroundColor: colors.paleGrey,
                }
              }
            />
            {index === 0 && (
              <ProposalData
                proposalId={routeProposalId}
                proposalInfo={proposalInfo}
                showMore={() => setIndex(1)}
              />
            )}
            {index === 1 && (
              <ProposalDiscussion
                proposalId={routeProposalId}
                inputRef={inputRef}
              />
            )}
          </View>
        </ScrollView>

        {index === 0 ?
          renderVoting && showBottomVotingButtonsContainer
          && <View style={styles.actionButtonContainer}>
            {renderStickyBottomContent()}
          </View>

          : (
            <>{messageInput()}</>
          )}
      </SafeAreaView>
      {/**
       <BottomSheetContainer ref={boostedInfoRef} topSnapPoint={620}>
       <BoostedInfo />
       </BottomSheetContainer>
       */}

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
    </>
  );
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
  //Proposal progressbar style

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

  // Old styles
  tabStyle: {
    ...text.ashleyjquimbacom2,
  },
  tabStyleActive: {
    ...text.ashleyjquimbacom2,

    color: colors.mainBlue,
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

  actionBtnRed: {
    ...text.buttonblue,
    color: colors.against,
  },

  actionBtnGreen: {
    ...text.buttonblue,
    color: colors.lightishGreen,
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
    width: width,
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
  },
});


export default inject(
  'userStore',
  'bottomSheetStore'
)(observer(ProposalScreen));
