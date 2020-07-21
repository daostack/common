import React, {useState, useEffect, useRef} from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Share from 'react-native-share';
import {text, layout, colors, sizeS, sizeL} from '../../../Theme';
import Icon from '../../../Assets/iconfont/Icon';
import {TabView} from 'react-native-tab-view';
import {BOTTOM_SHEET_TEMPLATES} from '../../../Stores/BottomSheetStore';
import CommonStageSummary from '../../../Components/Commons/CommonStageSummary';
import Modal from 'react-native-modal';
import SentTemplate from '../../../Components/ModalTemplates/SentTemplate';
import ProposalApprovalTag from '../../../Components/Proposals/ProposalApprovalTag';
import {CommonActions} from '@react-navigation/native';
import ProposalsList from '../../Proposals/ProposalsList';
import BottomRightButton from '../../../Components/BottomRightButton';
import DiscussionList from '../../Discussions/DiscussionList';
import {observer, inject} from 'mobx-react';
// import HeaderImageScrollView from 'react-native-image-header-scroll-view';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import CommonHeader from '../../../Components/Commons/CommonHeader';
import {numberFormatter} from '../../../Util';
import CommonMembersList from './CommonMembersList';
import ProposalService from '../../../Services/ProposalService';
import CountDown from 'react-native-countdown-component';
import moment from 'moment';
import {calcIsFundingStage} from '../../../Util';
import firestore from '@react-native-firebase/firestore';
import  Toast  from '../../../Util/Toast';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import NavigationBar from 'react-native-navbar';
import {BlurView} from '@react-native-community/blur';
import TabBarRenderer from '../../../Components/TabView/TabBarRenderer';
import ProposalActivationDate from '../../../Components/Proposals/ProposalActivationDate';

const STICKY_HEADER_HEIGHT = 114;

