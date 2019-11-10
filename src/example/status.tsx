import React, { FC } from 'react';
import { useStore, useStoreAt } from './init';

const Status: FC = () => {

  const [nested, setNested] = useStoreAt('nested', false);
  const [state] = useStore();

  const toggleNested = () => {
    setNested(!nested);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '12px' }}>Nested Store Values</h2>
      <hr style={{ marginBottom: '20px' }} />
      <div style={{ marginBottom: '12px' }}>
        <span>Nested Value: </span>
        <span style={{ fontWeight: 'bolder' }}>{nested}</span>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <button type="button" onClick={toggleNested}>Toggle Nested</button>
      </div>
      <pre>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );

};

export default Status;
