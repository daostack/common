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
import auth from '@react-native-firebase/auth';
import ViewTabNoData from '~/Components/ViewTabNoData';
import ProposalCard from '~/Components/Proposals/ProposalCard';
import {layout, colors, font, text, sizeM} from '~/Theme';
import SwiperCard from '~/Components/SwiperCard';
import {Placeholder, PlaceholderMedia, Fade} from 'rn-placeholder';
import {string, bool, number, shape, func, InferProps} from 'prop-types';
import {observer, inject} from 'mobx-react';
import {Proposal} from '~/Stores/Models/Proposal';
import {
  isTypeFilterJoin,
  isStageFilterHistory,
} from '~/Stores/DataStores/ProposalStore';
import {rootStorePropTypes} from '~/Types/propTypes';
import {PERMISSIONS} from '~/Util/constants/permissions.enum';

const {width, height} = Dimensions.get('window');

const props = {
  // Required
  navigation: shape({
    navigate: func.isRequired,
  }).isRequired,
  proposalFilter: shape({
    type: string.isRequired,
    stage: string.isRequired,
  }).isRequired,

  // Optional
  commonInfo: shape({
    id: string,
    name: string,
  }),
  userInfo: shape({
    id: string,
  }),
  showMax: number,
  isSwiper: bool,
  openCommonOptions: func,
  showHiddenNote: func,
  isMember: bool,

  // Injected
  rootStore: rootStorePropTypes.isRequired,
};

const ProposalsList: React.FC<InferProps<typeof props>> = observer(
  ({
    navigation,
    proposalFilter,
    showMax,
    isSwiper,
    commonInfo,
    userInfo,
    rootStore,
    openCommonOptions,
    showHiddenNote,
    isMember,
  }) => {
    const [viewerPermission, setViewerPermission] = React.useState('');
    const isModerator = viewerPermission === PERMISSIONS.MODERATOR;
    let list: Proposal[] = [];
    if (commonInfo) {
      list = rootStore.proposalStore.getCommonProposals(
        commonInfo.id,
        proposalFilter,
      );
    } else if (userInfo) {
      list = rootStore.proposalStore.getUserProposals(
        userInfo.id,
        proposalFilter,
      );
    }

    const handleOpenCommonOptions = useCallback(
      (item) => {
        if (openCommonOptions) {
          openCommonOptions(item);
        }
      },
      [openCommonOptions],
    );

    const handleShowHiddenNote = useCallback(
      (args) => {
        if (showHiddenNote) {
          showHiddenNote(args);
        }
      },
      [showHiddenNote],
    );

    React.useEffect(() => {
      if (commonInfo) {
        const permission = rootStore.authStore.getPermission(
          commonInfo?.id,
          auth()?.currentUser?.uid,
        );
        setViewerPermission(permission);
      }
    }, [commonInfo]);

    let listRef = useRef([]);
    const renderProposalCard = (item: Proposal, index: number) =>
      isSwiper ? (
        !showMax || index < showMax ? (
          <ProposalCard
            proposalId={item.id}
            key={item.id}
            isSwiper={true}
            commonInfo={commonInfo}
            navigation={navigation}
            openCommonOptions={() => handleOpenCommonOptions(item)}
            hiddenProposalNote={() =>
              handleShowHiddenNote({hiddenItem: item, isModerator})
            }
            isMember={isMember}
            viewerPermission={viewerPermission}
          />
        ) : (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('MyProposals', {
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
          commonInfo={commonInfo}
          navigation={navigation}
          openCommonOptions={() => handleOpenCommonOptions(item)}
          hiddenProposalNote={() =>
            handleShowHiddenNote({hiddenItem: item, isModerator})
          }
          isMember={isMember}
          viewerPermission={viewerPermission}
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
  },
);

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
