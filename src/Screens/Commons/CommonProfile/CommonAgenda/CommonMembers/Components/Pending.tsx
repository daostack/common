import React, {ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';

import {PROPOSAL_TYPE, PROPOSAL_STAGE} from '~/Config';
import ProposalsList from '~/Screens/Proposals/ProposalsList';

interface Props {
  commonId: string;
  hasPermission: string;
  openCommonOptions: (item: string) => void;
  showHiddenNote: (item: string, itemType?: string) => void;
  isMember: boolean;
}

export const Pending = ({
  commonId,
  hasPermission,
  openCommonOptions,
  showHiddenNote,
  isMember,
}: Props): ReactElement => (
  <View>
    <ProposalsList
      commonInfo={{id: commonId}}
      hasPermission={hasPermission}
      proposalFilter={{
        stage: PROPOSAL_STAGE.Active,
        type: PROPOSAL_TYPE.Join,
      }}
      openCommonOptions={(requestToJoin) => openCommonOptions(requestToJoin)}
      showHiddenNote={(hiddenRequestToJoin) =>
        showHiddenNote(hiddenRequestToJoin)
      }
      isMember={isMember}
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
