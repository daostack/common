import React, {ReactElement} from 'react';
import {View} from 'react-native';

import ProposalsList from '../../../../Proposals/ProposalsList';
import {PROPOSAL_TYPE, PROPOSAL_STAGE} from '~/Config';
import {layout} from '~/Theme';

interface Props {
  commonId: string;
}

export const History = ({commonId}: Props): ReactElement => (
  <View style={layout.content}>
    <ProposalsList
      commonInfo={{id: commonId}}
      proposalFilter={{
        stage: PROPOSAL_STAGE.History,
        type: PROPOSAL_TYPE.Join,
      }}
    />
  </View>
);
