
 <p align="left">
  <a href="http://github.com/blujedis/restash"><img src="https://raw.githubusercontent.com/blujedis/restash/master/fixtures/logo.png" width="225" /></a>
</p>

Restash is a simple [React](https://reactjs.org/) context store which uses [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) behind the scenes. The API is broken into components so that you can either use the default implementation or build up your own. Restash was developed using [Typescript](https://www.typescriptlang.org/) which gives you great code help if you are using an editor supporting it.

## Getting Started

```sh
$ npm install restash -s
```

OR

```sh
$ yarn add restash
```

## Restash

It's best or most flexibile if you break up your setup in a few small parts. Exposing the **Provider** to wrap your application, a store or init file to configure your store and finally using the exposed hook.

### Initialize Restash

After providing your context above initialize Restash in a file called for example <code>restash.tsx</code> for example. Then call <code>createRestash</code> passing our options and then export our new Restash store.

```tsx
import { createRestash } from 'restash';

const initialState = {
  firstName: 'Milton',
  lastName: 'Waddams'
};

const { Provider, useStore } = createRestash({initialState});

export {
  Provider,
  useStore
}
```

### Provide Context

Using our export from above expose the <code>Provider</code> and wrap our application so it knows about our context.

```tsx
import { Provider } from './restash';

// NOTE: you can also provide the initialState and reducer
// as params to your provider if you wish. If you provide
// a reducer or inital state in your "createRestash" init
// options those will be favored over params here.

const App = () => {
  return (
    <Provider>
        // Your App Here
    </Provider>
  );  
}
```

### Using Hook

We can now use our hook that's been created by our new Restash store.

```tsx
import { useStore } from './restash';

const Home = () => {

  const [state, dispatch] = useStore();

  const changeState = (key) => {
    return (e) => {
      dispatch({ [key]: e.target.value });
    };
  };

  return (
    <div>
      <h2 style={{ marginBottom: '12px' }}>Use Store</h2>
      <hr style={{ marginBottom: '20px' }} />
      <p style={{ padding: '12px', backgroundColor: '#eee', width: '50%' }}>
        Simple example wiring up input elements to state values
        changing the state on blur of each field.
      </p>
      <div style={{ marginBottom: '12px' }}>
        First Name: <input type="text" onBlur={changeState('firstName')} defaultValue={state.firstName} />
      </div>
      <div style={{ marginBottom: '12px' }}>
        Last Name: <input type="text" onBlur={changeState('lastName')} defaultValue={state.lastName} />
      </div>
      <h3 style={{marginTop: '32px'}}>Current State</h3>
      <pre>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );

};
```

### Initialize with Middleware

Initializing with middleware is very similar to [Redux](https://redux.js.org/). You create your middleware then call a helper method called **applyMiddleware** then pass to your options. By default Restash supports thunks which are useful for async tasks.

Restash currently comes with only one middleware. That being a simple console logger. Redux middleware should work however in many cases.

```tsx
import { createRestash, logger } from 'restash';

const initialState = {
  firstName: 'Milton',
  lastName: 'Waddams'
};

// The only logger options are that of styles
// for colorizing and styling in your console.
// see source for details.

const middleware = applyMiddleware(logger());

const options {
  initialState,
  middleware,
  persistent: 'some_unique_name' // this will cause state to persist within localStorage.
};

const { Provider, useStore } = createRestash(options);

export {
  Provider,
  useStore
}
```
