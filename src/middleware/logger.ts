import { Middleware } from '../types';

const styles = {
  head: 'color: #666',
  stat: 'color: mediumpurple',
  prev: 'color: deepskyblue',
  next: 'color: mediumseagreen'
};

type Types = typeof styles;

const format = (type: keyof Types, label: string, ...args: any[]) => [`%c${label}`, styles[type], ...args];

export function createLogger<App>() {

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

  return middleware as Middleware<App>;

}


