import { lazy, type Component } from 'solid-js';

export interface BlockVariantInfo {
  id: string;
  title: string;
  description?: string;
  component: Component;
}

export interface BlockInfo {
  category: string;
  title: string;
  variants: BlockVariantInfo[];
}

// Lazy-loaded block variant components
// Authentication
const ModernCardLogin = lazy(() => import('../pages/blocks/authentication/login').then(m => ({ default: m.ModernCardLogin })));
const PremiumSplitLogin = lazy(() => import('../pages/blocks/authentication/login').then(m => ({ default: m.PremiumSplitLogin })));
const MinimalLogin = lazy(() => import('../pages/blocks/authentication/login').then(m => ({ default: m.MinimalLogin })));

const ModernCardSignup = lazy(() => import('../pages/blocks/authentication/signup').then(m => ({ default: m.ModernCardSignup })));
const PremiumSplitSignup = lazy(() => import('../pages/blocks/authentication/signup').then(m => ({ default: m.PremiumSplitSignup })));
const MultiStepSignup = lazy(() => import('../pages/blocks/authentication/signup').then(m => ({ default: m.MultiStepSignup })));

const ModernCardForgotPassword = lazy(() => import('../pages/blocks/authentication/forgot-password').then(m => ({ default: m.ModernCardForgotPassword })));
const SplitScreenForgotPassword = lazy(() => import('../pages/blocks/authentication/forgot-password').then(m => ({ default: m.SplitScreenForgotPassword })));
const MinimalForgotPassword = lazy(() => import('../pages/blocks/authentication/forgot-password').then(m => ({ default: m.MinimalForgotPassword })));

const ModernCardResetPassword = lazy(() => import('../pages/blocks/authentication/reset-password').then(m => ({ default: m.ModernCardResetPassword })));
const SplitScreenResetPassword = lazy(() => import('../pages/blocks/authentication/reset-password').then(m => ({ default: m.SplitScreenResetPassword })));
const MinimalResetPassword = lazy(() => import('../pages/blocks/authentication/reset-password').then(m => ({ default: m.MinimalResetPassword })));

const OtpVerificationCard = lazy(() => import('../pages/blocks/authentication/otp-verification').then(m => ({ default: m.OtpVerificationCard })));
const OtpVerificationSplit = lazy(() => import('../pages/blocks/authentication/otp-verification').then(m => ({ default: m.OtpVerificationSplit })));
const OtpVerificationMinimal = lazy(() => import('../pages/blocks/authentication/otp-verification').then(m => ({ default: m.OtpVerificationMinimal })));

const OrganizationSelectLogin = lazy(() => import('../pages/blocks/authentication/organization-auth').then(m => ({ default: m.OrganizationSelectLogin })));
const OrganizationSignup = lazy(() => import('../pages/blocks/authentication/organization-auth').then(m => ({ default: m.OrganizationSignup })));
const TeamInvitationAccept = lazy(() => import('../pages/blocks/authentication/organization-auth').then(m => ({ default: m.TeamInvitationAccept })));

const CompleteAuthFlow = lazy(() => import('../pages/blocks/authentication/auth-flow').then(m => ({ default: m.CompleteAuthFlow })));

// Dashboard
const AnalyticsFull = lazy(() => import('../pages/blocks/dashboard/analytics').then(m => ({ default: m.AnalyticsFull })));
const AnalyticsSales = lazy(() => import('../pages/blocks/dashboard/analytics').then(m => ({ default: m.AnalyticsSales })));
const AnalyticsRealtime = lazy(() => import('../pages/blocks/dashboard/analytics').then(m => ({ default: m.AnalyticsRealtime })));

const OverviewModern = lazy(() => import('../pages/blocks/dashboard/overview').then(m => ({ default: m.OverviewModern })));
const OverviewCompact = lazy(() => import('../pages/blocks/dashboard/overview').then(m => ({ default: m.OverviewCompact })));
const OverviewFocus = lazy(() => import('../pages/blocks/dashboard/overview').then(m => ({ default: m.OverviewFocus })));

const AdminPanel = lazy(() => import('../pages/blocks/dashboard/admin-panel').then(m => ({ default: m.AdminPanel })));

// Settings
const ProfileModern = lazy(() => import('../pages/blocks/settings/profile').then(m => ({ default: m.ProfileModern })));
const ProfileSplit = lazy(() => import('../pages/blocks/settings/profile').then(m => ({ default: m.ProfileSplit })));
const ProfileMinimal = lazy(() => import('../pages/blocks/settings/profile').then(m => ({ default: m.ProfileMinimal })));

const NotificationsModern = lazy(() => import('../pages/blocks/settings/notifications').then(m => ({ default: m.NotificationsModern })));
const NotificationsSplit = lazy(() => import('../pages/blocks/settings/notifications').then(m => ({ default: m.NotificationsSplit })));
const NotificationsCompact = lazy(() => import('../pages/blocks/settings/notifications').then(m => ({ default: m.NotificationsCompact })));

