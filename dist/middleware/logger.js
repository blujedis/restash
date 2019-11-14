"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
// tslint:disable no-console
const _styles = {
    head: 'color: #666',
    stat: 'color: mediumpurple',
    prev: 'color: deepskyblue',
    next: 'color: mediumseagreen'
};
function logger(styles) {
    styles = { ..._styles, ...styles };
    const format = (type, label, ...args) => [`%c${label}`, styles[type], ...args];
    const middleware = (store) => next => payload => {
        if (!store.mounted || utils_1.isUndefined(payload))
            return store.state;
        let nextState;
        const prevState = nextState = store.state;
        const status = store.status;
        const label = format('head', new Date().toTimeString());
        console.group(...label);
        if (status)
            console.log(...format('stat', 'status:', status));
        console.log(...format('prev', 'prev state:', prevState));
        nextState = next(payload);
        console.log(...format('next', 'next state:', nextState));
        console.groupEnd();
        return nextState;
    };
    return middleware;
}
exports.logger = logger;
//# sourceMappingURL=logger.js.map