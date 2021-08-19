import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {Text, TouchableOpacity, View} from 'react-native';
import CountDown from 'react-native-countdown-component';
import Icon from '~/Assets/iconfont/Icon';
import ProposalApprovalTag from '~/Components/Proposals/ProposalApprovalTag';
import {Proposal} from '~/Stores/Models/Proposal';
import {colors, layout, text} from '~/Theme';
import {ProposalStore} from '~/Types/store';

interface Props {
  userPendingPropDiscCount: number;
  pendingProposalsData: {
    pendingProposalCount: number;
    usersPendingProposal: Proposal;
  } | null;
  openProposalScreen: () => void;
  proposalStore: ProposalStore;
}

export const CommonPendingApproval = observer(
  ({
    userPendingPropDiscCount,
    pendingProposalsData,
    openProposalScreen,
    proposalStore,
  }: Props) => {
    const [proposalInfo, setProposalInfo] = useState<Proposal>();

    useEffect(() => {
      (async (): Promise<void> => {
        const proposal = await proposalStore.getProposalById(
          pendingProposalsData?.usersPendingProposal?.id,
        );
        setProposalInfo(proposal);
      })();
    }, [pendingProposalsData?.usersPendingProposal?.id]);

    const remainingSeconds = proposalInfo?.countdown - moment().unix();

    return (
      <TouchableOpacity
        onPress={openProposalScreen}
        style={{
          ...layout.content,
          paddingVertical: 15,
          ...{borderBottomWidth: 1, borderBottomColor: colors.grey4},
        }}>
        <View
          style={{
            ...layout.content,
            ...layout.flexRow,
            ...{padding: 0},
          }}>
          <Icon name="clcok" size={16} style={layout.marginRightXS} />
          <Text style={text.smallBoldGreyText}>Pending Approval</Text>
        </View>
        <View
          style={{
            ...layout.flexRow,
            ...layout.marginTopS,
            ...{width: '100%', justifyContent: 'space-between'},
          }}>
          <View style={layout.flexRow}>
            <ProposalApprovalTag
              iconName="approved"
              value={Number(
                pendingProposalsData?.usersPendingProposal.votesFor || 0,
              )}
              isMarked={true}
            />
            <ProposalApprovalTag
              iconName="declined"
              value={Number(
                pendingProposalsData?.usersPendingProposal.votesAgainst || 0,
              )}
              isMarked={false}
            />
            <ProposalApprovalTag
              iconName="discussion"
              value={Number(userPendingPropDiscCount || 0)}
              isMarked={false}
            />
          </View>
          <View>
            <CountDown
              digitTxtStyle={text.smallGreyText}
              separatorStyle={text.smallGreyText}
              timeLabels={false}
              showSeparator={true}
              digitStyle={{
                height: 'auto',
                width: 'auto',
              }}
              until={remainingSeconds}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);
