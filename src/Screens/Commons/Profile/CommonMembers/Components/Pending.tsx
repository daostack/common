import React, {ReactElement} from 'react';
import {View} from 'react-native';

import ProposalsList from '../../../../Proposals/ProposalsList';
import {PROPOSAL_TYPE, PROPOSAL_STAGE} from '~/Config';
import {layout} from '~/Theme';

interface Props {
  commonId: string;
  hasPermission: string;
  openCommonOptions: (item: string, itemType?: string) => void;
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
  <View style={layout.content}>
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
    />
  </View>
);
