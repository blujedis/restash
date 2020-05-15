"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearPersistence = exports.useStore = exports.Provider = exports.Consumer = exports.Context = void 0;
const __1 = require("../");
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
const middleware = __1.applyMiddleware(__1.logger());
const { Context, Consumer, Provider, useStore, clearPersistence } = __1.createRestash({
    initialState,
    middleware,
    persistent: 'Restash',
    persistentKeys: ['firstName', 'lastName'],
    statuses: ['start', 'progress', 'error', 'complete']
});
exports.Context = Context;
exports.Consumer = Consumer;
exports.Provider = Provider;
exports.useStore = useStore;
exports.clearPersistence = clearPersistence;
//# sourceMappingURL=init.js.map