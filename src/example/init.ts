import { createLogger, createRestash } from '../';

const logger = createLogger();

const initialState = {
  firstName: 'Bob',
  lastName: 'Jones',
  age: 35
};

const { createStore, applyMiddleware } = createRestash(initialState, ['TEST']);

const { Provider, Context, Consumer, useStore } = createStore(applyMiddleware(logger));

export {
  Provider,
  Context,
  Consumer,
  useStore
};

