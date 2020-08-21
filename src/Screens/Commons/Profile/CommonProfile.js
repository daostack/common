import React, { useState, useEffect, useRef } from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Share from 'react-native-share';
import { TabView } from 'react-native-tab-view';
import Modal from 'react-native-modal';
import { CommonActions } from '@react-navigation/native';
import { observer, inject } from 'mobx-react';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import CountDown from 'react-native-countdown-component';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import NavigationBar from 'react-native-navbar';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {
  text, layout, colors, sizeS, sizeL, font,
} from '../../../Theme';
import Icon from '../../../Assets/iconfont/Icon';
import { BOTTOM_SHEET_TEMPLATES } from '../../../Stores/BottomSheetStore';
import CommonStageSummary from '../../../Components/Commons/CommonStageSummary';
import SentTemplate from '../../../Components/ModalTemplates/SentTemplate';
import ProposalApprovalTag from '../../../Components/Proposals/ProposalApprovalTag';
import ProposalsList from '../../Proposals/ProposalsList';
import BottomRightButton from '../../../Components/BottomRightButton';
import DiscussionList from '../../Discussions/DiscussionList';
// import HeaderImageScrollView from 'react-native-image-header-scroll-view';
import CommonHeader from '../../../Components/Commons/CommonHeader';
import { numberFormatter, calcIsFundingStage } from '../../../Util';
import CommonMembersList from './CommonMembersList';
import ProposalService from '../../../Services/ProposalService';

import Toast from '../../../Util/Toast';
import TabBarRenderer from '../../../Components/TabView/TabBarRenderer';
import ProposalActivationDate from '../../../Components/Proposals/ProposalActivationDate';
import { BlurView } from '../../../Components';

const stickyHeighAddon = 36;

const STICKY_HEADER_HEIGHT = Math.round(getStatusBarHeight()) + stickyHeighAddon;
const DEFAULT_HEADER_HEIGHT = STICKY_HEADER_HEIGHT + 100;

