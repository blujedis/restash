import { Middleware } from '../types';
import { isUndefined } from '../utils';

// tslint:disable no-console

const _styles = {
  head: 'color: #666',
  stat: 'color: mediumpurple',
  prev: 'color: deepskyblue',
  next: 'color: mediumseagreen'
};

type Styles = typeof _styles;

export function logger<Y extends Styles = Styles>(styles?: Partial<Y>) {

  styles = { ..._styles, ...styles };

  const format = (type: keyof Styles, label: string, ...args: any[]) => [`%c${label}`, styles[type], ...args];

  const middleware: Middleware = (store) => next => payload => {

    if (!store.mounted || isUndefined(payload))
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


