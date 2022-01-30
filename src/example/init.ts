import { createRestash, logger, applyMiddleware, DeepPartial } from '../';

const _initialState = {
  firstName: 'Bob',
  lastName: 'Jones',
  age: 35,
  numbers: {
    home: '8187771234',
    mobile: '7275678989'
  }
};

// Cast to partial.
type InitialState = DeepPartial<typeof _initialState>;
const initialState = _initialState as InitialState;

const middleware = applyMiddleware(logger());

const { Context, Consumer, Provider, useStore, clearPersistence } = createRestash({
  initialState,
  middleware,
  persistent: 'Restash',
  persistentKeys: ['firstName', 'lastName', 'numbers.mobile'],
  statuses: ['start', 'progress', 'error', 'complete']
});

export {
  Context,
  Consumer,
  Provider,
  useStore,
  clearPersistence
};