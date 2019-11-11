"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const styles = {
    head: 'color: #666',
    stat: 'color: mediumpurple',
    prev: 'color: deepskyblue',
    next: 'color: mediumseagreen'
};
const format = (type, label, ...args) => [`%c${label}`, styles[type], ...args];
function createLogger() {
    const middleware = (store) => next => payload => {
        if (!store.mounted)
            return store.getState();
        let nextState;
        const prevState = nextState = store.getState();
        if (typeof payload === 'undefined')
            return nextState;
        const status = store.getStatus();
        const label = format('head', new Date().toTimeString());
        console.group(...label);
        console.log(...format('stat', 'STATUS:', '(' + status.toUpperCase() + ')'));
        console.log(...format('prev', 'PREV STATE:', prevState));
        nextState = next(payload);
        console.log(...format('next', 'NEXT STATE:', nextState));
        console.groupEnd();
        return nextState;
    };
    return middleware;
}
exports.createLogger = createLogger;
//# sourceMappingURL=logger.js.map