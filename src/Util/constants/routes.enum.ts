import {UserModel} from '~/Stores/Models/UserModel';

export enum NAVIGATION_SCREENS {
  ONBOARDING = 'Onboarding',
  COMMON_HOME = 'CommonHome',
  COMMON_PROFILE = 'CommonProfile',
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
  COMMON_MEMBERS = 'CommonMembers',
  FUNDING_PROPOSAL = 'FundingProposal',
  BILLING = 'Billing',
  MONTHLY_CONTRIBUTION = 'MonthlyContribution',
  VOTES_SCREEN = 'VotesScreen',
  CHOOSE_PAYMENT_METHOD_STEP = 'ChoosePaymentMethodStep',
}

export type NavigationRoutes = {
  Onboarding: undefined;
  CommonHome: undefined;
  CommonProfile: undefined;
  Explore: undefined;
  Profile: {userId: string; userInfo: UserModel};
  EditCommon: undefined;
  CommonAgenda: {commonId: string; canEdit: boolean; onEdit: () => void};
  CommonExplanation: undefined;
  ProposalScreen: undefined;
  AddInvoicesScreen: undefined;
  RulesStep: undefined;
  IntroductionStep: undefined;
  ContributionStep: undefined;
  BillingDetailsStep: undefined;
  PaymentDetailsStep: undefined;
  CreateStep1: undefined;
  CreateStep2: undefined;
  CreateStep3: undefined;
  CreateStep4: undefined;
  Discussions: undefined;
  FullScreenCreationLoader: undefined;
  NewDiscussion: undefined;
  EditProfile: undefined;
  PDFViewer: undefined;
  Browser: undefined;
  MyWallet: undefined;
  MyProposals: undefined;
  MyCommons: undefined;
  Notifications: undefined;
  CommonMembers: undefined;
  FundingProposal: undefined;
  Billing: undefined;
  MonthlyContribution: undefined;
  VotesScreen: undefined;
  ChoosePaymentMethodStep: undefined;
};
