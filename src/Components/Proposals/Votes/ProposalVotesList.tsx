import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import ViewTabNoData from '~/Components/ViewTabNoData';
import ProposalVoteCard from '~/Components/Proposals/Votes/ProposalVoteCard';
import {IProposalVote} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {NavigationProps} from '~/Types/navigation';
import colors from '~/Theme/colors';

type Props = {
  list: IProposalVote[];
  navigation: NavigationProps;
  commonId: string;
};

const ProposalsVotesList: React.FC<Props> = ({list, commonId}) => {
  const renderProposalCard = (item: IProposalVote) => (
    <ProposalVoteCard proposalVote={item} commonId={commonId} />
  );

  return (
    <View style={styles.container}>
      {list && list.length > 0 ? (
        <FlatList
          data={list}
          renderItem={({item}) => renderProposalCard(item)}
        />
      ) : (
        <ViewTabNoData subtitle={'no votes'} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default ProposalsVotesList;
