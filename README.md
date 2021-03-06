
 <p align="left">
  <a href="http://github.com/blujedis/restash"><img src="https://raw.githubusercontent.com/blujedis/restash/master/fixtures/logo.png" width="225" /></a>
</p>

Restash is a simple [React](https://reactjs.org/) context store which uses [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) behind the scenes. The API is broken into components so that you can either use the default implementation or build up your own. 

## NEW!!

Restash now supports dot notation for properties! The below will give you 

```tsx
// Consider this state
const state = {
  person: {
    firstName: 'Milton',
    lastName: 'Waddams',
    numbers: {
      home: '8985551212',
      mobile: '8985551234'
    }
  }
};

const [nestedState, setNestedState] = useStore('person.numbers.mobile');

// Nested state here will be equal to '8985551234';
// Update it as follows.

const updateState = (value) => {
  setNestedState(value);
};

```

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

### Middleware, Persistence & Statuses

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

  // The initial data state.
  initialState,

  // The middleware to process before updating state.
  middleware,

  // This is required when using Restash in an SSR environment.
  // Your state will load from this key. If present Restash
  // will load it.
  ssrKey: 'some_unique_ssr_key',

  // this will cause state to persist within localStorage.
  // when your app loads it will again look for this key.
  persistent: 'some_unique_name' 

  // Statuses are used as the second dispatch argument.
  // The enable triggering things based on their state.
  statuses: ['start', 'progress', 'error', 'complete']

};

const { Provider, useStore } = createRestash(options);

export {
  Provider,
  useStore
}
```

### Status

Restash includes a handy second arg on dispatch that allows you to set the status on dispatching an event. This is useful for updating your view based on this status. For example when making an async data requests.

NOTE: this examples assumes you have added **statuses** as shown above in our options in the previous section.

```tsx
const Home = () => {

  // The third arg here is the restash store.
  // you can use this to get state, status 
  // you can also use this is middleware.
  const [state, dispatch, restash] = useStore();

  // Although we're not updating the state here
  // you could update it along with the status.
  // This can really be handy stepping through 
  // a stepper or remembering and updating a 
  // status filling out a form. Once you get
  // the hang of it, can be quite useful.
  const changeStatus = (e) => {
    dispatch(null, e.target.value);
  };

  return (
    <div>
     <h3 style={{ marginBottom: '12px' }}>Current Status</h3>
      <hr style={{ marginBottom: '20px' }} />
      <div style={{ color: '#fff', backgroundColor: 'darkblue', padding: '6px', display: 'inline' }}>
        <span>{(restash.status || '').toUpperCase()}</span> &nbsp;
        <select defaultValue={restash.status} onChange={changeStatus}>
          <option value="">Please Select</option>
          <option>mounted</option>
          <option>start</option>
          <option>progress</option>
          <option>error</option>
          <option>complete</option>
        </select>
      </div>
    </div>
  );

};
```

## Server Side React (SSR)

To use Restash with server side react you'll need to expose your state to the window of the application. This is common practice with other libs such as Redux. Here's an example using Restash with NextJS.

First ensure you've enabled Restash for use with SSR. You can other pass **true** to use the default SSR key or pass your own string.

```jsx
const { Provider, useStore } = createRestash({
  ssrKey: true // or your own key such as __APP_STATE__
});
```

Using the default SSR key or the one you provided expose that to a custom _document.jsx (or _docuemnt.tsx) page in your NextJS <code>/pages</code> directory.

```jsx
const state = JSON.stringify({ some_initial_state });
<script dangerouslySetInnerHTML={{ __html: `window.${SSR_KEY} = ${state};` }} />
```

### See Below for Complete Example

The Below example is for [NextJS]() but you should be able to easily adapt to any SSR environemnt. The trick with SSR is to bind your state to a window prop as you see above and also below inside our script tag within the head element.

```jsx

const SSR_KEY = '__APP_STATE__'; // or use default __RESTASH_APP_STATE__

class MyDocument extends Document {

  static async getInitialProps(ctx) {
    const { res } = ctx;
    const app = res && res.meta ? res.meta : {};
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, app };
  }

  render() {

    const { app } = this.props;
    const state = JSON.stringify({ ...DEFAULTS, ...app });

    return (
      <Html>
        <Head />
        <script dangerouslySetInnerHTML={{ __html: `window.${SSR_KEY} = ${state};` }} />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }

}

export default MyDocument;
```

## Docs

See [https://blujedis.github.io/restash/](https://blujedis.github.io/restash/)

## Change

See [CHANGE.md](CHANGE.md)

## License

See [LICENSE.md](LICENSE)

