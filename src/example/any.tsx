import React, { FC } from 'react';
import { useAny } from './store';

const Any: FC = () => {

  const [dynamic, setDynamic] = useAny({ counter: 0 });

  const updateCounter = () => {
    const count = dynamic.counter || 0;
    setDynamic({ counter: count + 1 });
  };

  const getCounter = () => (dynamic || {}).counter || 0;

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
        {JSON.stringify(dynamic, null, 2)}
      </pre>
    </div>
  );

};

export default Any;