const AccountModern = lazy(() => import('../pages/blocks/settings/account').then(m => ({ default: m.AccountModern })));
const AccountSplit = lazy(() => import('../pages/blocks/settings/account').then(m => ({ default: m.AccountSplit })));
const AccountCompact = lazy(() => import('../pages/blocks/settings/account').then(m => ({ default: m.AccountCompact })));

// Data Management
const CrudModern = lazy(() => import('../pages/blocks/data-management/crud-interface').then(m => ({ default: m.CrudModern })));
const CrudSplit = lazy(() => import('../pages/blocks/data-management/crud-interface').then(m => ({ default: m.CrudSplit })));
const CrudCompact = lazy(() => import('../pages/blocks/data-management/crud-interface').then(m => ({ default: m.CrudCompact })));

const TableViewModern = lazy(() => import('../pages/blocks/data-management/table-view').then(m => ({ default: m.TableViewModern })));
const TableViewSplit = lazy(() => import('../pages/blocks/data-management/table-view').then(m => ({ default: m.TableViewSplit })));
const TableViewMinimal = lazy(() => import('../pages/blocks/data-management/table-view').then(m => ({ default: m.TableViewMinimal })));

const ListViewModern = lazy(() => import('../pages/blocks/data-management/list-view').then(m => ({ default: m.ListViewModern })));
const ListViewGrid = lazy(() => import('../pages/blocks/data-management/list-view').then(m => ({ default: m.ListViewGrid })));
const ListViewCompact = lazy(() => import('../pages/blocks/data-management/list-view').then(m => ({ default: m.ListViewCompact })));

const SearchFilterModern = lazy(() => import('../pages/blocks/data-management/search-filter').then(m => ({ default: m.SearchFilterModern })));
const SearchFilterHorizontal = lazy(() => import('../pages/blocks/data-management/search-filter').then(m => ({ default: m.SearchFilterHorizontal })));
const SearchFilterCompact = lazy(() => import('../pages/blocks/data-management/search-filter').then(m => ({ default: m.SearchFilterCompact })));

// Messaging
const ModernChatInterface = lazy(() => import('../pages/blocks/messaging/in-app-messages').then(m => ({ default: m.ModernChatInterface })));
const SlackStyleChat = lazy(() => import('../pages/blocks/messaging/in-app-messages').then(m => ({ default: m.SlackStyleChat })));
const WhatsAppStyle = lazy(() => import('../pages/blocks/messaging/in-app-messages').then(m => ({ default: m.WhatsAppStyle })));

