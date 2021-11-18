import React, {useCallback, useRef} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import ViewTabNoData from '~/Components/ViewTabNoData';
import ProposalCard from '~/Components/Proposals/ProposalCard';
import {layout, colors, font, text, sizeM} from '~/Theme';
import SwiperCard from '~/Components/SwiperCard';
import {Placeholder, PlaceholderMedia, Fade} from 'rn-placeholder';
import {observer, inject} from 'mobx-react';
import {Proposal} from '~/Stores/Models/Proposal';
import {
  isTypeFilterJoin,
  isStageFilterHistory,
} from '~/Stores/DataStores/proposal-store';
import {PERMISSIONS} from '~/Types';
import {IProposalFilterParams} from '~/Types/EntityTypes/IProposalEntity';
import {Common} from '~/Stores/Models';
import {useStore} from '~/Stores';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';

const {width, height} = Dimensions.get('window');

const ProposalsList: React.FC<{
  proposalFilter: IProposalFilterParams;
  common?: Common;
  user: {
    uid: string;
  };
  hasPermission: PERMISSIONS;
  showMax: number;
  isSwiper: boolean;
}> = observer(({proposalFilter, showMax, isSwiper, common, user}) => {
  const {proposalStore} = useStore();
  const navigation = useNavigation();
  let list: Proposal[] = [];
  if (common) {
    list = proposalStore.getCommonProposals(common.id, proposalFilter);
  } else if (user) {
    list = proposalStore.getUserProposals(user.uid, proposalFilter);
  }
  let listRef = useRef([]);
  const renderProposalCard = (item: Proposal, index: number) =>
    isSwiper ? (
      !showMax || index < showMax ? (
        <ProposalCard
          proposalId={item.id}
          key={item.id}
          isSwiper={true}
          common={common}
        />
      ) : (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(NAVIGATION_SCREENS.MY_PROPOSALS, {
              proposalTypeFilter: proposalFilter.type,
            })
          }
          style={{...styles.commonBox}}>
          <Text style={styles.viewMoreText}>
            {`View all ${list.length} ${
              item.isJoinRequest ? 'Membership requests' : 'Proposals'
            }`}
          </Text>
        </TouchableOpacity>
      )
    ) : (
      <ProposalCard
        proposalId={item.id}
        key={item.id}
        isSwiper={false}
        common={common}
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
            {isTypeFilterJoin(proposalFilter.type)
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
          renderItem={({item, index}) => renderProposalCard(item, index)}
        />
      ) : (
        <ViewTabNoData
          title={
            isStageFilterHistory(proposalFilter.stage)
              ? 'No Past activity'
              : isTypeFilterJoin(proposalFilter.type)
              ? 'No pending requests'
              : 'No proposals'
          }
          subtitle={
            isStageFilterHistory(proposalFilter.stage)
              ? 'You will be able to see proposals that passed or were rejected here.'
              : isTypeFilterJoin(proposalFilter.type)
              ? 'There are no pending membership requests at the moment, check again later.'
              : 'Propose actions or request funding by creating proposals. The Common members will vote and decide to accept or reject them.'
          }
        />
      )}
    </>
  );
});

ProposalsList.propTypes = props;

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
  viewMoreText: {
    ...font.primary.bold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
    color: colors.black,
  },
});

export default inject('rootStore')(ProposalsList);
