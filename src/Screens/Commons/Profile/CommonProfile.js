import React, {useEffect, useRef, useState} from 'react';
import {
  LayoutAnimation,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Share from 'react-native-share';
import {colors, font, layout, sizeL, sizeS, text} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import {TabView} from 'react-native-tab-view';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import CommonStageSummary from '~/Components/Commons/CommonStageSummary';
import Modal from 'react-native-modal';
import SentTemplate from '~/Components/ModalTemplates/SentTemplate';
import ProposalApprovalTag from '~/Components/Proposals/ProposalApprovalTag';
import {CommonActions} from '@react-navigation/native';
import ProposalsList from '../../Proposals/ProposalsList';
import BottomRightButton from '~/Components/BottomRightButton';
import DiscussionList from '../../Discussions/DiscussionList';
import {inject, observer} from 'mobx-react';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import CommonHeader from '~/Components/Commons/CommonHeader';
import {calcIsFundingStage, LAYOUT_ANIMATION_CONFIG} from '~/Util';
import CommonMembersList from './CommonMembersList';
import ProposalService from '~/Services/ProposalService';
import ModerationService from '~/Services/ModerationService';
import CountDown from 'react-native-countdown-component';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import {object, shape, func} from 'prop-types';
import NavigationBar from 'react-native-navbar';
import TabBarRenderer from '~/Components/TabView/TabBarRenderer';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import ProposalActivationDate from '~/Components/Proposals/ProposalActivationDate';
import {BlurView} from '~/Components';
import Logger from '~/Services/Logger';
import moment from 'moment';
import {PROPOSAL_TYPE, PROPOSAL_STAGE} from '~/Config';
import * as ModerationForm from '~/Components/Forms/ModerationForm';
import {reporterName, timeReported} from '~/Components/Moderation/Reported';
import ModerationActionSuccessModal from '~/Components/Moderation/ModerationActionSuccessModal';
import ModerationModal from '~/Components/Moderation/ModerationModal';
import Toast from '~/Util/Toast.js';

import {
  IntroduceYourselfFormStore,
  PersonalContributionFormStore,
  BillingDetailsFormStore,
  PaymentFormStore,
} from '~/FormStores/RequestToJoin';
import {rootStorePropTypes} from '~/Types/propTypes';
import ModerationFormStore from '~/FormStores/ModerationFormStore';
const {width} = Dimensions.get('window');

let stickyHeightAddon = 56;
const STICKY_HEADER_HEIGHT =
  Math.round(getStatusBarHeight(true)) + stickyHeightAddon;
const DEFAULT_HEADER_HEIGHT = STICKY_HEADER_HEIGHT + 100;

const CommonProfile = ({navigation, route: {params}, rootStore}) => {
  /* all of  params.commonId,
  params.showRequestSentModal,
  params.createdProposalId
  are undefined
  is this sth we plan on having in future?
   */

  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;
  const authStore = rootStore.authStore;
  const commonStore = rootStore.commonStore;
  const proposalStore = rootStore.proposalStore;
  const discussionStore = rootStore.discussionStore;
  const userStore = rootStore.userStore;

  const [isMember, setMemberState] = useState(false);
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [showModerationSuccessModal, setShowModerationSuccessModal] = useState(
    false,
  );
  const [moderationFormStore] = useState(new ModerationFormStore());
  const [moderationType, setModerationType] = useState('Discussion');
  const [action, setAction] = useState('Report');

  const {refreshFeed} = params;

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      index: 0,
      key: 'discussions',
      title: 'Discussions',
      icon: 'discussion',
      iconSelected: 'discussion-selected',
    },
    {
      index: 1,
      key: 'proposals',
      title: 'Proposals',
      icon: 'proposal',
      iconSelected: 'proposal-selected',
    },
    {
      index: 2,
      key: 'history',
      title: 'History',
      icon: 'history',
      iconSelected: 'history-selected',
    },
  ]);

  //const routeCommon = params.currCommon;
  Logger.log('Common id ->', params.currCommon);
  const currCommon = commonStore.getCommonById(
    params.commonId || params.currCommon?.id,
  );
  const [showRequestSentModal, setShowRequestSentModal] = useState(false);
  const [showReqToJoin, setShowRequestToJoin] = React.useState(false);
  const [showPending, setShowPending] = React.useState(false);
  const [pendingProposalsData, setPendingProposalsData] = useState(null);
  const [userPendingPropDiscCount, setUserPendingPropDiscCount] = useState(0);
  const commonId = currCommon?.id;
  const [showStickyRequestToJoinBtn, setShowStickyRequestToJoinBtn] = useState(
    false,
  );
  const isFundingStage = calcIsFundingStage(currCommon?.fundingGoalDeadline);

  const [dark, setDark] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(DEFAULT_HEADER_HEIGHT);

  const upperRequestToJoinBtnRef = useRef(null);

  // Sticky Tab Bar
  const [showStickyTabBar, setShowStickyTabBar] = useState(false);
  const stickyTabBarRef = useRef(null);
  const originTabBarRef = useRef(null);
  const [stickyTabBarState] = useState({animation: new Animated.Value(0)});
  const [isHeaderClosingInProgress, setIsHeaderClosingInProgress] = useState(
    false,
  );

  // right now, has permission is about user being the owner, this may change in the future
  const [hasPermission, setHasPermission] = useState(
    authStore?.userInfo?.uid === currCommon?.metadata.founderId,
  );

  const headerHeightLayouted = (height) => height;

  const animateNextStateRender = () => {
    Platform.OS === 'ios' &&
      LayoutAnimation.configureNext(LAYOUT_ANIMATION_CONFIG);
  };

  useEffect(() => {
    const unsubscribeFromCommonProposals = proposalStore.subscribeToCommonProposals(
      currCommon.id,
    );
    const unsubscribeFromCommonDiscussions = discussionStore.subscribeToCommonDiscussions(
      currCommon.id,
    );
    return () => {
      unsubscribeFromCommonProposals && unsubscribeFromCommonProposals();
      unsubscribeFromCommonDiscussions && unsubscribeFromCommonDiscussions();
    };
  }, [currCommon]);

  useEffect(() => {
    setShowRequestSentModal(params.showRequestSentModal);
    if (authStore.userInfo && authStore.isDaoMember(currCommon?.members)) {
      setMemberState(true);
      setHeaderHeight(DEFAULT_HEADER_HEIGHT + stickyHeightAddon);
    } else {
      setMemberState(false);
      setHeaderHeight(DEFAULT_HEADER_HEIGHT);
    }
    setHasPermission(
      authStore?.userInfo?.uid === currCommon?.metadata.founderId,
    );
  }, [params.showRequestSentModal, authStore.userInfo, currCommon?.members]);

  useEffect(() => {
    let unsubscribe = null;
    let getPendingProposalsData = async () => {
      unsubscribe = await ProposalService.getInstance().subscribeToPendingProposalsData(
        commonId,
        authStore.userInfo?.uid,
        (data) => {
          setPendingProposalsData({...data});

          if (!isMember) {
            if (data) {
              if (data.usersPendingProposal) {
                animateNextStateRender();
                setShowPending(true);

                animateNextStateRender();
                setShowRequestToJoin(false);
              } else {
                animateNextStateRender();
                setShowRequestToJoin(true);
              }
            }
          }
        },
      );
    };

    getPendingProposalsData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [commonId, isMember, authStore.userInfo]);

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
    <TabBarRenderer
      originRef={originTabBarRef}
      jumpTo={originTabBarRef.current?.props?.jumpTo}
      indexChange={setIndex}
      {...props}
    />
  );

  const Discussions = () => (
    <View style={{...styles.paleBackground, ...{paddingVertical: sizeL}}}>
      <Text style={text.h1BlackTitle}>Discussions</Text>
      <DiscussionList
        navigation={navigation}
        commonId={currCommon.id}
        hasPermission={hasPermission}
        openCommonOptions={(discussion) =>
          openCommonOptions(discussion, 'Discussion')
        }
        showHiddenNote={(hiddenDiscussion) =>
          showHiddenNote(hiddenDiscussion, 'Discussion')
        }
      />
    </View>
  );

  const Proposals = () => (
    <View style={{...styles.paleBackground, padding: sizeL}}>
      <Text style={text.h1BlackTitle}>Proposals</Text>

      <ProposalsList
        navigation={navigation}
        commonInfo={{
          name: currCommon.name,
          id: currCommon.id,
          balance: currCommon.balance,
        }}
        proposalFilter={{
          stage: PROPOSAL_STAGE.Active,
          type: PROPOSAL_TYPE.FundingRequest,
        }}
        hasPermission={hasPermission}
        openCommonOptions={(proposal) =>
          openCommonOptions(proposal, 'Proposals')
        }
        showHiddenNote={(hiddenProposal) =>
          showHiddenNote(hiddenProposal, 'Proposal')
        }
      />

      {isMember && (
        <ProposalActivationDate
          activationDate={currCommon.fundingGoalDeadline}
          bottomSheetStore={bottomSheetStore}
        />
      )}
    </View>
  );

  const History = () => (
    <View style={{...styles.paleBackground, ...{padding: sizeL}}}>
      <Text style={text.h1BlackTitle}>History</Text>

      <ProposalsList
        navigation={navigation}
        commonInfo={{
          name: currCommon.name,
          id: currCommon.id,
          balance: currCommon.balance,
        }}
        proposalFilter={{
          stage: PROPOSAL_STAGE.History,
          type: PROPOSAL_TYPE.FundingRequest,
        }}
        showHiddenNote={(hiddenProposal) =>
          showHiddenNote(hiddenProposal, 'Proposal')
        }
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

  const openAgendaScreen = () => {
    navigation.navigate('CommonAgenda', {
      screenTitle: currCommon.name,
      common: currCommon,
    });
  };

  const renderAgendaForNonMembers = () => {
    if (!isMember) {
      return (
        <View style={styles.agendaBox}>
          <View style={layout.flexStart}>
            <Text style={text.h2Black}>About</Text>
            <Text
              style={{
                ...text.regularText,
                ...layout.marginTopS,
                ...text.writingDirection(currCommon.metadata.description),
              }}>
              {currCommon.metadata.description}
            </Text>
          </View>

          <TouchableOpacity
            onPress={openAgendaScreen}
            style={layout.marginTopS}>
            <View style={styles.viewAgendaBtn}>
              <Text style={styles.viewFullAgenda}>View full agenda</Text>
              <Icon
                style={styles.icon}
                name="right-arrow"
                color={colors.mainBlue}
              />
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderMembersRow = () => (
    <View style={styles.membersContainerWrapper}>
      <View
        style={{
          ...styles.membersContainer,
          paddingTop: !isMember ? sizeL : sizeS,
          paddingBottom: isMember ? 0 : sizeL,
        }}>
        {pendingProposalsData ? (
          <TouchableOpacity onPress={openCommonMembers} style={layout.flexRow}>
            <View style={layout.flexRow}>
              <Text style={text.h4Black}>
                {`${currCommon?.members?.length} Member${
                  currCommon?.members?.length !== 1 ? 's' : ''
                }`}
              </Text>
            </View>
            <View style={{...layout.flexRow, ...layout.marginLeftS}}>
              <Text style={text.h4BlackRegular}>
                {`${pendingProposalsData.pendingProposalCount}  Pending`}
              </Text>
              <Icon name="right-arrow" />
            </View>
          </TouchableOpacity>
        ) : (
          <Placeholder Animation={Fade}>
            <PlaceholderLine
              width={50}
              height={9}
              style={{alignSelf: 'center'}}
            />
          </Placeholder>
        )}
        {isMember && (
          <TouchableOpacity
            onPress={openCommonMembers}
            style={styles.membersAction}>
            <View style={styles.membersRow}>
              <CommonMembersList
                horizontal={true}
                navigation={navigation}
                commonId={currCommon.id}
                limit={5}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const openCommonMembers = (e) => {
    navigation.navigate('CommonMembers', {
      commonId: currCommon.id,
      screenTitle: currCommon.name,
      hasPermission,
      openCommonOptions: (requestToJoin) =>
        openCommonOptions(requestToJoin, 'Membership request'),
      showHiddenNote: (hiddenRequestToJoin) =>
        showHiddenNote(hiddenRequestToJoin, 'Membership request'),
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

  const onEdit = (type) => {
    bottomSheetStore.hideBottomSheet();
    type === 'info'
      ? navigateTo('Edit info and cover photo')
      : navigateTo('Edit Rules');
  };

  /**
   * For other types of items
   * @param  {[type]} actionType [description]
   * @param  {String} itemType   [description]
   * @param  {[type]} itemId     [description]
   * @return {[type]}            [description]
   */
  const onModerate = async (actionType, itemType = '', itemId = null) => {
    setAction(actionType);
    bottomSheetStore.hideBottomSheet();

    switch (actionType) {
      case 'Show':
        Toast.loading('Loading...');
        await ModerationService.getInstance().show(
          itemId,
          commonId,
          itemType.toLowerCase(),
        );
        Toast.hide();
        Toast.success('Done');
        setShowModerationSuccessModal(true);
        break;
      case 'Hide':
        Toast.loading('Hiding content...');
        await ModerationService.getInstance().hide(
          itemId,
          itemType.toLowerCase(),
          commonId,
        );
        Toast.hide();
        Toast.success('Done');
        setShowModerationSuccessModal(true);
        break;
      default:
        // reporting
        setShowModerationModal(true);
        break;
    }
  };

  const membershipRequestType = (itemType) =>
    itemType === 'Membership request' ? 'Proposals' : itemType;

  // consider adding itemId to edit (?)
  const openCommonOptions = (item = null, itemType = '') => {
    if (item) {
      moderationFormStore.clearFormStoreState();
      moderationFormStore.registerFormField(
        ModerationForm.ITEM_ID,
        'string',
        item.id,
      );
    }
    setModerationType(itemType);

    bottomSheetStore.showBottomSheet(
      BOTTOM_SHEET_TEMPLATES.SCREEN_COMMON_PROFILE_OPTIONS,
      {
        onAction: item
          ? (actionType) =>
              onModerate(actionType, membershipRequestType(itemType), item.id)
          : (type) => onEdit(type),
        hasPermission,
        moderatorOptions: {
          item,
        },
      },
    );
  };

  const onReportContent = async () => {
    setShowModerationModal(false);
    bottomSheetStore.hideBottomSheet();
    Toast.loading('Reporting content...');

    await ModerationService.getInstance().report(
      membershipRequestType(moderationType).toLowerCase(),
      commonId,
      moderationFormStore.getFormFieldsJson(),
    );
    Toast.hide();
    Toast.success('Done');
    setShowModerationSuccessModal(true);
    moderationFormStore.clearFormStoreState();
  };

  const showHiddenNote = (hiddenItem, type) => {
    const {moderation} = hiddenItem;
    bottomSheetStore.showBottomSheet(
      BOTTOM_SHEET_TEMPLATES.HIDDEN_CONTENT_INFO,
      {
        userName: reporterName(userStore.getUserById(moderation.moderator)),
        date: timeReported(moderation.updatedAt),
        reasons: moderation.reasons,
        moderatorNote: moderation?.note,
        type,
      },
    );
  };

  const getType = (type) => (type === 'Proposals' ? 'Proposal' : type);

  const navigateTo = (screenTitle) => {
    navigation.navigate('EditCommon', {
      currCommon: currCommon,
      title: screenTitle,
    });
  };

  /*
  const openNotif = event => {
    commonOperationalStateNotifRef.current.snapTo(1);
    commonOperationalStateNotifRef.current.snapTo(1);
  };
  */

  const calcShouldSkipRules = () => {
    const rules = currCommon?.rules;
    if (rules?.length > 0) {
      // NOTE: value of multiple fields was stored in url prop before
      return !rules.some((rule) => rule?.title && (rule?.value || rule.url));
    } else {
      return true;
    }
  };

  const requestToJoin = (event) => {
    if (authStore.userInfo) {
      const shouldSkipRules = calcShouldSkipRules();

      const introduceYourselfFormStore = new IntroduceYourselfFormStore();
      const paymentFormStore = new PaymentFormStore();
      const personalContributionFormStore = new PersonalContributionFormStore();
      const billingDetailsFormStore = new BillingDetailsFormStore();

      const navigate = CommonActions.navigate({
        name: shouldSkipRules ? 'IntroductionStep' : 'RulesStep',
        params: {
          formStores: {
            paymentFormStore,
            introduceYourselfFormStore,
            personalContributionFormStore,
            billingDetailsFormStore,
          },
          currCommon: currCommon,
          currDaoId: currCommon.id,
          skipFirstStep: shouldSkipRules,
          refreshFeed,
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
      proposalId: params.createdProposalId,
    });

    setShowRequestSentModal(false);
  };

  const goToToCommon = () => {
    setShowRequestSentModal(false);
  };

  const openProposalScreen = () => {
    navigation.navigate('ProposalScreen', {
      proposalId: pendingProposalsData.usersPendingProposal?.id,
    });
  };

  const renderPendingApproval = () => {
    const remainingSeconds =
      pendingProposalsData.usersPendingProposal.createdAt.seconds +
      pendingProposalsData.usersPendingProposal.countdownPeriod -
      moment().unix();

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
          <Icon name="clcok" size={16} style={layout.marginRightXS} />
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
              value={Number(
                pendingProposalsData.usersPendingProposal.votesFor || 0,
              )}
              isMarked={true}
            />
            <ProposalApprovalTag
              iconName="declined"
              value={Number(
                pendingProposalsData.usersPendingProposal.votesAgainst || 0,
              )}
              isMarked={false}
            />
            <ProposalApprovalTag
              iconName="discussion"
              value={Number(userPendingPropDiscCount || 0)}
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

  const loadingPlaceholder = () => (
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
        {[...Array(3).keys()].map((i) => (
          <View key={`common_loading_${i}`}>
            <PlaceholderMedia
              style={{height: 80 * i, width: '100%', marginBottom: 20}}
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
      statusBar={{hidden: true}}
      containerStyle={{
        ...styles.fixedSection,
        ...{bottom: showStickyTabBar || isHeaderClosingInProgress ? 85 : 5},
      }}
      leftButton={
        <TouchableOpacity
          style={{justifyContent: 'center'}}
          onPress={() => navigation.pop()}>
          <BlurView style={{padding: 5, borderRadius: 15}} isBlurring={dark}>
            <Icon
              name="left-arrow"
              size={32}
              color={dark ? 'black' : 'white'}
            />
          </BlurView>
        </TouchableOpacity>
      }
      rightButton={
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={{justifyContent: 'center', marginRight: 10}}
            onPress={shareCommon}>
            <BlurView style={{padding: 5, borderRadius: 15}} isBlurring={dark}>
              <Icon
                name="share-32"
                size={32}
                color={dark ? 'black' : 'white'}
              />
            </BlurView>
          </TouchableOpacity>
          {hasPermission && (
            <TouchableOpacity
              style={{justifyContent: 'center', marginRight: 10}}
              onPress={() => openCommonOptions()}>
              <BlurView
                style={{
                  padding: 6,
                  borderRadius: 15,
                }}
                isBlurring={dark}>
                <Icon name="menu1" size={30} color={dark ? 'black' : 'white'} />
              </BlurView>
            </TouchableOpacity>
          )}
        </View>
      }
    />
  );

  const renderRequestToJoinBtn = () => (
    <TouchableOpacity style={styles.headerButton} onPress={requestToJoin}>
      <Text style={styles.requestToJoin}>Request to join</Text>
      <Text style={styles.contribution}>
        ${currCommon.metadata.minFeeToJoin / 100}
        {currCommon.metadata.contributionType === 'monthly' && '/mo'} min.
        contribution
      </Text>
    </TouchableOpacity>
  );

  const initialLayout = {width};

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

  const stickyTabBarStyle = {
    position: 'absolute',
    top: Platform.OS === 'android' ? -25 : 0,
    width: '100%',
    paddingBottom: 5,
    zIndex: 1,
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <ModerationModal
        title={moderationType}
        visible={showModerationModal}
        setShowModerationModal={() => setShowModerationModal(false)}
        moderationFormStore={moderationFormStore}
        onReportContent={() => onReportContent()}
      />
      <ModerationActionSuccessModal
        type={getType(moderationType)}
        visible={showModerationSuccessModal}
        setShowModerationSuccessModal={() =>
          setShowModerationSuccessModal(false)
        }
        action={action}
      />
      {currCommon ? (
        <View style={{flex: 1, position: 'relative'}}>
          <TouchableOpacity
            onPress={() => navigation.pop()}
            style={{
              justifyContent: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
            }}>
            <Icon
              name="left-arrow"
              size={32}
              color={colors.white}
              style={{marginLeft: 10}}
            />
          </TouchableOpacity>

          <ParallaxScrollView
            contentContainerStyle={{position: 'relative', zIndex: 99}}
            backgroundColor="white"
            showsVerticalScrollIndicator={false}
            stickyHeaderHeight={
              showStickyTabBar || isHeaderClosingInProgress
                ? STICKY_HEADER_HEIGHT + 80
                : STICKY_HEADER_HEIGHT
            }
            parallaxHeaderHeight={headerHeight}
            renderBackground={() => (
              <FastImage
                source={{
                  uri: currCommon.image,
                }}
                style={{
                  width: width,
                  height: headerHeight,
                  backgroundColor: colors.grey4,
                }}>
                <View style={{backgroundColor: 'rgba(0,0,0,0.2)', flex: 1}} />
              </FastImage>
            )}
            scrollEvent={(e) => {
              setDark(e.nativeEvent.contentOffset.y > STICKY_HEADER_HEIGHT);
              upperRequestToJoinBtnRef?.current?.measure(
                (fx, fy, width, height, px, py) => {
                  setShowStickyRequestToJoinBtn(py < stickyHeightAddon);
                },
              );
              stickyTabBarRef?.current?.measure(
                (fx, fy, width, height, px, py) => {
                  const isVisible = py < STICKY_HEADER_HEIGHT - 80;
                  if (isVisible !== showStickyTabBar) {
                    if (isVisible) {
                      setShowStickyTabBar(isVisible);
                      Animated.timing(stickyTabBarState.animation).stop();
                      Animated.timing(stickyTabBarState.animation, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                      }).start();
                    } else if (!isHeaderClosingInProgress) {
                      setIsHeaderClosingInProgress(true);
                      setShowStickyTabBar(isVisible);
                      Animated.timing(stickyTabBarState.animation).stop();
                      Animated.timing(stickyTabBarState.animation, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                      }).start(({finished}) => {
                        setIsHeaderClosingInProgress(!finished);
                      });
                    }
                  }
                },
              );
            }}
            renderForeground={() => (
              <CommonHeader
                isMember={isMember}
                navigation={navigation}
                headerHeightLayouted={headerHeightLayouted}
                onHeaderMenuOpen={() => openCommonOptions()}
                commonInfo={{
                  logo: currCommon.metadata?.avatar,
                  name: currCommon.name,
                  description: currCommon.description,
                  byline: currCommon.metadata?.byline,
                  cover: currCommon.image,
                }}
                common={currCommon}
                canEdit={hasPermission}
                onEdit={onEdit}
              />
            )}
            renderStickyHeader={() => (
              <View style={{height: '100%'}}>
                <Animated.View style={[stickyTabBarStyle, slideUp]}>
                  <TabBarRenderer
                    navigationState={{index, routes}}
                    jumpTo={originTabBarRef.current?.props?.jumpTo}
                    parentRef={originTabBarRef}
                    indexChange={setIndex}
                  />
                </Animated.View>
                <View key="sticky-header" style={styles.stickySection}>
                  <Text style={styles.stickySectionText}>
                    {currCommon.name}
                  </Text>
                </View>
              </View>
            )}
            renderFixedHeader={fixedHeaderHeight}>
            {showPending && (
              <React.Fragment>
                {pendingProposalsData?.usersPendingProposal &&
                  renderPendingApproval()}
              </React.Fragment>
            )}

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
                  members: currCommon?.members?.length,
                  balance: currCommon.balance,
                  raised: currCommon.raised,
                }}
              />
            </View>

            {renderMembersRow()}

            {!isMember && showReqToJoin && (
              <View
                style={styles.upperActionButtonContainer}
                ref={upperRequestToJoinBtnRef}
                collapsable={false}>
                {renderRequestToJoinBtn()}
              </View>
            )}

            {renderAgendaForNonMembers()}

            <View ref={stickyTabBarRef} collapsable={false}>
              <TabView
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabBar={renderTabBar}
                style={{
                  backgroundColor: colors.paleGrey,
                }}
              />
            </View>
          </ParallaxScrollView>

          <SafeAreaView>
            {isMember ? (
              index === 0 ? (
                <BottomRightButton
                  iconName="add-proposal-32"
                  onPress={() =>
                    navigation.navigate('New Post', {
                      commonId: currCommon.id,
                    })
                  }
                  bottom={50}
                />
              ) : (
                !isFundingStage &&
                index === 1 && (
                  <BottomRightButton
                    iconName="create-proposal"
                    onPress={() =>
                      navigation.navigate('FundingProposal', {
                        commonId: currCommon.id,
                        common: currCommon,
                        screenTitle: currCommon.name,
                      })
                    }
                    bottom={50}
                  />
                )
              )
            ) : (
              <React.Fragment>
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
                    hideLogo
                    title="Membership request sent"
                    description="The common members will vote on your membership request. If it's approved, you will become a member with equal voting rights."
                    onClose={() => setShowRequestSentModal(false)}>
                    <View>
                      <TouchableOpacity
                        style={styles.modalRequestSentBtnPrimary}
                        onPress={viewProposal}>
                        <Text style={text.buttoncenterwhite}>View request</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.modalRequestSentBtnOutline}
                        onPress={goToToCommon}>
                        <Text style={styles.backButton}>Back to Common</Text>
                      </TouchableOpacity>
                    </View>
                  </SentTemplate>
                </Modal>
              </React.Fragment>
            )}
          </SafeAreaView>
        </View>
      ) : (
        loadingPlaceholder()
      )}
    </View>
  );
};

CommonProfile.propTypes = {
  navigation: object.isRequired,
  route: shape({
    params: shape({
      currCommon: object,
      refreshFeed: func,
    }),
  }),
  rootStore: rootStorePropTypes,
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
    paddingTop: 20,
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
    paddingHorizontal: 10,
    justifyContent: 'space-around',
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
    paddingBottom: 10,
    justifyContent: 'flex-end',
    height: STICKY_HEADER_HEIGHT,
    borderBottomWidth: 1,
    backgroundColor: colors.white,
    borderBottomColor: colors.grey4,
    zIndex: 99,
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

export default inject('rootStore')(observer(CommonProfile));
