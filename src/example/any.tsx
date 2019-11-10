import React, { FC } from 'react';
import { useAny, useStore } from './store';
import { DYNAMIC } from '../types';

const Any: FC = () => {

  const [state, setState] = useStore();
  const [anyval, setAny] = useAny({ counter: 0 });

  const updateCounter = () => {
    const count = anyval.counter || 0;
    // setAny({ counter: count + 1 });
    setAny('counter', count + 1);
  };

  const getCounter = () => (anyval || {}).counter || 0;

  return (
    <div>
      <h2 style={{ marginBottom: '12px' }}>Any Model</h2>
      <hr style={{ marginBottom: '20px' }} />
      <div style={{ marginBottom: '12px' }}>
        <span>Counter Value: </span>
        <span style={{ fontWeight: 'bolder' }}>{getCounter()}</span>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <button type="button" onClick={updateCounter}>Update Counter</button>
      </div>
      <pre>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );

};

export default Any;
