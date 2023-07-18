import FormStore from '~/Stores/FormStores/FormStore';
import {Common} from '~/Stores/Models/Common';
import {UserModel} from '~/Stores/Models/UserModel';

export enum NAVIGATION_SCREENS {
  ONBOARDING = 'Onboarding',
  // COMMON_PROFILE = 'CommonProfile',
  COMMON_AGENDA = 'CommonAgenda',
  EXPLORE = 'Explore',
  PROFILE = 'Profile',
  EDIT_COMMON = 'EditCommon',
  COMMON_EXPLANATION = 'CommonExplanation',
  PROPOSAL_SCREEN = 'ProposalScreen',
  ADD_INVOICES_PROPOSAL = 'AddInvoicesScreen',
  RULES_STEP = 'RulesStep',
  INTRODUCTION_STEP = 'IntroductionStep',
  CONTRIBUTION_STEP = 'ContributionStep',
  BILLING_DETAILS_STEP = 'BillingDetailsStep',
  PAYMENT_DETAILS_STEP = 'PaymentDetailsStep',
  CREATE_STEP_1 = 'CreateStep1',
  CREATE_STEP_2 = 'CreateStep2',
  CREATE_STEP_3 = 'CreateStep3',
  CREATE_STEP_4 = 'CreateStep4',
  DISCUSSIONS = 'Discussions',
  FULL_SCREEN_CREATION_LOADER = 'FullScreenCreationLoader',
  NEW_DISCUSSION = 'NewDiscussion',
  EDIT_PROFILE = 'EditProfile',
  PDF_VIEWER = 'PDFViewer',
  BROWSER = 'Browser',
  MY_WALLET = 'MyWallet',
  MY_PROPOSALS = 'MyProposals',
  MY_COMMONS = 'MyCommons',
  NOTIFICATIONS = 'Notifications',
  WALLET = 'Wallet',
  COMMON_MEMBERS = 'CommonMembers',
  FUNDING_PROPOSAL = 'FundingProposal',
  BILLING = 'Billing',
  MONTHLY_CONTRIBUTION = 'MonthlyContribution',
  VOTES_SCREEN = 'VotesScreen',
  CHOOSE_PAYMENT_METHOD_STEP = 'ChoosePaymentMethodStep',
  MONTHLY_CONTRIBUTION_CHARGES = 'MonthlyContributionCharges',
  CONTRIBUTION_HISTORY = 'ContributionHistory',
  MAKE_CONTRIBUTION = 'MakeContribution',
  CONTRIBUTION_PAYMENT_DETAILS = 'ContributionPaymentDetails',
  UPDATE_PAYMENT_DETAILS = 'UpdatePaymentDetails',
  HOME_TAB_NAVIGATOR = 'HomeTabNavigator',
}

export type NavigationRoutes = {
  WebViewScreen: undefined;
  Onboarding: undefined;
  HomeTabNavigator: undefined;
  // CommonProfile: {
  //   screen?: string;
  //   params?: {commonId: string};
  //   commonId?: string;
  // };
  CommonAgenda: undefined;
  Explore: undefined;
  Profile: {userId: string; userInfo: UserModel};
  EditCommon: {currCommon: Common; type: string};
  // CommonAgenda: {commonId: string; canEdit: boolean; onEdit: () => void};
  CommonExplanation: undefined;
  ProposalScreen: {proposalId: string};
  AddInvoicesScreen: undefined;
  RulesStep: undefined;
  IntroductionStep: {
    currCommon: Common;
    skipFirstStep: boolean;
    formStores: {
      paymentFormStore: FormStore;
      introduceYourselfFormStore: FormStore;
      personalContributionFormStore: FormStore;
      billingDetailsFormStore: FormStore;
    };
  };
  ContributionStep: undefined;
  BillingDetailsStep: undefined;
  PaymentDetailsStep: undefined;
  CreateStep1: undefined;
  CreateStep2: undefined;
  CreateStep3: undefined;
  CreateStep4: undefined;
  Discussions: undefined;
  FullScreenCreationLoader: undefined;
  NewDiscussion: {commonId: string};
  EditProfile: undefined;
  PDFViewer: undefined;
  Browser: {url: string};
  MyWallet: undefined;
  MyProposals: undefined;
  MyCommons: undefined;
  Notifications: undefined;
  CommonMembers: undefined;
  FundingProposal: {common: Common; commonId: string; screenTitle: string};
  Billing: undefined;
  MonthlyContribution: undefined;
  VotesScreen: undefined;
  ChoosePaymentMethodStep: undefined;
  MonthlyContributionCharges: undefined;
  ContributionHistory: {common: Common};
  MakeContribution: undefined;
  ContributionPaymentDetails: undefined;
  UpdatePaymentDetails: undefined;
  FirstJoinCommon: {currCommon: Common};
};