// Block registry mapping paths to block info
export const blockRegistry: Record<string, BlockInfo> = {
  // Authentication
  'authentication/login': {
    category: 'Authentication',
    title: 'Login',
    variants: [
      { id: 'modern-card', title: 'Modern Card', component: ModernCardLogin },
      { id: 'premium-split', title: 'Split Screen', component: PremiumSplitLogin },
      { id: 'minimal', title: 'Minimal', component: MinimalLogin },
    ],
  },
  'authentication/signup': {
    category: 'Authentication',
    title: 'Signup',
    variants: [
      { id: 'modern-card', title: 'Modern Card', component: ModernCardSignup },
      { id: 'premium-split', title: 'Split Screen', component: PremiumSplitSignup },
      { id: 'multi-step', title: 'Multi-Step', component: MultiStepSignup },
    ],
  },
  'authentication/forgot-password': {
    category: 'Authentication',
    title: 'Forgot Password',
    variants: [
      { id: 'modern-card', title: 'Modern Card', component: ModernCardForgotPassword },
      { id: 'split-screen', title: 'Split Screen', component: SplitScreenForgotPassword },
      { id: 'minimal', title: 'Minimal', component: MinimalForgotPassword },
    ],
  },
  'authentication/reset-password': {
    category: 'Authentication',
    title: 'Reset Password',
    variants: [
      { id: 'modern-card', title: 'Modern Card', component: ModernCardResetPassword },
      { id: 'split-screen', title: 'Split Screen', component: SplitScreenResetPassword },
      { id: 'minimal', title: 'Minimal', component: MinimalResetPassword },
    ],
  },
  'authentication/otp-verification': {
    category: 'Authentication',
    title: 'OTP Verification',
    variants: [
      { id: 'card', title: 'Card', component: OtpVerificationCard },
      { id: 'split', title: 'Split Screen', component: OtpVerificationSplit },
      { id: 'minimal', title: 'Minimal', component: OtpVerificationMinimal },
    ],
  },
  'authentication/organization-auth': {
    category: 'Authentication',
    title: 'Organization Auth',
    variants: [
      { id: 'org-select-login', title: 'Organization Select', component: OrganizationSelectLogin },
      { id: 'org-signup', title: 'Workspace Signup', component: OrganizationSignup },
      { id: 'team-invite', title: 'Team Invitation', component: TeamInvitationAccept },
    ],
  },
  'authentication/auth-flow': {
    category: 'Authentication',
    title: 'Auth Flow',
    variants: [
      { id: 'complete-flow', title: 'Complete Flow', component: CompleteAuthFlow },
    ],
  },
  // Dashboard
  'dashboard/analytics': {
    category: 'Dashboard',
    title: 'Analytics',
    variants: [
      { id: 'full', title: 'Full Dashboard', component: AnalyticsFull },
      { id: 'sales', title: 'Sales Focus', component: AnalyticsSales },
      { id: 'realtime', title: 'Realtime', component: AnalyticsRealtime },
    ],
  },
  'dashboard/overview': {
    category: 'Dashboard',
    title: 'Overview',
    variants: [
      { id: 'modern', title: 'Modern', component: OverviewModern },
      { id: 'compact', title: 'Compact', component: OverviewCompact },
      { id: 'focus', title: 'Focus', component: OverviewFocus },
    ],
  },
  'dashboard/admin-panel': {
    category: 'Dashboard',
    title: 'Admin Panel',
    variants: [
      { id: 'full', title: 'Full Panel', component: AdminPanel },
    ],
  },
  // Settings
  'settings/profile': {
    category: 'Settings',
    title: 'Profile',
    variants: [
      { id: 'modern', title: 'Modern', component: ProfileModern },
      { id: 'split', title: 'Split Layout', component: ProfileSplit },
      { id: 'minimal', title: 'Minimal', component: ProfileMinimal },
    ],
  },
  'settings/notifications': {
    category: 'Settings',
    title: 'Notifications',
    variants: [
      { id: 'modern', title: 'Modern', component: NotificationsModern },
      { id: 'split', title: 'Split Layout', component: NotificationsSplit },
      { id: 'compact', title: 'Compact', component: NotificationsCompact },
    ],
  },
  'settings/account': {
    category: 'Settings',
    title: 'Account',
    variants: [
      { id: 'modern', title: 'Modern', component: AccountModern },
      { id: 'split', title: 'Split Layout', component: AccountSplit },
      { id: 'compact', title: 'Compact', component: AccountCompact },
    ],
  },
  // Data Management
  'data-management/crud-interface': {
    category: 'Data Management',
    title: 'CRUD Interface',
    variants: [
      { id: 'modern', title: 'Modern', component: CrudModern },
      { id: 'split', title: 'Split Layout', component: CrudSplit },
      { id: 'compact', title: 'Compact', component: CrudCompact },
    ],
  },
  'data-management/table-view': {
    category: 'Data Management',
    title: 'Table View',
    variants: [
      { id: 'modern', title: 'Modern', component: TableViewModern },
      { id: 'split', title: 'Split Layout', component: TableViewSplit },
      { id: 'minimal', title: 'Minimal', component: TableViewMinimal },
    ],
  },
  'data-management/list-view': {
    category: 'Data Management',
    title: 'List View',
    variants: [
      { id: 'modern', title: 'Modern', component: ListViewModern },
      { id: 'grid', title: 'Grid View', component: ListViewGrid },
      { id: 'compact', title: 'Compact', component: ListViewCompact },
    ],
  },
  'data-management/search-filter': {
    category: 'Data Management',
    title: 'Search & Filter',
    variants: [
      { id: 'modern', title: 'Modern', component: SearchFilterModern },
      { id: 'horizontal', title: 'Horizontal', component: SearchFilterHorizontal },
      { id: 'compact', title: 'Compact', component: SearchFilterCompact },
    ],
  },
  // Messaging
  'messaging/in-app-messages': {
    category: 'Messaging',
    title: 'In-App Messages',
    variants: [
      { id: 'modern', title: 'Modern Chat', component: ModernChatInterface },
      { id: 'slack', title: 'Slack-style', component: SlackStyleChat },
      { id: 'whatsapp', title: 'WhatsApp-style', component: WhatsAppStyle },
    ],
  },
};

export function getBlockInfo(path: string): BlockInfo | undefined {
  console.warn('[Registry] getBlockInfo:', path, 'exists:', path in blockRegistry);
  return blockRegistry[path];
}

export function getBlockVariant(path: string, variantIndex: number): BlockVariantInfo | undefined {
  console.warn('[Registry] getBlockVariant:', path, 'index:', variantIndex);
  console.warn('[Registry] Available keys:', Object.keys(blockRegistry));
  const block = blockRegistry[path];
  console.warn('[Registry] Block found:', !!block);
  if (!block) return undefined;
  const variant = block.variants[variantIndex];
  console.warn('[Registry] Variant found:', !!variant);
  return variant;
}
