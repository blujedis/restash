import { createLogger, createStore, applyMiddleware } from '../';

interface IApp {
  other: number;
}

const logger = createLogger<IApp>();

/**
 * Create and export Restash store.
 */
const { Provider, Context, Consumer, useStore } = createStore<IApp>({
  initialState: { other: 33 },
  middleware: applyMiddleware<IApp>(logger),
  statuses: ['TEST']
});

export {
  Provider,
  Context,
  Consumer,
  useStore
};

