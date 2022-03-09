import {CommonCreatedBody} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {PersonalContributionFormStore} from '~/Stores/FormStores/RequestToJoin';
import {Common} from '~/Stores/Models/Common';
import {RootStore} from '~/Types/store';

export type CommonMembersRouteProps = {
  params: {
    commonId: string;
    hasPermission: string;
    openCommonOptions: (item: string, itemType?: string) => void;
    showHiddenNote: (item: string, itemType?: string) => void;
    isMember: boolean;
  };
  key: string;
  name: string;
};

export interface CommonMembersProps {
  rootStore: RootStore;
}

export interface PersonalContributionsRouteProps {
  params: {
    formStores: {
      personalContributionFormStore: PersonalContributionFormStore;
    };
    common: CommonCreatedBody;
    contributionData: {
      contributionType: string;
      zeroContribution: boolean;
      minFeeToJoin: number;
    };
  };
  key: string;
  name: string;
}

export interface PersonalPaymentDetailsRouteProps {
  params: {
    formStores: {
      personalContributionFormStore: PersonalContributionFormStore;
    };
    common: CommonCreatedBody;
    contributionData: {
      contributionType: string;
      zeroContribution: boolean;
      minFeeToJoin: number;
    };
    iFrameLink: string;
    cardId: string;
  };
  key: string;
  name: string;
}
