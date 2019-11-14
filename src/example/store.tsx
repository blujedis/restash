import React, { FC, useEffect } from 'react';
import { useStore } from './init';
import JsonData from './jsondata';

const Store: FC = () => {

  const [state, dispatch] = useStore();

  const setState = () => {
    dispatch({ firstName: 'Larry' });
  };

  return (
    <div>
      <h2 style={{ marginBottom: '12px' }}>Store</h2>
      <hr style={{ marginBottom: '20px' }} />
      <div style={{ marginBottom: '12px' }}>
        Status
      </div>
      <div>
        <button type="button" onClick={setState}>Set Larry</button>
      </div>
      <pre>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );

};

export default Store;
