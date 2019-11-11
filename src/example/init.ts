import { createStore, applyMiddleware, Middleware, StatusType } from '../';
import { createLogger } from '../middleware';
import Themes from './themes';

export interface IAppState {
  nested?: boolean;
  nestedObj?: {
    firstName?: string;
    lastName?: string;
  };
}

const middleware = applyMiddleware(createLogger<IAppState>());

const appStore = createStore<IAppState, typeof Themes>({
  middleware,
  themes: Themes
});

const Context = appStore.Context;
const Provider = appStore.Provider;
const Consumer = appStore.Consumer;
const useStore = appStore.useStore;
const useTheme = appStore.useTheme;
const useStatus = appStore.useStatus;

export * from '../';

export {
  Context,
  Provider,
  Consumer,
  useStore,
  useTheme,
  useStatus
};
