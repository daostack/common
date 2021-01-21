import React, {useRef} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import ViewTabNoData from '~/Components/ViewTabNoData';
import ProposalCard from '~/Components/Proposals/ProposalCard';
import {layout, colors, font, text, sizeM} from '~/Theme';
import SwiperCard from '~/Components/SwiperCard';
import {Placeholder, PlaceholderMedia, Fade} from 'rn-placeholder';
import {string, bool, object, number, shape, func, array} from 'prop-types';
import {observer, inject} from 'mobx-react';
const {width, height} = Dimensions.get('window');

const ProposalsList = ({
  isSwiper,
  navigation,
  commonInfo,
  proposalFilter,
  showMax,
  // showAll,
  // userId,
  //isHistory,
  // onCountChange,
  // includeHistoryInCount,
  // userStore: {userInfo},
  //list,
  proposalStore,
}) => {
  const list = commonInfo
    ? proposalStore.getCommonProposals(commonInfo.id, proposalFilter)
    : list;
  let listRef = useRef([]);
  const renderProposalCard = (item, index) =>
    isSwiper ? (
      !showMax || index < showMax ? (
        <ProposalCard
          proposalId={item.id}
          key={item.id}
          isSwiper={true}
          commonInfo={commonInfo}
          navigation={navigation}
        />
      ) : (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('MyProposals', {
              onlyFundingRequests: proposalFilter.onlyFundingRequests,
              onlyMembershipRequests: proposalFilter.onlyRequestsToJoin,
            })
          }
          style={{...styles.commonBox}}>
          <Text style={text.buttonblue}>
            {`View all ${list.length} ${
              item.isJoinRequest ? 'Requests' : 'Proposals'
            }`}
          </Text>
        </TouchableOpacity>
      )
    ) : (
      <ProposalCard
        proposalId={item.id}
        key={item.id}
        isSwiper={false}
        commonInfo={commonInfo}
        navigation={navigation}
      />
    );

  return isSwiper ? (
    list ? (
      list.length > 0 ? (
        <View style={layout.flexRow}>
          <SwiperCard
            cardRenderer={(item, index) => renderProposalCard(item, index)}
            data={list}
            extraData={listRef}
            showMax={showMax}
          />
        </View>
      ) : (
        <View style={styles.emptyObjectContainer}>
          <Image
            style={{height: 100, width: 100}}
            source={require('../../../src/Assets/pencil.png')}
          />
          <Text style={{...text.h2Black, ...layout.marginTopS}}>
            {proposalFilter.onlyRequestsToJoin
              ? 'No Active Requests'
              : 'No Active Proposals'}
          </Text>
          <Text style={styles.textNoProposals}>
            Join a common and propose actions you think it should take to
            achieve its goal
          </Text>
        </View>
      )
    ) : (
      <View style={{paddingHorizontal: 20}}>
        <Placeholder Animation={Fade}>
          <PlaceholderMedia
            style={{
              height: 200,
              width: '100%',
              marginBottom: 20,
              borderRadius: 26,
            }}
          />
        </Placeholder>
      </View>
    )
  ) : (
    <>
      {list && list.length > 0 ? (
        <FlatList
          data={list.slice()}
          renderItem={({item}) => renderProposalCard(item)}
        />
      ) : (
        <ViewTabNoData
          title={
            proposalFilter.history
              ? 'No Past activity'
              : proposalFilter.onlyRequestsToJoin
              ? 'No requests yet'
              : 'No proposals'
          }
          subtitle={
            proposalFilter.history
              ? 'You will be able to see proposals that passed or were rejected here.'
              : 'Propose actions or request funding by creating proposals. The Common members will vote and decide to accept or reject them.'
          }
        />
      )}
    </>
  );
};

ProposalsList.propTypes = {
  includeHistoryInCount: bool,
  isMember: bool,
  commonInfo: shape({
    id: string,
    name: string,
  }),
  showAll: bool,
  showMax: number,
  userId: string,
  isHistory: bool,
  isSwiper: bool,
  navigation: object,
  onCountChange: func,
  onlyRequestsToJoin: bool,
  userStore: shape({
    userInfo: shape({
      uid: string,
    }),
  }),
  list: array,

  proposalStore: shape({
    getCommonProposals: func,
  }),
  proposalFilter: object,
};

const styles = StyleSheet.create({
  emptyObjectContainer: {
    ...layout.content,
    borderRadius: 14,
    backgroundColor: colors.iceBlue,
    alignSelf: 'center',
    marginHorizontal: 12,
  },

  textNoProposals: {
    ...font.primary.regular,
    ...font.fontSize(2),
    ...text.centered,
    ...layout.marginTopS,
  },

  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  child: {
    height: height * 0.5,
    width,
    justifyContent: 'center',
  },
  text: {
    fontSize: width * 0.5,
    textAlign: 'center',
  },
  newMemberMsg: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.slate,
  },
  newMemberMsgContainer: {
    paddingBottom: sizeM,
  },
  commonBox: {
    width: '100%',
    height: 237,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 26, 54, 0.08)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 6,
  },
});

export default inject('userStore', 'proposalStore')(observer(ProposalsList));
