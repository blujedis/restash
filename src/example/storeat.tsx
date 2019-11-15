import React, { FC } from 'react';
import { useStore } from './init';
import JsonData from './jsondata';

const StoreAt: FC = () => {

  const [state, dispatch] = useStore();
  const [stateAt, dispatchAt] = useStore('lastName');

  const changeState = (key) => {
    return (e) => {
      dispatch({ [key]: e.target.value });
    };
  };

  const changeStateAt = (e) => {
    dispatchAt(e.target.value);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '12px' }}>Use Store At</h2>
      <hr style={{ marginBottom: '20px' }} />
      <p style={{ padding: '12px', backgroundColor: '#5DADE2', width: '50%' }}>
        Simple example wiring up input elements to state values
        changing the state on blur of each field.
      </p>
      <div style={{ marginBottom: '12px' }}>
        First Name: <input type="text" onBlur={changeState('firstName')} defaultValue={state.firstName} />
      </div>
      <div style={{ marginBottom: '12px' }}>
        Last Name: <input type="text" onBlur={changeStateAt} defaultValue={stateAt} /> (Using State at Key)
      </div>
      <JsonData data={state} />
    </div>
  );

};

export default StoreAt;
