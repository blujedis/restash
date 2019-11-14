import React, { FC, useEffect } from 'react';
import { useStore } from './init';
import JsonData from './jsondata';

const Store: FC = () => {

  const [state, setState, restash] = useStore();
  // const [stateAt, setStateAt] = useStore('age');

  const onClick = () => {
    setState({ firstName: 'Larry' });
    setState({ age: 47 });
  };

  return (
    <div>
      <h2 style={{ marginBottom: '12px' }}>Store</h2>
      <hr style={{ marginBottom: '20px' }} />
      <div style={{ marginBottom: '12px' }}>
        Status: {restash.status}
      </div>
      <div>
        <button type="button" onClick={onClick}>Set Larry</button>
      </div>
      <pre>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );

};

export default Store;
