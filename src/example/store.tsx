import React, { FC, useEffect } from 'react';
import { useStoreAt, useStore } from './init';
import JsonData from './jsondata';

const Store: FC = () => {

  const [stateAt, setStateAt] = useStoreAt('user');
  const [state, setState] = useStore({ active: true });

  useEffect(() => {
    console.log(state);
  }, []);

  const toDefault = v => String(v || '');

  const changeState = (e) => {

  };

  const changeStateAt = (e) => {
    setStateAt(e.target.value);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '12px' }}>Store</h2>
      <hr style={{ marginBottom: '20px' }} />
      <div style={{ marginBottom: '12px' }}>
        <span>Value: </span>
        <input type="text" />
        <span style={{ fontWeight: 'bolder' }}></span>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <span>Value At: </span>
        <span style={{ fontWeight: 'bolder' }}></span>
      </div>
      <JsonData data={state} />
    </div>
  );

};

export default Store;
