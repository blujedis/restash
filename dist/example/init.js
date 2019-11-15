"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const { Context, Consumer, Provider, useStore } = __1.createRestash({
    initialState,
    middleware,
    persistent: 'Restash'
});
exports.Context = Context;
exports.Consumer = Consumer;
exports.Provider = Provider;
exports.useStore = useStore;
//# sourceMappingURL=init.js.map