const CommonProfile = ({navigation, route, bottomSheetStore, userStore}) => {
  const [isMember, setMemberState] = useState(false);

  const window = Dimensions.get('window');

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'discussions', title: 'Discussions', icon: 'discussion'},
    {key: 'proposals', title: 'Proposals', icon: 'proposal'},
    {key: 'history', title: 'History', icon: 'history'},
  ]);

  const routeCommon = route.params.currCommon;
  const [currCommon, setCurrCommon] = useState(routeCommon);
  const [showRequestSentModal, setShowRequestSentModal] = useState(false);
  const [pendingProposalsData, setPendingProposalsData] = useState(null);
  const [userPendingPropDiscCount, setUserPendingPropDiscCount] = useState(0);
  const commonId = route.params.currCommon?.id || route.params.commonId;
  const daoMembers = route.params.currCommon?.members;
  const showReqToJoin =
    !userStore.userInfo ||
    (pendingProposalsData && !pendingProposalsData.usersPendingProposal);
  const [ showStickyRequestToJoinBtn, setShowStickyRequestToJoinBtn] = useState(false);
  const isFundingStage = calcIsFundingStage(currCommon?.fundingGoalDeadline);

  const [dark, setDark] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(STICKY_HEADER_HEIGHT);


  const upperRequestToJoinBtnRef = useRef(null);

  // Sticky Tab Bar
  const [showStickyTabBar, setShowStickyTabBar] = useState(false);
  const stickyTabBarRef = useRef(null);
  const originTabBarRef = useRef(null);


  const headerHeightLayouted = height => {
    if (height - headerHeight > 3) {
      // To avoid render multiple times
      // console.log('height ->', height);
      setHeaderHeight(height + 35);
    }
    return height;
  };

  useEffect(() => {
    if (route.params.commonId) {
      const unsubscribe = firestore()
        .collection('daos')
        .doc(commonId)
        .onSnapshot(snapshot => {
          if (snapshot.exists) {
            setCurrCommon(snapshot.data());
          } else {
            Toast.error('This DAO cannot be found try again later');
            navigation.pop();
          }
        });
      return unsubscribe;
    }
  }, [commonId]);

  useEffect(() => {
    setShowRequestSentModal(route.params.showRequestSentModal);
    //setCurrCommon(routeCommon);
    if (userStore.userInfo && userStore.isDaoMember(daoMembers)) {
      setMemberState(true);
    } else {
      setMemberState(false);
    }
  }, [routeCommon, route.params.showRequestSentModal, userStore.userInfo]);

  useEffect(() => {
    if (userStore.userInfo) {
      let unsubscribe = null;
      let getPendingProposalsData = async () => {
        unsubscribe = await ProposalService.getInstance().subscribeToPendingProposalsData(
          commonId,
          userStore.userInfo.safeAddress,
          data => {
            setPendingProposalsData({...data});
          },
        );
      };
      getPendingProposalsData();
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [commonId, isMember, userStore.userInfo]);

  useEffect(() => {
    if (pendingProposalsData && pendingProposalsData.usersPendingProposal) {
      const getPendingProposalsDiscussionCount = async () => {
        const count = await ProposalService.getInstance().getProposalDiscussionsCount(
          pendingProposalsData.usersPendingProposal.id,
        );
        if (userPendingPropDiscCount !== count) {
          setUserPendingPropDiscCount(count);
        }
      };
      getPendingProposalsDiscussionCount();
    }
  }, [pendingProposalsData]);

  const renderTabBar = props => (
    <TabBarRenderer originRef={originTabBarRef} {...props} />
  );

  const Discussions = () => {
    return (
      <View style={{...styles.paleBackground, ...{paddingVertical: sizeL}}}>
        <Text style={text.h1BlackTitle}>Discussions</Text>

        <DiscussionList navigation={navigation} commonId={currCommon.id} />
      </View>
    );
  };

  const Proposals = () => {
    return (
      <View style={{...styles.paleBackground, ...{padding: sizeL}}}>
        <Text style={text.h1BlackTitle}>Proposals</Text>

        <ProposalsList
          onlyFundingRequests={true}
          isMember={isMember}
          navigation={navigation}
          commonId={currCommon.id}
          commonName={currCommon.name}
        />
        <ProposalActivationDate activationDate={currCommon.fundingGoalDeadline} />
      </View>

      
    );
  };

  const History = () => {
    return (
      <View style={{...styles.paleBackground, ...{padding: sizeL}}}>
        <Text style={text.h1BlackTitle}>History</Text>

        <ProposalsList
          isMember={isMember}
          commonName={currCommon.name}
          navigation={navigation}
          commonId={currCommon.id}
          isHistory={true}
        />
      </View>
    );
  };

  const renderScene = scene => {
    switch (scene.route.key) {
    case 'discussions':
      return Discussions();
    case 'proposals':
      return Proposals();
    case 'history':
      return History();
    default:
      return null;
    }
  };

  const openAgendaScreen = e => {
    navigation.navigate('CommonAgenda');
  };

  const renderAgendaForNonMembers = () => {
    if (!isMember) {
      return (
        <View style={styles.agendaBox}>
          <Text style={styles.agendaDescription}>
            {currCommon.metadata.courseOfAction}
          </Text>

          <View style={layout.flexStart}>
            <Text style={text.h1Black}>Our Mission</Text>
            <Text style={{...text.blackText, ...layout.marginTopM}}>
              {currCommon.metadata.description}
            </Text>
          </View>

          <TouchableOpacity onPress={openAgendaScreen} style={layout.marginTopS}>
            <View style={styles.viewAgendaBtn}>
              <Text style={styles.viewFullAgenda}>View full agenda</Text>
              <Icon name="right-arrow" color={colors.black} />
            </View>
          </TouchableOpacity>

        </View>
      );
    }
  };

  const renderMembersRowForMemberUsers = () => {
    if (isMember) {
      return (
        <View style={styles.membersContainerWrapper}>
          <View style={styles.membersContainer}>
            <TouchableOpacity
              onPress={openCommonMembers}
              style={layout.flexRow}>
              <View style={layout.flexRow}>
                <Text style={text.h4Black}>
                  {pendingProposalsData && // just to be showed at the same time
                    currCommon.memberCount +
                      ' ' +
                      `Member${currCommon.memberCount !== 1 ? 's' : ''}`}
                </Text>
              </View>
              <View style={{...layout.flexRow, ...layout.marginLeftS}}>
                <Text style={text.h4BlackRegular}>
                  {pendingProposalsData &&
                    pendingProposalsData.pendingProposalCount}{' '}
                  Pending
                </Text>
                <Icon name="right-arrow" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={openCommonMembers}
              style={styles.membersAction}>
              <View style={styles.membersRow}>
                <CommonMembersList
                  horizontal={true}
                  navigation={navigation}
                  members={
                    daoMembers.length > 5 ? daoMembers.slice(0, 5) : daoMembers
                  }
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  const openCommonMembers = e => {
    navigation.navigate('CommonMembers', {
      members: daoMembers,
      commonId: currCommon.id,
      commonName: currCommon.name,
    });
  };

  const shareCommon = event => {
    const options = {
      url: `https://app.common.io/common/${currCommon.id}`,
      title: "Let's make it happen",
      message: `Join in ${currCommon.name} common`,
    };
    Share.open(options);
  };

  const openCommonOptions = event => {
    bottomSheetStore.showBottomSheet(
      BOTTOM_SHEET_TEMPLATES.SCREEN_COMMON_PROFILE_OPTIONS,
    );
  };

  /*
  const openNotif = event => {
    commonOperationalStateNotifRef.current.snapTo(1);
    commonOperationalStateNotifRef.current.snapTo(1);
  };
  */

  const calcShouldSkipRules = () => {
    const rules = currCommon.metadata?.rules;
    if (rules?.length > 0) {
      return rules.some(rule => rule?.title && rule?.url) ? false : true;
    } else {
      return true;
    }
  };

  const requestToJoin = event => {
    if (userStore.userInfo) {
      const shouldSkipRules = calcShouldSkipRules();
      const navigate = CommonActions.navigate({
        name: shouldSkipRules ? 'RequestStep2' : 'RequestStep1',
        params: {
          currDaoId: currCommon.id,
          skipFirstStep: shouldSkipRules,
        },
      });
      navigation.dispatch(navigate);
    } else {
      bottomSheetStore.showBottomSheet(
        BOTTOM_SHEET_TEMPLATES.LOGIN_SHEET_SCREEN,
      );
    }
  };

  const viewProposal = () => {
    const navigate = CommonActions.navigate({
      name: 'ProposalScreen',
      params: {
        proposalId: route.params.createdProposalId,
        commonName: currCommon.name,
        isMember,
      },
    });
    navigation.dispatch(navigate);
    setShowRequestSentModal(false);
  };

  const goToToCommon = () => {
    setShowRequestSentModal(false);
  };

  const openProposalScreen = event => {
    const navigate = CommonActions.navigate({
      name: 'ProposalScreen',
      params: {
        proposalId: pendingProposalsData.usersPendingProposal?.id,
        commonName: currCommon.name,
        isMember,
      },
    });
    navigation.dispatch(navigate);
  };

  const renderPendingApproval = () => {
    const remainingSeconds =
      pendingProposalsData.usersPendingProposal.closingAt - moment().unix();
    return (
      <TouchableOpacity
        onPress={openProposalScreen}
        style={{
          ...layout.content,
          paddingVertical: 15,
          ...{borderBottomWidth: 1, borderBottomColor: colors.grey4},
        }}>
        <View
          style={{
            ...layout.content,
            ...layout.flexRow,
            ...{padding: 0},
          }}>
          <Icon name="clcok-16" size={16} style={layout.marginRightXS} />
          <Text style={text.smallBoldGreyText}>Pending Approval</Text>
        </View>
        <View
          style={{
            ...layout.flexRow,
            ...layout.marginTopS,
            ...{width: '100%', justifyContent: 'space-between'},
          }}>
          <View style={layout.flexRow}>
            <ProposalApprovalTag
              iconName="approved"
              value={pendingProposalsData.usersPendingProposal.votesFor}
              isMarked={true}
            />
            <ProposalApprovalTag
              iconName="declined"
              value={pendingProposalsData.usersPendingProposal.votesAgainst}
              isMarked={false}
            />
            <ProposalApprovalTag
              iconName="discussion"
              value={userPendingPropDiscCount}
              isMarked={false}
            />
          </View>
          <View>
            <CountDown
              digitTxtStyle={text.smallGreyText}
              separatorStyle={text.smallGreyText}
              timeLabels={false}
              showSeparator={true}
              digitStyle={{
                height: 'auto',
                width: 'auto',
              }}
              until={remainingSeconds}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const loadingPlaceholder = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Placeholder Animation={Fade}>
          <PlaceholderMedia
            style={{height: 200, width: '100%', marginBottom: 20}}
          />
          <PlaceholderMedia
            style={{height: 100, width: '100%', marginBottom: 20}}
          />
          <PlaceholderMedia
            style={{height: 100, width: '100%', marginBottom: 20}}
          />
        </Placeholder>

        <Placeholder Animation={Fade}>
          {[...Array(3).keys()].map(i => {
            return (
              <View key={`common_loading_${i}`}>
                <PlaceholderMedia
                  style={{height: 80 * i, width: '100%', marginBottom: 20}}
                />
                <PlaceholderLine width={80} />
                <PlaceholderLine />
                <PlaceholderLine width={30} />
              </View>
            );
          })}
        </Placeholder>
      </ScrollView>
    );
  };

  const fixedHeaderHeight = () => {
    return (
      <NavigationBar
        statusBar={{hidden: true}}
        style={styles.fixedSection}
        leftButton={
          <TouchableOpacity
            style={{justifyContent: 'center'}}
            onPress={() => navigation.pop()}>
            <BlurView
              style={{padding: 5, borderRadius: 15}}
              blurType={dark ? 'light' : 'dark'}>
              <Icon
                name="left-arrow"
                size={32}
                color={dark ? 'black' : 'white'}
              />
            </BlurView>
          </TouchableOpacity>
        }
        rightButton={
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'space-between',
              marginHorizontal: 10,
            }}>
            <TouchableOpacity
              style={{justifyContent: 'center', marginRight: 5}}
              onPress={shareCommon}>
              <BlurView
                style={{padding: 8, borderRadius: 15}}
                blurType={dark ? 'light' : 'dark'}>
                <Icon
                  name="share-32"
                  size={25}
                  color={dark ? 'black' : 'white'}
                />
              </BlurView>
            </TouchableOpacity>
            <TouchableOpacity
              style={{justifyContent: 'center'}}
              onPress={shareCommon}>
              <BlurView
                style={{padding: 5, borderRadius: 15}}
                blurType={dark ? 'light' : 'dark'}>
                <Icon
                  name="menu-horizontal"
                  size={32}
                  color={dark ? 'black' : 'white'}
                />
              </BlurView>
            </TouchableOpacity>
          </View>
        }
      />
    );
  };

  const renderRequestToJoinBtn = () => {
    return (
      <TouchableOpacity
        style={styles.headerButton}
        onPress={requestToJoin}>
        <Text
          style={{
            fontSize: 16,
            color: 'white',
            fontWeight: '700',
            marginRight: 40,
          }}>
          Request to join
        </Text>
        <Text style={{fontSize: 16, color: 'white'}}>
          ${currCommon.minFeeToJoin / 100} min. contribution
        </Text>
      </TouchableOpacity>);
  };

  const initialLayout = {width: Dimensions.get('window').width};

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      {currCommon ? (
        <View style={{flex: 1, position: 'relative'}}>
          <StatusBar
            barStyle={dark ? 'dark-content' : 'light-content'}
            translucent
            backgroundColor="transparent"
          />
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            onPress={() => navigation.pop()}>
            <Icon
              name="left-arrow"
              size={32}
              color={colors.white}
              style={{marginLeft: 10}}
            />
          </TouchableOpacity>

          {showStickyTabBar && (<View style={{position: 'absolute', top: 70, width: '100%', paddingBottom: 5, zIndex: 999}}>
            <TabBarRenderer navigationState={{index: 0, routes: routes}} parentRef={originTabBarRef} />
          </View>)}

          <ParallaxScrollView
            backgroundColor="white"
            showsVerticalScrollIndicator={false}
            stickyHeaderHeight={STICKY_HEADER_HEIGHT}
            parallaxHeaderHeight={headerHeight}
            renderBackground={() => (
              <FastImage
                source={{
                  uri: currCommon.coverPhoto,
                }}
                style={{
                  width: window.width,
                  height: headerHeight,
                  backgroundColor: colors.grey4,
                }}>
                <View style={{backgroundColor: 'rgba(0,0,0,0.2)', flex: 1}} />
              </FastImage>
            )}
            scrollEvent={e => {
              setDark(
                e.nativeEvent.contentOffset.y > STICKY_HEADER_HEIGHT - 40,
              );
              upperRequestToJoinBtnRef?.current?.measure( (fx, fy, width, height, px, py) => {
                setShowStickyRequestToJoinBtn(py < 36 );
              });
              stickyTabBarRef?.current?.measure( (fx, fy, width, height, px, py) => {
                const isVisible = py < 76;
                if (isVisible != showStickyTabBar) {
                  setShowStickyTabBar(isVisible);
                }
              });

            }}
            renderForeground={() => (
              <CommonHeader
                isMember={isMember}
                navigation={navigation}
                headerHeightLayouted={headerHeightLayouted}
                onHeaderMenuOpen={openCommonOptions}
                commonInfo={{
                  logo: currCommon.metadata?.avatar,
                  name: currCommon.name,
                  description: currCommon.description,
                  byline: currCommon.metadata?.byline,
                  cover: currCommon.coverPhoto,
                }}
              />
            )}
            renderStickyHeader={() => (
              <View key="sticky-header" style={styles.stickySection}>
                <Text style={styles.stickySectionText}>{currCommon.name}</Text>
              </View>
            )}
            renderFixedHeader={fixedHeaderHeight}>
            {!isMember &&
              pendingProposalsData &&
              pendingProposalsData.usersPendingProposal &&
              renderPendingApproval()}

            <View style={{paddingVertical: sizeS}}>
              <CommonStageSummary
                isFundingStage={isFundingStage}
                commonProgressInfo={{
                  time: currCommon.fundingGoalDeadline,
                  activeProposals:
                    currCommon.numberOfBoostedProposals +
                    currCommon.numberOfPreBoostedProposals +
                    currCommon.numberOfQueuedProposals,
                  /* goal: currCommon.fundingGoal, */
                  members: currCommon.memberCount,
                  // TODO: get this value. Is it even tracked in the contract? need to check.
                  raised: currCommon.balance,
                  currentBudget: numberFormatter(
                    // TODO: get the actual balance of the DAO: https://daostack1.atlassian.net/browse/CM-331
                    currCommon.tokenTotalSupply,
                  ),
                }}
              />
            </View>

            {!isMember && showReqToJoin && (
              <View style={styles.upperActionButtonContainer} ref={upperRequestToJoinBtnRef}>
                {renderRequestToJoinBtn()}
              </View>
            )}
            {renderMembersRowForMemberUsers()}
            {renderAgendaForNonMembers()}
            {/**
        <TouchableOpacity
          style={{
            ...styles.headerButton,
            ...{
              justifyContent: 'center',
              marginBottom: 20,
              marginHorizontal: 100,
            },
          }}
          onPress={openProposalScreen}>
          <Text
            style={{
              fontSize: 16,
              color: 'white',
              fontWeight: '700',
            }}>
            Open Proposal
          </Text>
        </TouchableOpacity>

      */}

            <View ref={stickyTabBarRef}>
              <TabView
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabBar={renderTabBar}
                style={
                  {
                    backgroundColor: colors.paleGrey,
                  }
                }
              />
            </View>
          </ParallaxScrollView>

          <SafeAreaView>
            {isMember ? (
              index === 0 ? (
                <BottomRightButton
                  onPress={() =>
                    navigation.navigate('New Topic', {
                      commonId: currCommon.id,
                    })
                  }
                  bottom={50}
                />
              ) : (
                !isFundingStage && (
                  <BottomRightButton
                    onPress={() =>
                      navigation.navigate('FundingProposal', {
                        commonId: currCommon.id,
                      })
                    }
                    bottom={50}
                  />
                )
              )
            ) : (
              <>
                {showStickyRequestToJoinBtn && showReqToJoin && (
                  <View style={styles.actionButtonContainer}>
                    {renderRequestToJoinBtn()}
                  </View>
                )}
                <Modal
                  isVisible={showRequestSentModal}
                  avoidKeyboard={true}
                  backdropColor={colors.white}
                  backdropOpacity={1}
                  onBackdropPress={() => setShowRequestSentModal(false)}
                  style={{padding: 0}}>
                  <SentTemplate
                    title="Request Sent"
                    description="The common members will vote on your request to join, and if approved you will become an equal member with voting rights."
                    onClose={() => setShowRequestSentModal(false)}>
                    <View style={layout.flexRow}>
                      <TouchableOpacity
                        style={styles.modalRequestSentBtnPrimary}
                        onPress={viewProposal}>
                        <Text style={text.buttoncenterwhite}>
                          View proposal
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={layout.flexRow}>
                      <TouchableOpacity
                        style={styles.modalRequestSentBtnOutline}
                        onPress={goToToCommon}>
                        <Text style={text.buttonblue}>Go to Common</Text>
                      </TouchableOpacity>
                    </View>
                  </SentTemplate>
                </Modal>
              </>
            )}
          </SafeAreaView>
        </View>
      ) : (
        loadingPlaceholder()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  paleBackground: {
    backgroundColor: colors.paleGrey,
  },
  viewAgendaBtn: {
    ...layout.content,
    ...layout.flexRow,
    justifyContent: 'flex-start',
    padding: 0,
  },
  viewFullAgenda: {
    ...text.h3Black,
    color: colors.mainBlue,
    fontSize: 16,
    marginRight: 5,
  },
  modalRequestSentBtnOutline: {
    ...layout.btnOutline,
    ...layout.marginTopL,
    flexGrow: 0,
    width: '100%',
    alignSelf: 'stretch',
  },
  modalRequestSentBtnPrimary: {
    ...layout.btnPrimary,
    ...layout.marginTopL,
    flexGrow: 0,
    width: '100%',
  },
  memberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.white,
  },
  membersRow: {
    ...layout.flexRow,
  },
  membersContainerWrapper: {
    paddingHorizontal: 20,
  },
  membersContainer: {
    ...layout.content,
    paddingVertical: 0,
    borderTopWidth: 1,
    borderColor: colors.grey4,
    paddingTop: sizeS,
  },
  membersAction: {
    ...layout.content,
    ...layout.flexRow,
    paddingHorizontal: 0,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  tabStyle: {
    ...text.ashleyjquimbacom2,
  },
  tabStyleActive: {
    ...text.ashleyjquimbacom2,

    color: colors.mainBlue,
  },
  upperActionButtonContainer: {
    paddingHorizontal: 20,
  },
  actionButtonContainer: {
    padding: 20,
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
  },
  agendaBox: {
    padding: 20,
    paddingTop: 0,
  },
  agendaDescription: {
    marginBottom: 9,
  },
  readMoreButton: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
  },
  commonNumbers: {
    ...layout.content,
    ...layout.flexRow,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerButton: {
    height: 48,
    borderRadius: 32,
    flexDirection: 'row',
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,

    shadowColor: 'rgba(79, 92, 105, 0.1)',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 4,
    shadowOpacity: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 20,
    ...layout.content,
    backgroundColor: colors.mainBlue,
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    width: '100%',
    justifyContent: 'center',
    // backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
  },
  stickySectionText: {
    color: 'black',
    // color: 'white',
    fontFamily: 'NotoSerif-Bold',
    fontWeight: '500',
    fontSize: 20,
    marginTop: 25,
    // margin: 5,
    textAlign: 'center',
  },
  fixedSection: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 5,
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20,
  },
});

export default inject(
  'bottomSheetStore',
  'daoStore',
  'userStore',
)(observer(CommonProfile));
