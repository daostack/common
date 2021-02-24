import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Dimensions,
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {layout, font, colors, text, sizeS} from '~/Theme';
import {TabView} from 'react-native-tab-view';
import ProposalsList from '../../Proposals/ProposalsList';
import CommonMembersList from './CommonMembersList';
import CommonTabBar from '../../CommonTabBar';
import {string, func, array, object, shape, bool} from 'prop-types';
import {PROPOSAL_TYPE, PROPOSAL_STAGE} from '~/Config';
import {observer, inject} from 'mobx-react';
import {rootStorePropTypes} from '~/Types/propTypes';

const initialLayout = {width: Dimensions.get('window').width};
const getTabName = (objectName, count) =>
  `${objectName} (${count ? count : 0})`;

const Members = ({navigation, commonId}) => (
  <CommonMembersList navigation={navigation} commonId={commonId} />
);

const Pending = ({
  navigation,
  commonId,
  hasPermission,
  openCommonOptions,
  showHiddenNote,
}) => (
  <View style={layout.content}>
    <ProposalsList
      navigation={navigation}
      commonInfo={{id: commonId}}
      proposalFilter={{
        stage: PROPOSAL_STAGE.Active,
        type: PROPOSAL_TYPE.Join,
      }}
      hasPermission={hasPermission}
      openCommonOptions={(requestToJoin) => openCommonOptions(requestToJoin)}
      showHiddenNote={(hiddenRequestToJoin) =>
        showHiddenNote(hiddenRequestToJoin)
      }
    />
  </View>
);

const History = ({navigation, commonId}) => (
  <View style={layout.content}>
    <ProposalsList
      navigation={navigation}
      commonInfo={{id: commonId}}
      proposalFilter={{
        stage: PROPOSAL_STAGE.History,
        type: PROPOSAL_TYPE.Join,
      }}
    />
  </View>
);

const CommonMembers = ({navigation, route: router, rootStore}) => {
  const proposalStore = rootStore.proposalStore;
  const commonStore = rootStore.commonStore;

  const {
    commonId,
    hasPermission,
    openCommonOptions,
    showHiddenNote,
  } = router.params;
  const [index, setIndex] = useState(0);
  const pendingCount = proposalStore.getCommonProposals(commonId, {
    stage: PROPOSAL_STAGE.Active,
    type: PROPOSAL_TYPE.Join,
  }).length;
  const historyCount = proposalStore.getCommonProposals(commonId, {
    stage: PROPOSAL_STAGE.History,
    type: PROPOSAL_TYPE.Join,
  }).length;
  const membersCount = commonStore.getCommonById(commonId)?.members.length;

  const routes = [
    {
      key: 'members',
      title: getTabName('Members', membersCount),
    },
    {key: 'pending', title: getTabName('Pending', pendingCount)},
    {key: 'history', title: getTabName('History', historyCount)},
  ];

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'members':
        return <Members navigation={navigation} commonId={commonId} />;
      case 'pending':
        return (
          <Pending
            navigation={navigation}
            commonId={commonId}
            hasPermission={hasPermission}
            openCommonOptions={openCommonOptions}
            showHiddenNote={showHiddenNote}
          />
        );
      case 'history':
        return <History navigation={navigation} commonId={commonId} />;
      default:
        return null;
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          vertical={true}
          nestedScrollEnabled={true}
          directionalLockEnabled={true}>
          <View style={styles.sectionContainer}>
            <Text style={styles.title}>Members</Text>
          </View>

          <View style={styles.sectionTabView}>
            <TabView
              navigationState={{index, routes}}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={initialLayout}
              renderTabBar={CommonTabBar}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

Members.propTypes = {
  navigation: object,
  members: array,
  commonId: string,
};

Pending.propTypes = {
  navigation: object,
  commonId: string,
  onProposalsCountChange: func,
  hasPermission: bool,
  openCommonOptions: func,
  showHiddenNote: func,
};

History.propTypes = {
  navigation: object,
  commonId: string,
  onProposalsCountChange: func,
};

CommonMembers.propTypes = {
  navigation: object,
  route: shape({
    params: shape({
      members: array,
      commonId: string,
    }),
  }),
  rootStore: rootStorePropTypes,
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  sectionTabView: {},
  sectionContainer: {
    ...layout.content,
    marginVertical: sizeS,
    alignItems: 'center',
  },
  title: {
    ...font.heading.bold,
    ...font.fontSize(5),
  },
  tabStyleActive: {
    ...text.ashleyjquimbacom2,
    color: colors.black,
    fontWeight: 'bold',
  },
  tabStyle: {
    ...text.ashleyjquimbacom2,
    fontWeight: 'bold',
  },
});

export default inject('rootStore')(observer(CommonMembers));
