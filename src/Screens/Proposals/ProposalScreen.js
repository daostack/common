import React, {useState, useRef} from 'react';
import {
  Dimensions,
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {text, layout, colors, sizeM} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import ProposalData from './ProposalData';
import ProposalDiscussion from './ProposalDiscussion';
import MemberCard from '../../Components/MemberCard';
import BoostedInfo from '../BottomSheetScreens/BoostedInfo';
import ApprovalSheetScreen from '../BottomSheetScreens/ApprovalSheetScreen';
import Toast from '../../Util/Toast';

import BottomSheetContainer from '../../Components/BottomSheetContainer';
import BottomSheetModal from '../../Components/BottomSheetModal';

const mockData = {
  data: 'data',
  member: {
    name: 'John Smith',
    memberSince: 'may 12',
    imageUrl:
      'https://live.envalab.com/html/cetus/demo/images/element/team/1.jpg',
    date: 'May 12',
  },
};

const ProposalScreen = ({navigation}) => {
  const [
    isApprovalBottomModalVisible,
    setIsApprovalBottomModalVisible,
  ] = useState(false);

  const [isVoteByYou, setIsVoteByYou] = useState(false);
  const [voteType, setVoteType] = useState(false);

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    {key: 'info', icon: 'proposal'},
    {key: 'discussions', icon: 'discussion'},
  ]);

  boostedInfoRef = useRef();
  approvalSheetRef = useRef();

  const openBoostedInfoBottomSheet = () => {
    console.log('openBoostedInfo');
    boostedInfoRef.current.snapTo(1);
    boostedInfoRef.current.snapTo(1);
  };

  const renderScene = SceneMap({
    info: ProposalData,
    discussions: ProposalDiscussion,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: colors.mainBlue,
      }}
      renderLabel={({route, focused}) => {
        return (
          <View style={{...layout.content, padding: 0}}>
            <Icon
              name={route.icon}
              size={24}
              color={focused ? colors.mainBlue : colors.grey3}
            />
          </View>
        );
      }}
      style={{backgroundColor: colors.white}}
    />
  );

  const openApprovalSheet = isApproval => {
    setVoteType(isApproval);
    setIsApprovalBottomModalVisible(true);
  };

  const closeApprovalSheet = e => {
    setIsApprovalBottomModalVisible(false);
  };

  const onVote = isApproved => {
    closeApprovalSheet();
    Toast.done(isApproved ? 'Approved by you' : 'Rejected by you');
    setIsVoteByYou({isApproved: isApproved});
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
        <View style={{...layout.content, ...layout.flexRow, ...{padding: 0}}}>
          <Icon
            name={iconName}
            color={color}
            size={12}
            style={layout.marginRightS}
          />
          <Text style={{...styles.votedByYouText, ...{color: color}}}>
            {message}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={{...layout.flexRow, ...{justifyContent: 'space-between'}}}>
          <View style={styles.timerContainer}>
            <View style={styles.timer}>
              <Text style={text.smallBlackText}>00:14:32:12</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={e => openApprovalSheet(true)}
            style={{...styles.actionBtnStyle, ...layout.marginRightS}}>
            <Icon name="approved" style={styles.actionBtnIcon} size={14} />
            <Text style={styles.actionBtnGreen}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={e => openApprovalSheet(false)}
            style={{...styles.actionBtnStyle, ...layout.marginLeftS}}>
            <Icon name="declined" style={styles.actionBtnIcon} size={14} />
            <Text style={styles.actionBtnRed}>Reject</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const initialLayout = {width: Dimensions.get('window').width};

  return (
    <>
      <SafeAreaView style={{backgroundColor: colors.white}} />
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: colors.white,
          }}>
          <View
            style={{
              ...layout.content,
              ...layout.flexStart,
              ...{paddingBottom: 0},
            }}>
            <Text style={{...text.h3Black, ...{textAlign: 'left'}}}>
              Launch a facebook campaign to arise awareness about the amazon
            </Text>

            <MemberCard
              name={mockData.member.name}
              memberSince={mockData.member.memberSince}
              imageUrl={mockData.member.imageUrl}
              isPending={false}
            />
          </View>

          <TabView
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            renderTabBar={renderTabBar}
            style={{}}
          />
        </ScrollView>

        <View style={styles.actionButtonContainer}>
          {renderStickyBottomContent()}
        </View>
      </SafeAreaView>

      <BottomSheetContainer ref={boostedInfoRef} topSnapPoint={620}>
        <BoostedInfo />
      </BottomSheetContainer>

      <BottomSheetModal
        isVisible={isApprovalBottomModalVisible}
        onClose={closeApprovalSheet}>
        <ApprovalSheetScreen
          voteType={voteType}
          navigation={navigation}
          onApprove={onVote}
        />
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  tabStyle: {
    ...text.ashleyjquimbacom2,
  },
  tabStyleActive: {
    ...text.ashleyjquimbacom2,

    color: colors.mainBlue,
  },

  timer: {
    backgroundColor: colors.paleblue,
    paddingHorizontal: sizeM,
    paddingVertical: 1,
    borderRadius: 12,
  },

  timerContainer: {
    position: 'absolute',
    top: -37,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionButtonContainer: {
    padding: 20,
    paddingVertical: 25,
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
  },

  actionBtnIcon: {
    position: 'absolute',
    left: 15,
  },

  actionBtnStyle: {
    ...layout.btnOutline,
    borderRadius: 2,
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
});

export default ProposalScreen;
