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
} from 'react-native';
import {text, layout, colors, sizeM} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import {TabView, TabBar} from 'react-native-tab-view';
import ProposalData from './ProposalData';
import ProposalDiscussion from './ProposalDiscussion';
import MemberCard from '../../Components/MemberCard';
import BoostedInfo from '../BottomSheetScreens/BoostedInfo';
import ApprovalSheetScreen from '../BottomSheetScreens/ApprovalSheetScreen';
import Toast from '../../Util/Toast';
import BottomSheetModal from '../../Components/BottomSheetModal';
import BottomSheetContainer from '../../Components/BottomSheetContainer';
import ProposalService from '../../Services/ProposalService';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const {width} = Dimensions.get('window');

import CountDown from 'react-native-countdown-component';
import FirebaseService from '../../Services/FirebaseService';
import {monthShortNames} from '../../Util/DateUtil';

const ProposalScreen = ({navigation, route, props}) => {
  const [proposalInfo, setProposalInfo] = useState(false);
  const [proposedUser, setProposedUser] = useState(false);

  const routeProposalId = route?.params.proposalId;

  useEffect(() => {
    const getProposalInfo = async proposalId => {
      try {
        let currProposalInfo = await ProposalService.getInstance().getProposalInfo(
          proposalId,
        );

        //RequestToJoin proposal
        let proposedMemberId = null;
        let funding = null;
        if (currProposalInfo.joinAndQuit) {
          proposedMemberId = currProposalInfo.joinAndQuit.proposedMemberId;
          funding = currProposalInfo.joinAndQuit.funding;
        }
        //FundingRequest proposal
        else {
          proposedMemberId = currProposalInfo.fundingRequest.beneficiaryId;
          funding = currProposalInfo.joinAndQuit.amount;
        }

        const currProposedUser = await FirebaseService.getInstance().getUserById(
          proposedMemberId,
        );

        setProposedUser(currProposedUser);
        setProposalInfo({...currProposalInfo, ...{funding: funding}});
      } catch (error) {
        console.log('error: ', error);
      }
    };

    if (routeProposalId) {
      getProposalInfo(routeProposalId);
    }
  }, [routeProposalId]);

  const [
    isApprovalBottomModalVisible,
    setIsApprovalBottomModalVisible,
  ] = useState(false);

  const [isVoteByYou, setIsVoteByYou] = useState(false);
  const [voteType, setVoteType] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'info', icon: 'proposal'},
    {key: 'discussions', icon: 'discussion'},
  ]);

  const [inputHeight, setInputHeight] = useState(60);
  const [inputText, setInputText] = useState(null);

  const inputRef = useRef();
  boostedInfoRef = useRef();
  approvalSheetRef = useRef();

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

  const messageInput = () => {
    const commonId = '48NPcGnpskN9YkqVNXKA';
    const proposalId = 'DmZFnbSbkwcQHMAyGa54';
    const discussionId = '43Q9abICrp2KpE86c1Az';

    const sendMessageToDiscussion = async () => {
      const userInfo = auth().currentUser;
      const message = inputRef.current._lastNativeText;
      if (message && message.trim().length) {
        firestore()
          .collection('common')
          .doc(commonId)
          .collection('proposal')
          .doc(proposalId)
          .collection('discussion')
          .doc(discussionId)
          .collection('message')
          .doc()
          .set({
            text: message,
            createTime: new Date(),
            ownerId: userInfo.uid,
            ownerName: userInfo.displayName,
            ownerAvatar: userInfo.photoURL,
            commonId: commonId,
            discussionId: discussionId,
          })
          .then(() => {
            console.log('YES');
            inputRef.current.clear();
            // inputRef.focused
            // Toast.done('Sent');
            // setTrigger(!trigger);
            Keyboard.dismiss();
          })
          .catch(error => {
            console.log('NO', error);
            Toast.error(error);
          });
      }
    };

    return (
      <KeyboardAvoidingView
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{position: 'absolute', bottom: 0, flex: 1, color: '#fbfdff'}}>
        <View style={styles.input}>
          <View style={styles.inputBorder}>
            <TextInput
              ref={inputRef}
              editable={true}
              multiline={true}
              onContentSizeChange={e =>
                setInputHeight(e.nativeEvent.contentSize.height)
              }
              style={{flex: 1, height: inputHeight, marginHorizontal: 10}}
              fontSize={15}
              onChangeText={text => setInputText(text)}
            />
            <TouchableOpacity
              style={{paddingRight: 15, justifyContent: 'center'}}
              onPress={sendMessageToDiscussion}>
              <Icon
                name="edit"
                size={20}
                color={
                  inputText && inputText.trim() ? colors.mainBlue : colors.grey3
                }
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{height: 30, backgroundColor: colors.white}} />
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
      const remainingSeconds = proposalInfo?.closingAt?.seconds
        ? proposalInfo?.closingAt?.seconds - Date.now() / 1000
        : null;

      const isLessThanOneHour = remainingSeconds < 3600;

      let counterTextColor = styles.timerText;
      let timerBackground = colors.paleblue;

      if (isLessThanOneHour) {
        counterTextColor = {...styles.timerText, ...{color: colors.white}};
        timerBackground = colors.orangeDark;
      }

      return (
        <View
          style={{
            ...layout.flexRow,
            ...{
              justifyContent: 'space-between',
              width: '100%',
              paddingHorizontal: 20,
            },
          }}>
          <View style={styles.timerContainer}>
            <View
              style={{...styles.timer, ...{backgroundColor: timerBackground}}}>
              {remainingSeconds ? (
                <CountDown
                  digitTxtStyle={counterTextColor}
                  timeLabels={false}
                  showSeparator={true}
                  separatorStyle={counterTextColor}
                  digitStyle={{
                    height: 'auto',
                    width: 'auto',
                  }}
                  until={remainingSeconds}
                  onFinish={() => console.log('finished')}
                />
              ) : null}
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

  let memberCreatedDate = null;

  if (proposedUser) {
    memberCreatedDate = new Date(proposedUser?.createdAt.seconds * 1000);
  }

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
              {proposalInfo?.title}
            </Text>

            <MemberCard
              name={proposedUser?.displayName}
              memberSince={
                memberCreatedDate
                  ? `${
                      monthShortNames[memberCreatedDate.getMonth()]
                    } ${memberCreatedDate.getDay()} `
                  : ''
              }
              imageUrl={proposedUser.photoURL}
              isPending={false}
            />
          </View>

          <TabView
            navigationState={{index, routes}}
            renderScene={() => null}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            renderTabBar={renderTabBar}
            style={{}}
          />
          {index === 0 && (
            <ProposalData
              proposalInfo={proposalInfo}
              showMore={() => setIndex(1)}
            />
          )}
          {index === 1 && <ProposalDiscussion inputRef={inputRef} />}
        </ScrollView>

        {index === 0 ? (
          <View style={styles.actionButtonContainer}>
            {renderStickyBottomContent()}
          </View>
        ) : (
          <>{messageInput()}</>
        )}
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

  timerText: {
    ...text.smallBlackText,
    ...text.bold,
    color: colors.slate,
  },

  timer: {
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
    padding: 0,
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
  input: {
    // backgroundColor: colors.white,
    backgroundColor: '#fbfdff',
    borderColor: colors.grey4,
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
});

export default ProposalScreen;
