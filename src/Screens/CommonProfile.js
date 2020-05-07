import React, {useState, useRef, useEffect} from 'react';
import {
  Dimensions,
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import gql from 'graphql-tag';
import {ApolloClientConfig as client} from '../Config';
import {text, layout, colors} from '../Theme';
import Icon from '../Assets/iconfont/Icon';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import ViewTabNoData from '../Components/ViewTabNoData';

import CommonOperationalStateNotif from './BottomSheetScreens/CommonOperationalStateNotif';
import SortProposals from './BottomSheetScreens/SortProposals';
import CommonProfileOptions from './BottomSheetScreens/CommonProfileOptions';
//import ProposalSheetScreen from './Proposals/ProposalSheetScreen';
import ProposalSheetScreen from './BottomSheetScreens/ProposalSheetScreen';
import ApprovalSheetScreen from './BottomSheetScreens/ApprovalSheetScreen';

import BottomSheetContainer from '../Components/BottomSheetContainer';
import CommonCover from '../Components/Commons/CommonCover';
import CommonStageSummary from '../Components/Commons/CommonStageSummary';
import Modal from 'react-native-modal';
import SentTemplate from '../Components/ModalTemplates/SentTemplate';
import ProposalApprovalTag from '../Components/Proposals/ProposalApprovalTag';
import BottomRightButton from '../Components/BottomRightButton';
import DiscussionList from './Discussions/DiscussionList';

const {cache} = client;
let {width} = Dimensions.get('window');
const mockData = {
  commonPicture: 'https://i.picsum.photos/id/10/500/100.jpg',
  commonLogo:
    'https://yf8pn4fsld-flywheel.netdna-ssl.com/wp-content/uploads/2017/11/logo-Placeholder.png',
  description: 'If you wanna save the Amazon, own it.',
  name: 'Amazon Network',
  time: 26,
  members: 55,
  raised: 4200,
  //Funding stage data
  goal: 10000,
  //Operating stage data
  currentBudget: 1421,
  activeProposals: 142,
};

const CommonProfile = ({navigation, route}) => {
  commonOperationalStateNotifRef = useRef();
  optionsSheetRef = useRef();
  sortProposalsSheetRef = useRef();
  proposalSheetRef = useRef();

  const [isMember] = useState(false);
  const [isFundingStage] = useState(false);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'discussions', title: 'Discussions', icon: 'discussion'},
    {key: 'proposals', title: 'Proposals', icon: 'proposals'},
    {key: 'history', title: 'History', icon: 'history'},
  ]);

  const [showRequestSentModal, setShowRequestSentModal] = useState(false);

  useEffect(() => {
    // noinspection JSAnnotator
    const getDao = async commonId => {
      // noinspection JSAnnotator
      try {
        console.log('CACHE: ', cache.data.data);
        const res = await cache.readQuery({
          query: gql`
            query readDao($id: String!) {
              daos(id: $id) {
                id
              }
            }
          `,
          variables: {
            id: commonId,
            __typename: 'DAO',
          },
        });
        console.log('HELLO!: ', res);
      } catch (error) {
        console.log('error: ', error);
      }
    };

    setShowRequestSentModal(route.params.showRequestSentModal ? true : false);
    getDao(route.params.commonId);
  }, [route.params.commonId, route.params.showRequestSentModal]);

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: colors.mainBlue,
      }}
      renderLabel={({route, focused, color}) => {
        return (
          <View style={{...layout.content, padding: 0}}>
            <Icon
              name={route.icon}
              size={30}
              color={focused ? colors.mainBlue : colors.grey3}
            />
            <Text style={focused ? styles.tabStyleActive : styles.tabStyle}>
              {route.title}
            </Text>
          </View>
        );
      }}
      style={{backgroundColor: colors.white}}
      tabStyle={{borderTopWidth: 1, borderColor: colors.grey4}}
    />
  );

  const Discussions = () => {
    return (
      <DiscussionList
        navigation={navigation}
        commonId="48NPcGnpskN9YkqVNXKA"
        // {route.params.commonId}
      />
    );
  };

  const Proposals = () => {
    return (
      <ViewTabNoData
        title="No proposals yet"
        subtitle="Write your first proposals and invite members to make an impact together!"
      />
    );
  };

  const History = () => {
    return (
      <ViewTabNoData
        title="No Past activity"
        subtitle="You will be able to see proposals that passed or were rejected here."
      />
    );
  };

  const renderScene = SceneMap({
    discussions: Discussions,
    proposals: Proposals,
    history: History,
  });

  const openAgendaScreen = e => {
    navigation.navigate('CommonAgenda');
  };

  const renderAgendaForNonMembers = () => {
    if (!isMember) {
      return (
        <View style={styles.agendaBox}>
          <Text style={styles.agendaDescription}>
            We aim to ba a global non-profit initiative. Only small percentage
            of creative directors are women and we want to help change this
            through mentorship circles, portfolio reviews, talks & creative
            meetups.
          </Text>

          <TouchableOpacity onPress={openAgendaScreen}>
            <Text style={styles.readMoreButton}>
              View agenda and rules of conduct
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderMembersRowForMemberUsers = () => {
    if (isMember) {
      return (
        <View style={styles.membersContainer}>
          <TouchableOpacity
            onPress={openCommonMembers}
            style={styles.membersAction}>
            <View style={styles.membersRow}>
              <Image
                style={styles.memberImage}
                source={{
                  uri:
                    'https://live.envalab.com/html/cetus/demo/images/element/team/1.jpg',
                }}
              />
              <Image
                style={{...styles.memberImage, ...{marginLeft: -10}}}
                source={{
                  uri:
                    'https://live.envalab.com/html/cetus/demo/images/element/team/2.jpg',
                }}
              />
              <Image
                style={{...styles.memberImage, ...{marginLeft: -10}}}
                source={{
                  uri:
                    'https://live.envalab.com/html/cetus/demo/images/element/team/3.jpg',
                }}
              />
              <Image
                style={{...styles.memberImage, ...{marginLeft: -10}}}
                source={{
                  uri:
                    'https://live.envalab.com/html/cetus/demo/images/element/team/4.jpg',
                }}
              />
            </View>
            <TouchableOpacity style={layout.flexRow}>
              <Text style={text.h4Black}>Pending (13)</Text>
              <Icon name="right-arrow" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const openCommonMembers = e => {
    navigation.navigate('CommonMembers');
  };

  const shareCommon = event => {
    console.log('TODO: share functionality');
  };

  const openCommonOptions = event => {
    optionsSheetRef.current.snapTo(1);
    optionsSheetRef.current.snapTo(1);
  };

  const openProposalCard = event => {
    proposalSheetRef.current.snapTo(1);
    proposalSheetRef.current.snapTo(1);
  };

  const openProposalScreen = event => {
    navigation.navigate('ProposalScreen');
  };

  const openNotif = event => {
    commonOperationalStateNotifRef.current.snapTo(1);
    commonOperationalStateNotifRef.current.snapTo(1);
  };

  const requestToJoin = event => {
    navigation.navigate('RequestStep1');
  };

  const viewProposal = () => {
    //navigation.navigate('RequestStep1');
  };

  const goToToCommon = () => {
    setShowRequestSentModal(false);
  };

  const renderPendingApproval = () => {
    return (
      <TouchableOpacity
        onPress={openProposalCard}
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
              value={40}
              isMarked={true}
            />
            <ProposalApprovalTag
              iconName="declined"
              value={28}
              isMarked={false}
            />
            <ProposalApprovalTag
              iconName="discussion"
              value={121}
              isMarked={false}
            />
          </View>
          <View>
            <Text style={text.tapBarunselected}>02:00:10</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const initialLayout = {width: Dimensions.get('window').width};

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}
        contentContainerStyle={{paddingBottom: 100}}
        showsVerticalScrollIndicator={false}>
        <CommonCover
          isMember={true}
          navigation={navigation}
          onHeaderMenuOpen={openCommonOptions}
          commonInfo={{
            cover: mockData.commonPicture,
            logo:
              'https://yf8pn4fsld-flywheel.netdna-ssl.com/wp-content/uploads/2017/11/logo-Placeholder.png',
            name: mockData.name,
            description: mockData.description,
          }}
        />

        {renderPendingApproval()}

        <View style={{paddingVertical: 20}}>
          <CommonStageSummary
            isFundingStage={isFundingStage}
            commonProgressInfo={{
              time: mockData.time,
              activeProposals: mockData.activeProposals,
              goal: mockData.goal,
              members: mockData.members,
              raised: mockData.raised,
              currentBudget: mockData.currentBudget,
            }}
          />
        </View>

        {renderMembersRowForMemberUsers()}
        <View style={{...layout.content, ...{paddingTop: 0}}}>
          <TouchableOpacity
            style={{
              ...layout.btnOutline,
            }}
            onPress={shareCommon}>
            <Text style={text.buttonblue}>Share Common</Text>
          </TouchableOpacity>
        </View>
        {renderAgendaForNonMembers()}

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

        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={renderTabBar}
          style={{}}
        />

        <BottomRightButton
          onPress={() =>
            navigation.navigate('New Post', {
              commonId: '48NPcGnpskN9YkqVNXKA',
            })
          }
          bottom={90}
        />
      </ScrollView>

      <SafeAreaView>
        {isMember ? (
          <TouchableOpacity style={styles.addButton}>
            <Icon name="plus" color={colors.white}></Icon>
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.actionButtonContainer}>
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
                  $50 Contribution
                </Text>
              </TouchableOpacity>
            </View>
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
                    <Text style={text.buttoncenterwhite}>View proposal</Text>
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
      <BottomSheetContainer ref={commonOperationalStateNotifRef}>
        <CommonOperationalStateNotif navigation={navigation} />
      </BottomSheetContainer>
      <BottomSheetContainer ref={optionsSheetRef}>
        <CommonProfileOptions navigation={navigation} />
      </BottomSheetContainer>
      <BottomSheetContainer ref={sortProposalsSheetRef}>
        <SortProposals navigation={navigation} />
      </BottomSheetContainer>
      <BottomSheetContainer ref={proposalSheetRef} topSnapPoint={800}>
        <ProposalSheetScreen navigation={navigation} />
      </BottomSheetContainer>
    </View>
  );
};

const styles = StyleSheet.create({
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
  membersContainer: {
    ...layout.content,
    ...layout.flexRow,
    paddingVertical: 0,
  },
  membersAction: {
    ...layout.content,
    ...layout.flexRow,
    paddingHorizontal: 0,
    alignSelf: 'stretch',
    flexGrow: 1,
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: colors.grey4,
  },
  tabStyle: {
    ...text.ashleyjquimbacom2,
  },
  tabStyleActive: {
    ...text.ashleyjquimbacom2,

    color: colors.mainBlue,
  },

  actionButtonContainer: {
    padding: 20,
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    shadowColor: 'rgba(79, 92, 105, 0.1)',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 4,
    shadowOpacity: 1,
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
});

export default CommonProfile;
