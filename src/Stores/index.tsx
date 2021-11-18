import React from 'react';
import RootStore from './root-store';

const rootStore = new RootStore();

const store = {
  rootStore,
  authStore: rootStore.authStore,
  userStore: rootStore.userStore,
  commonStore: rootStore.commonStore,
  proposalStore: rootStore.proposalStore,
  discussionStore: rootStore.discussionStore,
  discussionMessageStore: rootStore.discussionMessageStore,
  notificationStore: rootStore.notificationStore,
  uiStore: rootStore.uiStore,
};

const StoreContext = React.createContext<RootStore>(rootStore);

// eslint-disable-next-line react/prop-types
export const Provider: React.FC = ({children}) => (
  <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
);

export const useStore = () => React.useContext(StoreContext);

export * from './currency-converter';
export default store;
