import { createStore, applyMiddleware, Middleware, StatusType } from '../';
import Themes from './themes';

export interface IAppState {
  nested?: boolean;
  nestedObj?: {
    firstName?: string;
    lastName?: string;
  };
}

type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'log';

const styles = {
  error: 'color: red; font-weight: bold',
  warn: 'color: yellow',
  info: 'color: blue',
  debug: 'color: magenta',
  log: 'color: #666'
};

// tslint:disable:no-console
const createLogger = (store) => {
  const { mounted } = store;
  function logger(type: LogLevel, ...args: any[]) {
    if (!mounted) return log;
    const _log = console[type || 'log'].bind(console);
    _log(...args);
    return log;
  }
  function log(...args: any[]) {
    return logger('log', ...args);
  }
  log.error = (...args: any[]) => logger('error', ...args);
  log.warn = (...args: any[]) => logger('warn', ...args);
  log.info = (...args: any[]) => logger('info', ...args);
  log.debug = (...args: any[]) => logger('debug', ...args);
  log.label = (type: LogLevel, value) => [`%c${value}`, styles[type]];
  log.group = label => {
    const api = {
      _messages: [],
      _log: (type, prefix, ...args: any[]) => {
        args = [...log.label(type, prefix), ...args];

      },
      error(name, ...args: any[]) {
        //
      },
      end() {
        log.collapse();
        log.end();
      }
    };
    return api;
  };
  log.start = label => mounted && console.group(label);
  log.collapse = () => mounted && console.groupCollapsed();
  log.end = () => mounted && console.groupEnd();
  return log;
};


const storeLogger: Middleware<IAppState> = store => next => payload => {

  const log = createLogger(store);

  let nextState;
  const prevState = nextState = store.getState();

  if (typeof payload === 'undefined')
    return nextState;

  // log('PREV STATE:', prevState);
  nextState = next(payload);
  // log('NEXT STATE:', nextState);

  return nextState;

};

const middleware = applyMiddleware(storeLogger);

const appStore = createStore<IAppState, typeof Themes>({
  // middleware,
  themes: Themes
});

const Context = appStore.Context;
const Provider = appStore.Provider;
const Consumer = appStore.Consumer;
const useStore = appStore.useStore;
const useTheme = appStore.useTheme;

export * from '../';

export {
  Context,
  Provider,
  Consumer,
  useStore,
  useTheme
};
