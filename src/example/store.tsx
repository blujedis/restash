import React, { FC, useEffect } from 'react';
import { useStore } from './init';
import JsonData from './jsondata';

const Store: FC = () => {

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
      <JsonData data={state} />
    </div>
  );

};

export default Store;
