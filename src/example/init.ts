import { createStore } from '../';
// import Restash, { logger } from '../';

const initialState = {
  firstName: 'Bob',
  lastName: 'Jones',
  age: 35,
  numbers: {
    home: '8187771234',
    mobile: '7275678989'
  }
};

const { Context, Consumer, Provider, useStore } = createStore(initialState);

export {
  Context,
  Consumer,
  Provider,
  useStore
};

// const { createStore, applyMiddleware } = Restash(initialState, ['OTHER']);

// const { Provider, Context, Consumer, useStore, useStoreAt } =
//   createStore(
//     // applyMiddleware(logger())
//   );

// export {
//   Provider,
//   Context,
//   Consumer,
//   useStore,
//   useStoreAt
// };

