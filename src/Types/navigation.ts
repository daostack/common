import {StackActionType} from '@react-navigation/native';
import {Common} from '~/Stores/Models/Common';
import {PersonalContributionFormStore} from '~/Stores/FormStores/MembershipAdmittance';

interface NavigationProps {
  dispatch: (arg: StackActionType) => void;
  pop: () => void;
  goBack: () => void;
  setOptions: (value: any) => void;
}

export interface WithNavigationRef {
  navigation: {
    current: NavigationProps;
  };
}
export interface WithNavigation {
  navigation: NavigationProps;
}

export type RouteProps<T> = {
  params: T;
  key: string;
  name: string;
};

export type AddInvoicesRouteProps = RouteProps<{proposalId: string}>;

export type VotesScreenRouteProps = RouteProps<{
  proposalId: string;
  commonName: string;
}>;

export type ContributionHistoryRouteProps = RouteProps<{
  common: Common;
}>;

export type MakeContributionRouteProps = RouteProps<{
  common: Common;
  isMonthly: boolean;
  subscriptionId?: string;
  formStores: {
    personalContributionFormStore: PersonalContributionFormStore;
  };
}>;

export type ContributionPaymentDetailsRouteProps = RouteProps<{
  commonName: string;
}>;
