import { isUndefined } from '../utils';
const _styles = {
    head: 'color: #666',
    stat: 'color: mediumpurple',
    prev: 'color: deepskyblue',
    next: 'color: mediumseagreen'
};
export function logger(styles) {
    styles = { ..._styles, ...styles };
    const format = (type, label, ...args) => [`%c${label}`, styles[type], ...args];
    const middleware = (store) => next => payload => {
        if (!store.mounted || isUndefined(payload))
            return store.state;
        let nextState;
        const prevState = nextState = store.state;
        const status = store.status;
        const label = format('head', new Date().toTimeString());
        nextState = next(payload);
        console.group(...label);
        console.log(...format('prev', 'prev state:', prevState));
        console.log(...format('next', 'next state:', nextState));
        console.log(...format('stat', 'status:', status || 'none', '>', store.status));
        console.groupEnd();
        return nextState;
    };
    return middleware;
}
//# sourceMappingURL=logger.js.map