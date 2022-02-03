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
