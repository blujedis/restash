import { createRestash, logger, applyMiddleware } from '../';
const _initialState = {
    firstName: 'Bob',
    lastName: 'Jones',
    age: 35,
    numbers: {
        home: '8187771234',
        mobile: '7275678989'
    }
};
const initialState = _initialState;
const middleware = applyMiddleware(logger());
const { Context, Consumer, Provider, useStore, clearPersistence } = createRestash({
    initialState,
    middleware,
    persistent: 'Restash',
    persistentKeys: ['firstName', 'lastName', 'numbers'],
    statuses: ['start', 'progress', 'error', 'complete']
});
export { Context, Consumer, Provider, useStore, clearPersistence };
//# sourceMappingURL=init.js.map