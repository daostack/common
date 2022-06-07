import FormStore from '~/Stores/FormStores/FormStore';
import {Common} from '~/Stores/Models/Common';
import {UserModel} from '~/Stores/Models/UserModel';

export enum NAVIGATION_SCREENS {
  ONBOARDING = 'Onboarding',
  COMMON_PROFILE = 'CommonProfile',
  COMMON_AGENDA = 'CommonAgenda',
  EXPLORE = 'Explore',
  PROFILE = 'Profile',
  EDIT_COMMON = 'EditCommon',
  COMMON_EXPLANATION = 'CommonExplanation',
  PROPOSAL_SCREEN = 'ProposalScreen',
  ADD_INVOICES_PROPOSAL = 'AddInvoicesScreen',
  RULES_STEP = 'RulesStep',
  MEMBERSHIP_ADMITTANCE = 'MembershipAdmittance',
  CONTRIBUTION_STEP = 'ContributionStep',
  BILLING_DETAILS_STEP = 'BillingDetailsStep',
  PAYMENT_DETAILS_STEP = 'PaymentDetailsStep',
  CREATE_COMMON_GENERAL_INFO = 'CreateCommonGeneralInfo',
  CREATE_COMMON_RULES = 'CreateCommonRules',
  CREATE_COMMON_REVIEW = 'CreateCommonReview',
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
  FUNDING_ALLOCATION = 'FundingAllocation',
  BILLING = 'Billing',
  MONTHLY_CONTRIBUTION = 'MonthlyContribution',
  VOTES_SCREEN = 'VotesScreen',
  CHOOSE_PAYMENT_METHOD_STEP = 'ChoosePaymentMethodStep',
  PHONE_NUMBER_STEP_1 = 'PhoneNumber',
  VERIFY_PHONE_STEP_2 = 'VerifyPhone',
  MONTHLY_CONTRIBUTION_CHARGES = 'MonthlyContributionCharges',
  CONTRIBUTION_HISTORY = 'ContributionHistory',
  MAKE_CONTRIBUTION = 'MakeContribution',
  CONTRIBUTION_PAYMENT_DETAILS = 'ContributionPaymentDetails',
  UPDATE_PAYMENT_DETAILS = 'UpdatePaymentDetails',
  HOME_TAB_NAVIGATOR = 'HomeTabNavigator',
}

export type NavigationRoutes = {
  Onboarding: undefined;
  HomeTabNavigator: undefined;
  CommonProfile: {screen: string; params: {currCommon: Common}};
  CommonAgenda: undefined;
  Explore: undefined;
  Profile: {userId: string; userInfo: UserModel};
  EditCommon: {currCommon: Common; type: string};
  // CommonAgenda: {commonId: string; canEdit: boolean; onEdit: () => void};
  CommonExplanation: undefined;
  ProposalScreen: {proposalId: string};
  AddInvoicesScreen: undefined;
  RulesStep: undefined;
  MembershipAdmittance: undefined;
  ContributionStep: undefined;
  BillingDetailsStep: undefined;
  PaymentDetailsStep: undefined;
  CreateCommonGeneralInfo: undefined;
  CreateCommonRules: undefined;
  CreateCommonReview: undefined;
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
  FundingAllocation: undefined;
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
