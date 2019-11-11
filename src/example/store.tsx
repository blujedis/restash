import React, { FC } from 'react';
import { useStoreAt, useStore } from './init';
import JsonData from './jsondata';

const Store: FC = () => {

  const [stateAt, setStateAt] = useStoreAt('active', true);
  const [state, setState] = useStore({ firstName: 'Peter', lastName: 'Gibbons' });

  const getState = () => {
    return state;
  };

  const changeUser = (key) => {
    return (e) => {
      setState({ [key as any]: e.target.value } as any);
    };
  };

  const changeStateAt = (e) => {
    setStateAt(e.target.checked);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '12px' }}>Store</h2>
      <hr style={{ marginBottom: '20px' }} />
      <div style={{ marginBottom: '12px' }}>
        <span>First Name: </span>
        <input
          type="text"
          defaultValue={state.firstName}
          onBlur={changeUser('firstName')} /><br /><br />
        <span>Last Name: </span>
        <input
          type="text"
          defaultValue={state.lastName}
          onBlur={changeUser('lastName')} /><br /><br />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <span>Is Active: </span>
        <input type="checkbox" defaultChecked={stateAt} onChange={changeStateAt} />
      </div>
      <pre>
        {JSON.stringify(getState(), null, 2)}
      </pre>
      {/* <JsonData data={state} /> */}
    </div>
  );

};

export default Store;