const CommonProfile = ({
  navigation, route, bottomSheetStore, userStore,
}) => {
  const [isMember, setMemberState] = useState(false);
  const window = Dimensions.get('window');

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'discussions', title: 'Discussions', icon: 'discussion', iconSelected: 'discussion-selected',
    },
    {
      key: 'proposals', title: 'Proposals', icon: 'proposal', iconSelected: 'proposal-selected',
    },
    {
      key: 'history', title: 'History', icon: 'history', iconSelected: 'history-selected',
    },
  ]);

  const routeCommon = route.params.currCommon;
  const [currCommon, setCurrCommon] = useState(routeCommon);
  const [showRequestSentModal, setShowRequestSentModal] = useState(false);
  const [pendingProposalsData, setPendingProposalsData] = useState(null);
  const [userPendingPropDiscCount, setUserPendingPropDiscCount] = useState(0);
  const commonId = currCommon?.id;
  const daoMembers = currCommon?.members;
  const showReqToJoin = !userStore.userInfo
    || (pendingProposalsData && !pendingProposalsData.usersPendingProposal);
  const [showStickyRequestToJoinBtn, setShowStickyRequestToJoinBtn] = useState(false);
  const isFundingStage = calcIsFundingStage(currCommon?.fundingGoalDeadline);

  const [dark, setDark] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(DEFAULT_HEADER_HEIGHT);

  const upperRequestToJoinBtnRef = useRef(null);

  // Sticky Tab Bar
  const [showStickyTabBar, setShowStickyTabBar] = useState(false);
  const stickyTabBarRef = useRef(null);
  const originTabBarRef = useRef(null);

  // setHeaderHeight(height + 35);

  const headerHeightLayouted = (height) => {
    if (height - headerHeight > 3) {
      // To avoid render multiple times
      // console.log('height ->', height);
      // setHeaderHeight(height + 35);
    }
    return height;
  };

  useEffect(() => {
    if (route.params.commonId) {
      const unsubscribe = firestore()
        .collection('daos')
        .doc(route.params.commonId)
        .onSnapshot((snapshot) => {
          if (snapshot.exists) {
            setCurrCommon(snapshot.data());
          } else {
            Toast.error('This DAO cannot be found try again later');
            navigation.pop();
          }
        });
      return unsubscribe;
    }
  }, [route.params.commonId]);

  useEffect(() => {
    setShowRequestSentModal(route.params.showRequestSentModal);
    if (userStore.userInfo && userStore.isDaoMember(daoMembers)) {
      setMemberState(true);
      setHeaderHeight(DEFAULT_HEADER_HEIGHT + 36);
    } else {
      setMemberState(false);
      setHeaderHeight(DEFAULT_HEADER_HEIGHT);
    }
  }, [
    route.params.showRequestSentModal,
    userStore.userInfo,
    daoMembers,
  ]);

  useEffect(() => {
    let unsubscribe = null;
    const getPendingProposalsData = async () => {
      unsubscribe = await ProposalService.getInstance().subscribeToPendingProposalsData(
        commonId,
        userStore.userInfo?.safeAddress,
        (data) => {
          setPendingProposalsData({ ...data });
        },
      );
    };

    getPendingProposalsData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
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

  const renderTabBar = (props) => (
    <TabBarRenderer originRef={originTabBarRef} {...props} />
  );

  const Discussions = () => (
    <View style={{ ...styles.paleBackground, ...{ paddingVertical: sizeL } }}>
      <Text style={text.h1BlackTitle}>Discussions</Text>
      <DiscussionList navigation={navigation} commonId={currCommon.id} />
    </View>
  );

  const Proposals = () => (
    <View style={{ ...styles.paleBackground, ...{ padding: sizeL } }}>
      <Text style={text.h1BlackTitle}>Proposals</Text>

      <ProposalsList
        onlyFundingRequests
        isMember={isMember}
        navigation={navigation}
        commonInfo={{ name: currCommon.name, id: currCommon.id, balance: currCommon.balance }}
      />
      <ProposalActivationDate activationDate={currCommon.fundingGoalDeadline} />
    </View>
  );

  const History = () => (
    <View style={{ ...styles.paleBackground, ...{ padding: sizeL } }}>
      <Text style={text.h1BlackTitle}>History</Text>

      <ProposalsList
        isMember={isMember}
        commonInfo={{ name: currCommon.name, id: currCommon.id, balance: currCommon.balance }}
        navigation={navigation}
        onlyFundingRequests
        isHistory
      />
    </View>
  );

  const renderScene = (scene) => {
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

  const openAgendaScreen = (e) => {
    navigation.navigate('CommonAgenda', {
      screenTitle: currCommon.name,
    });
  };

  const renderAgendaForNonMembers = () => {
    if (!isMember) {
      return (
        <View style={styles.agendaBox}>
          <Text style={styles.agendaDescription}>
            {currCommon.metadata.courseOfAction}
          </Text>

          <View style={layout.flexStart}>
            <Text style={text.h2Black}>About</Text>
            <Text style={{ ...text.regularText, ...layout.marginTopS }}>
              {currCommon.metadata.description}
            </Text>
          </View>

          <TouchableOpacity onPress={openAgendaScreen} style={layout.marginTopS}>
            <View style={styles.viewAgendaBtn}>
              <Text style={styles.viewFullAgenda}>View full agenda</Text>
              <Icon style={styles.icon} name="right-arrow" color={colors.mainBlue} />
            </View>
          </TouchableOpacity>

        </View>
      );
    }
  };

  const renderMembersRow = () => (
    <View style={styles.membersContainerWrapper}>
      <View style={{ ...styles.membersContainer, paddingTop: !isMember ? sizeL : sizeS, paddingBottom: isMember ? 0 : sizeL }}>
        <TouchableOpacity
          onPress={openCommonMembers}
          style={layout.flexRow}
        >
          <View style={layout.flexRow}>
            <Text style={text.h4Black}>
              {pendingProposalsData// just to be showed at the same time
                    && `${currCommon.memberCount
                    } `
                      + `Member${currCommon.memberCount !== 1 ? 's' : ''}`}
            </Text>
          </View>
          <View style={{ ...layout.flexRow, ...layout.marginLeftS }}>
            <Text style={text.h4BlackRegular}>
              {pendingProposalsData
                    && pendingProposalsData.pendingProposalCount}
              {' '}
              Pending
            </Text>
            <Icon name="right-arrow" />
          </View>
        </TouchableOpacity>
        {isMember && (
          <TouchableOpacity
            onPress={openCommonMembers}
            style={styles.membersAction}
          >
            <View style={styles.membersRow}>
              <CommonMembersList
                horizontal
                navigation={navigation}
                members={
                  daoMembers.length > 5 ? daoMembers.slice(0, 5) : daoMembers
                }
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const openCommonMembers = (e) => {
    navigation.navigate('CommonMembers', {
      members: daoMembers,
      commonId: currCommon.id,
      screenTitle: currCommon.name,
    });
  };

  const shareCommon = (event) => {
    const options = {
      url: `https://app.common.io/common/${currCommon.id}`,
      title: "Let's make it happen",
      message: `${currCommon.name} common`,
    };
    Share.open(options);
  };

  const openCommonOptions = (event) => {
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
      return !rules.some((rule) => rule?.title && rule?.url);
    }
    return true;
  };

  const requestToJoin = (event) => {
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
    navigation.navigate('ProposalScreen', {
      proposalId: route.params.createdProposalId,
      screenTitle: currCommon.name,
      commonBalance: currCommon.balance,
      isMember,
    });

    setShowRequestSentModal(false);
  };

  const goToToCommon = () => {
    setShowRequestSentModal(false);
  };

  const openProposalScreen = (event) => {
    navigation.navigate('ProposalScreen', {
      proposalId: pendingProposalsData.usersPendingProposal?.id,
      screenTitle: currCommon.name,
      commonBalance: currCommon.balance,
      isMember,
    });
  };

  const renderPendingApproval = () => {
    const remainingSeconds = pendingProposalsData.usersPendingProposal.closingAt - moment().unix();
    return (
      <TouchableOpacity
        onPress={openProposalScreen}
        style={{
          ...layout.content,
          paddingVertical: 15,
          ...{ borderBottomWidth: 1, borderBottomColor: colors.grey4 },
        }}
      >
        <View
          style={{
            ...layout.content,
            ...layout.flexRow,
            ...{ padding: 0 },
          }}
        >
          <Icon name="clcok" size={16} style={layout.marginRightXS} />
          <Text style={text.smallBoldGreyText}>Pending Approval</Text>
        </View>
        <View
          style={{
            ...layout.flexRow,
            ...layout.marginTopS,
            ...{ width: '100%', justifyContent: 'space-between' },
          }}
        >
          <View style={layout.flexRow}>
            <ProposalApprovalTag
              iconName="approved"
              value={pendingProposalsData.usersPendingProposal.votesFor}
              isMarked
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
              showSeparator
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

  const loadingPlaceholder = () => (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Placeholder Animation={Fade}>
        <PlaceholderMedia
          style={{ height: 200, width: '100%', marginBottom: 20 }}
        />
        <PlaceholderMedia
          style={{ height: 100, width: '100%', marginBottom: 20 }}
        />
        <PlaceholderMedia
          style={{ height: 100, width: '100%', marginBottom: 20 }}
        />
      </Placeholder>

      <Placeholder Animation={Fade}>
        {[...Array(3).keys()].map((i) => (
          <View key={`common_loading_${i}`}>
            <PlaceholderMedia
              style={{ height: 80 * i, width: '100%', marginBottom: 20 }}
            />
            <PlaceholderLine width={80} />
            <PlaceholderLine />
            <PlaceholderLine width={30} />
          </View>
        ))}
      </Placeholder>
    </ScrollView>
  );

  const fixedHeaderHeight = () => (
    <NavigationBar
      statusBar={{ hidden: true }}
      containerStyle={styles.fixedSection}
      leftButton={(
        <TouchableOpacity
          style={{ justifyContent: 'center' }}
          onPress={() => navigation.pop()}
        >
          <BlurView style={{ padding: 5, borderRadius: 15 }} isBlurring={dark}>
            <Icon
              name="left-arrow"
              size={32}
              color={dark ? 'black' : 'white'}
            />
          </BlurView>
        </TouchableOpacity>
        )}
      rightButton={(
        <View
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <TouchableOpacity
            style={{ justifyContent: 'center', marginRight: 10 }}
            onPress={shareCommon}
          >
            <BlurView style={{ padding: 5, borderRadius: 15 }} isBlurring={dark}>
              <Icon
                name="share-32"
                size={32}
                color={dark ? 'black' : 'white'}
              />
            </BlurView>
          </TouchableOpacity>
          {/* <TouchableOpacity
              style={{justifyContent: 'center'}}
              onPress={shareCommon}>
              <BlurView
                style={{padding: 5, borderRadius: 15}}
                isBlurring={dark}>
                <Icon
                  name="menu-horizontal"
                  size={32}
                  color={dark ? 'black' : 'white'}
                />
              </BlurView>
            </TouchableOpacity> */}
        </View>
        )}
    />
  );

  const renderRequestToJoinBtn = () => (
    <TouchableOpacity
      style={styles.headerButton}
      onPress={requestToJoin}
    >
      <Text
        style={styles.requestToJoin}
      >
        Request to join
      </Text>
      <Text style={styles.contribution}>
        $
        {currCommon.metadata.minFeeToJoin / 100}
        {' '}
        min. contribution
      </Text>
    </TouchableOpacity>
  );

  const initialLayout = { width: Dimensions.get('window').width };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      {currCommon ? (
        <View style={{ flex: 1, position: 'relative' }}>

          <TouchableOpacity
            style={{
              justifyContent: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            onPress={() => navigation.pop()}
          >
            <Icon
              name="left-arrow"
              size={32}
              color={colors.white}
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>

          {showStickyTabBar && (
          <View style={{
            position: 'absolute', top: STICKY_HEADER_HEIGHT, width: '100%', paddingBottom: 5, zIndex: 999,
          }}
          >
            <TabBarRenderer navigationState={{ index: 0, routes }} parentRef={originTabBarRef} />
          </View>
          )}

          <ParallaxScrollView
            backgroundColor="white"
            showsVerticalScrollIndicator={false}
            stickyHeaderHeight={STICKY_HEADER_HEIGHT}
            parallaxHeaderHeight={headerHeight}
            renderBackground={() => (
              <FastImage
                source={{
                  uri: currCommon.coverPhoto || currCommon?.metadata?.image,
                }}
                style={{
                  width: window.width,
                  height: headerHeight,
                  backgroundColor: colors.grey4,
                }}
              >
                <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', flex: 1 }} />
              </FastImage>
            )}
            scrollEvent={(e) => {
              // console.log("Scroll e -> ", e);
              setDark(
                e.nativeEvent.contentOffset.y > STICKY_HEADER_HEIGHT,
              );
              upperRequestToJoinBtnRef?.current?.measure((fx, fy, width, height, px, py) => {
                setShowStickyRequestToJoinBtn(py < (stickyHeighAddon));
              });
              stickyTabBarRef?.current?.measure((fx, fy, width, height, px, py) => {
                const isVisible = py < (STICKY_HEADER_HEIGHT);
                if (isVisible !== showStickyTabBar) {
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
            renderFixedHeader={fixedHeaderHeight}
          >
            {!isMember
              && pendingProposalsData
              && pendingProposalsData.usersPendingProposal
              && renderPendingApproval()}

            <View style={{ paddingVertical: sizeS }}>
              <CommonStageSummary
                isFundingStage={isFundingStage}
                commonProgressInfo={{
                  time: currCommon.fundingGoalDeadline,
                  activeProposals:
                    currCommon.numberOfBoostedProposals
                    + currCommon.numberOfPreBoostedProposals
                    + currCommon.numberOfQueuedProposals,
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

            {renderMembersRow()}

            {!isMember && showReqToJoin && (
              <View style={styles.upperActionButtonContainer} ref={upperRequestToJoinBtnRef} collapsable={false}>
                {renderRequestToJoinBtn()}
              </View>
            )}

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

            <View ref={stickyTabBarRef} collapsable={false}>
              <TabView
                navigationState={{ index, routes }}
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
                  iconName="add-proposal-32"
                  onPress={() => navigation.navigate('New Post', {
                    commonId: currCommon.id,
                  })}
                  bottom={50}
                />
              ) : (
                !isFundingStage && index === 1 && (
                  <BottomRightButton
                    iconName="create-proposal"
                    onPress={() => navigation.navigate('FundingProposal', {
                      commonId: currCommon.id,
                      common: currCommon,
                      screenTitle: currCommon.name,
                    })}
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
                  avoidKeyboard
                  backdropColor={colors.white}
                  backdropOpacity={1}
                  onBackdropPress={() => setShowRequestSentModal(false)}
                  style={{ padding: 0 }}
                >
                  <SentTemplate
                    title="Membership request sent"
                    description="The common members will vote on your membership request. If it's approved, you will become a member with equal voting rights."
                    onClose={() => setShowRequestSentModal(false)}
                  >
                    <View>
                      <TouchableOpacity
                        style={styles.modalRequestSentBtnPrimary}
                        onPress={viewProposal}
                      >
                        <Text style={text.buttoncenterwhite}>
                          View proposal
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.modalRequestSentBtnOutline}
                        onPress={goToToCommon}
                      >
                        <Text style={styles.backButton}>Back to Common</Text>
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
    backgroundColor: '#fcfcfc',
  },
  requestToJoin: {
    ...font.primary.bold,
    color: colors.white,
    ...font.fontSize(3),
    marginRight: 40,
  },
  viewAgendaBtn: {
    ...layout.content,
    ...layout.flexRow,
    justifyContent: 'flex-start',
    padding: 0,
  },
  contribution: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.white,
  },
  viewFullAgenda: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.mainBlue,
  },
  modalRequestSentBtnOutline: {
    ...layout.btnOutline,
    ...layout.marginTopL,
    flexGrow: 0,
    width: '100%',
    alignSelf: 'stretch',
  },
  backButton: {
    ...font.primary.regular,
    ...font.fontSize(3),
    color: colors.black,
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
  },
  membersAction: {
    ...layout.content,
    ...layout.flexRow,
    paddingHorizontal: 0,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  icon: {
    marginTop: 2,
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
    ...font.primary.bold,
    ...font.fontSize(3),
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
    elevation: 4,
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    borderBottomWidth: 1,
    backgroundColor: colors.white,
    borderBottomColor: colors.grey4,
  },
  stickySectionText: {
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    ...font.heading.bold,
    fontSize: 20,
    color: colors.black,
    textAlign: 'center',
  },
  fixedSection: {
    width: '100%',
    position: 'absolute',
    bottom: 10,
    left: 5,
    backgroundColor: 'transparent',
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
