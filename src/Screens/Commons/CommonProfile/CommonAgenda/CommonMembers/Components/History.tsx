import React, {ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';

import {PROPOSAL_TYPE, PROPOSAL_STAGE} from '~/Config';
import ProposalsList from '~/Screens/Proposals/ProposalsList';

interface Props {
  commonId: string;
}

export const History = ({commonId}: Props): ReactElement => (
  <View>
    <ProposalsList
      commonInfo={{id: commonId}}
      proposalFilter={{
        stage: PROPOSAL_STAGE.History,
        type: PROPOSAL_TYPE.Join,
      }}
      flatListStyle={styles.proposalsList}
      listContainerStyle={styles.listContainer}
    />
  </View>
);

const styles = StyleSheet.create({
  proposalsList: {
    paddingHorizontal: 24,
  },
  listContainer: {
    paddingTop: 24,
  },
});
