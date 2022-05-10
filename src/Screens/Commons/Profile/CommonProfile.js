import React, {useEffect, useRef, useState, useMemo, useCallback} from 'react';
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
} from 'react-native';
import {colors, font, layout, sizeL, sizeS, text} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import {TabView, SceneMap} from 'react-native-tab-view';
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
import CommonHeader from '~/Components/Commons/CommonHeader';
import {LAYOUT_ANIMATION_CONFIG} from '~/Util';
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
import TabBarRenderer from '~/Components/TabView/TabBarRenderer';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import moment from 'moment';
import {PROPOSAL_TYPE, PROPOSAL_STAGE} from '~/Config';
import * as ModerationForm from '~/Components/Forms/ModerationForm';
import {reporterName, timeReported} from '~/Components/Moderation/helper';
import ModerationActionSuccessModal from '~/Components/Moderation/ModerationActionSuccessModal';
import ModerationModal from '~/Components/Moderation/ModerationModal';
import Toast from '~/Util/Toast';
import {TITLES, ACTIONS, ENTITY_TYPES} from '~/Components/Moderation/constants';
import {COMMON_OPTION_TYPES} from '~/Screens/Commons/components/onModalTypes';

import {
  IntroduceYourselfFormStore,
  PersonalContributionFormStore,
  BillingDetailsFormStore,
  PaymentFormStore,
} from '~/Stores/FormStores/RequestToJoin';
import {rootStorePropTypes} from '~/Types/propTypes';
import ModerationFormStore from '~/Stores/FormStores/ModerationFormStore';
import {truncateString} from '~/Util/stringUtil';
import {ABOUT_TRUNCATE_LENGTH} from '~/Util/constants/strings';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';
import BottomSheetModal from '~/Components/BottomSheetModal';
import {ModalCommonOptions} from '../components/ModalCommonOptions';
import {ModalDeleteConfirmation} from '../components/ModalDeleteConfirmation';
import {CurrencySymbols} from '~/Util/locale';
import {HEADER_BUTTON_HEIGHT} from '~/Screens/Commons/components/commonConstants';

import {CommonProfileFlatList} from './CommonProfileFlatList';

const {width} = Dimensions.get('window');

