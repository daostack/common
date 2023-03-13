import {CommonCreatedBody} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {PersonalContributionFormStore} from '~/Stores/FormStores/MembershipAdmittance';
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

export type RouteProps<T> = {
  params: T;
  key: string;
  name: string;
};

export type PersonalContributionsRouteProps = RouteProps<{
  formStores: {
    personalContributionFormStore: PersonalContributionFormStore;
  };
  common: CommonCreatedBody & {id: string; minFeeToJoin: number};
}>;

export type PersonalPaymentDetailsRouteProps = RouteProps<{
  formStores: {
    personalContributionFormStore: PersonalContributionFormStore;
  };
  common: CommonCreatedBody & {id: string; minFeeToJoin: number};
  paymentId: string;
  iFrameLink: string;
}>;