let stickyHeightAddon = 62;
let statusBarHeight = Math.round(getStatusBarHeight(true));
const STICKY_HEADER_HEIGHT = statusBarHeight + stickyHeightAddon;

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
  const [showModerationSuccessModal, setShowModerationSuccessModal] =
    useState(false);
  const [moderationFormStore] = useState(new ModerationFormStore());
  const [moderationType, setModerationType] = useState(TITLES.discussion);
  const [action, setAction] = useState(ACTIONS.report);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [deleteScreenOn, setDeleteScreenOn] = useState(false);

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

  const currCommon = commonStore.getCommonById(
    params.commonId || params.currCommon?.id,
  );
  const [showRequestSentModal, setShowRequestSentModal] = useState(false);
  const [showReqToJoin, setShowRequestToJoin] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [pendingProposalsData, setPendingProposalsData] = useState(null);
  const [userPendingPropDiscCount, setUserPendingPropDiscCount] = useState(0);
  const commonId = currCommon?.id;

  const upperRequestToJoinBtnRef = useRef(null);

  // Sticky Tab Bar
  const stickyTabBarRef = useRef(null);
  const originTabBarRef = useRef(null);

  // checking if user is the founder or had moderator permissions
  const [hasPermission, setHasPermission] = useState(
    authStore.getPermission(commonId, authStore?.userInfo?.uid),
  );

  const headerHeightLayouted = (height) => height;

  const animateNextStateRender = () => {
    Platform.OS === 'ios' &&
      LayoutAnimation.configureNext(LAYOUT_ANIMATION_CONFIG);
  };

  useEffect(() => {
    let unsubscribeFromCommonProposals = null;
    let unsubscribeFromCommonDiscussions = null;
    if (currCommon?.id) {
      unsubscribeFromCommonProposals = proposalStore.subscribeToCommonProposals(
        currCommon?.id,
      );
      unsubscribeFromCommonDiscussions =
        discussionStore.subscribeToCommonDiscussions(currCommon?.id);
    }
    return () => {
      unsubscribeFromCommonProposals && unsubscribeFromCommonProposals();
      unsubscribeFromCommonDiscussions && unsubscribeFromCommonDiscussions();
    };
  }, [currCommon]);

  useEffect(() => {
    setShowRequestSentModal(params.showRequestSentModal);
    if (authStore.userInfo && authStore.isDaoMember(currCommon?.members)) {
      setMemberState(true);
    } else {
      setMemberState(false);
    }
    setHasPermission(
      authStore.getPermission(commonId, authStore?.userInfo?.uid),
    );
  }, [params.showRequestSentModal, authStore.userInfo, currCommon?.members]);

  useEffect(() => {
    let unsubscribe = null;
    let getPendingProposalsData = async () => {
      unsubscribe = await ProposalService.subscribeToPendingProposalsData(
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
  }, [commonId, isMember, authStore.userInfo?.uid]);

  useEffect(() => {
    if (pendingProposalsData && pendingProposalsData.usersPendingProposal) {
      const getPendingProposalsDiscussionCount = async () => {
        const count = await ProposalService.getProposalDiscussionsCount(
          pendingProposalsData.usersPendingProposal.id,
        );
        if (userPendingPropDiscCount !== count) {
          setUserPendingPropDiscCount(count);
        }
      };
      getPendingProposalsDiscussionCount();
    }
  }, [pendingProposalsData]);

  const renderTabBar = useCallback(
    (props) => (
      <TabBarRenderer
        originRef={originTabBarRef}
        jumpTo={originTabBarRef.current?.props?.jumpTo}
        indexChange={setIndex}
        {...props}
      />
    ),
    [originTabBarRef],
  );

  const Discussions = () => (
    <View style={{...styles.paleBackground, ...{paddingVertical: sizeL}}}>
      <Text style={text.h1BlackTitle}>Discussions</Text>
      <DiscussionList
        navigation={navigation}
        commonId={currCommon.id}
        openCommonOptions={(discussion) =>
          openCommonOptions(discussion, TITLES.discussion)
        }
        showHiddenNote={(hiddenDiscussion) =>
          showHiddenNote(hiddenDiscussion, TITLES.discussion)
        }
        isMember={isMember}
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
        openCommonOptions={(proposal) =>
          openCommonOptions(proposal, ENTITY_TYPES.proposals)
        }
        showHiddenNote={(hiddenProposal) =>
          showHiddenNote(hiddenProposal, TITLES.proposalText)
        }
        isMember={isMember}
      />
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
          showHiddenNote(hiddenProposal, TITLES.proposalText)
        }
        sMember={isMember}
      />
    </View>
  );

  const renderScene = useMemo(
    () =>
      SceneMap({
        discussions: Discussions,
        proposals: Proposals,
        history: History,
      }),
    [],
  );

  const openAgendaScreen = () => {
    navigation.navigate(NAVIGATION_SCREENS.COMMON_AGENDA, {
      commonId: currCommon.id,
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
              {truncateString(
                currCommon.metadata.description,
                ABOUT_TRUNCATE_LENGTH,
              )}
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
                {`${pendingProposalsData?.pendingProposalCount ?? 0}  Pending`}
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

  const openCommonMembers = () => {
    navigation.navigate('CommonMembers', {
      commonId: currCommon.id,
      screenTitle: currCommon.name,
      hasPermission,
      openCommonOptions: (requestToJoin) =>
        openCommonOptions(requestToJoin, TITLES.membershipRequest),
      showHiddenNote: (hiddenRequestToJoin) =>
        showHiddenNote(hiddenRequestToJoin, TITLES.membershipRequest),
      isMember,
    });
  };

  const onEdit = (type) => {
    // bottomSheetStore.hideBottomSheet();
    setOptionsModalVisible(false);
    navigateTo(type);
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
    const resp = await ModerationService.onModerate(
      actionType,
      itemId,
      commonId,
      itemType.toLowerCase(),
    );

    resp === ACTIONS.report
      ? setShowModerationModal(true)
      : resp && setShowModerationSuccessModal(true);
  };

  const membershipRequestType = (itemTitle) =>
    itemTitle === TITLES.membershipRequest ? TITLES.proposals : itemTitle;

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
      BOTTOM_SHEET_TEMPLATES.SCREEN_COMMON_PROFILE_OPTIONS(item, hasPermission),
      {
        onAction: item
          ? (actionType) =>
              onModerate(actionType, membershipRequestType(itemType), item.id)
          : (type) => onEdit(type),
        hasPermission,
        moderatorOptions: {
          item,
          isMember,
        },
      },
    );
  };

  const onReportContent = async () => {
    setShowModerationModal(false);
    bottomSheetStore.hideBottomSheet();
    Toast.loading('Reporting content...');

    try {
      await ModerationService.report(
        membershipRequestType(moderationType).toLowerCase(),
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

  const showHiddenNote = ({hiddenItem, isModerator = false}, type) => {
    const {moderation} = hiddenItem;
    bottomSheetStore.showBottomSheet(
      BOTTOM_SHEET_TEMPLATES.HIDDEN_CONTENT_INFO,
      {
        userName: reporterName(
          userStore.getUserById(moderation.moderator),
          authStore.userInfo?.uid,
        ),
        date: timeReported(moderation.updatedAt),
        reasons: moderation.reasons,
        moderatorNote: moderation?.moderatorNote,
        type,
        isModerator,
      },
    );
  };

  const getType = (title) =>
    title === TITLES.proposals ? TITLES.proposalText : title;

  const navigateTo = (type) => {
    navigation.navigate(NAVIGATION_SCREENS.EDIT_COMMON, {
      currCommon: currCommon,
      type: type,
    });
  };

  const requestToJoin = () => {
    const introduceYourselfFormStore = new IntroduceYourselfFormStore();
    const paymentFormStore = new PaymentFormStore();
    const personalContributionFormStore = new PersonalContributionFormStore();
    const billingDetailsFormStore = new BillingDetailsFormStore();

    let navigate;
    if (commonStore.myCommons.length > 0) {
      navigate = CommonActions.navigate({
        name: 'IntroductionStep', // we always go to Introduction first
        params: {
          formStores: {
            paymentFormStore,
            introduceYourselfFormStore,
            personalContributionFormStore,
            billingDetailsFormStore,
          },
          currCommon: currCommon,
          currDaoId: currCommon.id,
          skipFirstStep: false,
          refreshFeed,
        },
      });
      navigation.dispatch(navigate);
    } else {
      navigate = CommonActions.navigate({
        name: 'FirstJoinCommon',
        params: {
          currCommon: currCommon,
          currDaoId: currCommon.id,
          refreshFeed,
        },
      });
    }

    if (authStore.userInfo) {
      navigation.dispatch(navigate);
    } else {
      bottomSheetStore.showBottomSheet(
        BOTTOM_SHEET_TEMPLATES.LOGIN_SHEET_SCREEN,
        {
          goToNextScreen: () => navigation.dispatch(navigate),
        },
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
          <Icon name="clock" size={16} style={layout.marginRightXS} />
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

  const onModalOptionsAction = (type) => {
    if (
      type === COMMON_OPTION_TYPES.info ||
      type === COMMON_OPTION_TYPES.rules
    ) {
      onEdit(type);
    } else if (type === COMMON_OPTION_TYPES.delete) {
      setDeleteScreenOn(true);
    } else if (type === COMMON_OPTION_TYPES.contributionHistory) {
      closeCommonOptionsModal();
      const actions = CommonActions.navigate({
        name: NAVIGATION_SCREENS.CONTRIBUTION_HISTORY,
        params: {
          common: currCommon,
        },
      });

      navigation.dispatch(actions);
    }
  };

  const onDelete = async () => {
    try {
      closeCommonOptionsModal();
      Toast.loading('Deleting');
      await commonStore.deleteCommon(commonId);
      navigation.navigate(NAVIGATION_SCREENS.EXPLORE);
      Toast.done('Your Common is deleted');
    } catch (err) {
      closeCommonOptionsModal();
      Toast.error('Could not delete your Common');
    }
  };

  const onDeleteCancel = () => {
    setDeleteScreenOn(false);
  };

  const closeCommonOptionsModal = () => {
    setDeleteScreenOn(false);
    setOptionsModalVisible(false);
  };

  const openCommonOptionsModal = () => {
    setOptionsModalVisible(true);
  };

  const renderRequestToJoinBtn = () => (
    <TouchableOpacity style={styles.headerButton} onPress={requestToJoin}>
      <Text style={styles.requestToJoin}>Request to join</Text>
      <Text style={styles.contribution}>
        {CurrencySymbols.SHEKEL}
        {currCommon.minFeeToJoinFormatted && currCommon.minFeeToJoinFormatted()}
        {currCommon.metadata.contributionType === 'monthly' && '/mo'} min.
        contribution
      </Text>
    </TouchableOpacity>
  );

  const initialLayout = {width};

  const renderForeground = useCallback(
    () => (
      <CommonHeader
        isMember={isMember}
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
    ),
    [isMember, currCommon, hasPermission, headerHeightLayouted],
  );

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <ModerationModal
        title={moderationType}
        visible={showModerationModal}
        setShowModerationModal={() => setShowModerationModal(false)}
        moderationFormStore={moderationFormStore}
        onReportContent={() => onReportContent()}
        hasPermission={hasPermission}
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

          <CommonProfileFlatList
            openCommonOptionsModal={openCommonOptionsModal}
            currCommon={currCommon}
            showReqToJoin={showReqToJoin}
            renderRequestToJoinBtn={renderRequestToJoinBtn}
            isMember={isMember}>
            <>
              {renderForeground()}
              {showPending && (
                <React.Fragment>
                  {pendingProposalsData?.usersPendingProposal &&
                    renderPendingApproval()}
                </React.Fragment>
              )}

              <View
                style={{paddingVertical: sizeS, backgroundColor: colors.white}}>
                <CommonStageSummary
                  time={currCommon.fundingGoalDeadline}
                  activeProposals={
                    currCommon.numberOfBoostedProposals +
                    currCommon.numberOfPreBoostedProposals +
                    currCommon.numberOfQueuedProposals
                  }
                  members={currCommon?.members?.length}
                  balance={currCommon.balance}
                  raised={currCommon.raised}
                  reservedBalance={currCommon.reservedBalance}
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
            </>
          </CommonProfileFlatList>

          <SafeAreaView>
            {isMember ? (
              index === 0 ? (
                <BottomRightButton
                  iconName="add-proposal-32"
                  onPress={() =>
                    navigation.navigate(NAVIGATION_SCREENS.NEW_DISCUSSION, {
                      commonId: currCommon.id,
                    })
                  }
                  bottom={50}
                />
              ) : (
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
          <BottomSheetModal
            style={layout.optionsModal}
            isVisible={optionsModalVisible}
            onClose={closeCommonOptionsModal}>
            {!deleteScreenOn ? (
              <ModalCommonOptions
                commonMembersCount={currCommon?.members?.length}
                isFounderOrModerator={hasPermission}
                onAction={onModalOptionsAction}
                commonName={currCommon.name}
              />
            ) : (
              <ModalDeleteConfirmation
                onDelete={onDelete}
                onCancel={onDeleteCancel}
              />
            )}
          </BottomSheetModal>
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
    backgroundColor: colors.white,
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
    height: HEADER_BUTTON_HEIGHT,
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
    justifyContent: 'flex-end',
    height: STICKY_HEADER_HEIGHT,
    borderBottomWidth: 1,
    backgroundColor: colors.white,
    borderBottomColor: colors.grey4,
    zIndex: 99,
  },
  stickySectionText: {
    // paddingTop: Platform.OS === 'ios' ? 40 : 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...font.heading.bold,
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
  },
  stickyTextContainer: {
    height: stickyHeightAddon,
    justifyContent: 'center',
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
