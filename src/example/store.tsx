import React, { FC } from 'react';
import { useStore } from './init';
import JsonData from './jsondata';

const Store: FC = () => {

  const [state, dispatch, restash] = useStore();

  const changeState = (key) => {
    return (e) => {
      dispatch({ [key]: e.target.value });
    };
  };

  const changeStatus = (e) => {
    dispatch(null, e.target.value);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '12px' }}>Use Store</h2>
      <hr style={{ marginBottom: '20px' }} />
      <p style={{ padding: '12px', backgroundColor: '#BB8FCE', width: '50%' }}>
        Simple example wiring up input elements to state values
        changing the state on blur of each field.
      </p>
      <div style={{ marginBottom: '12px' }}>
        First Name: <input type="text" onBlur={changeState('firstName')} defaultValue={state.firstName} />
      </div>
      <div style={{ marginBottom: '12px' }}>
        Last Name: <input type="text" onBlur={changeState('lastName')} defaultValue={state.lastName} />
      </div>
      <h3 style={{ marginBottom: '12px' }}>Current Status</h3>
      <hr style={{ marginBottom: '20px' }} />
      <div style={{ color: '#fff', backgroundColor: 'darkblue', padding: '6px', display: 'inline' }}>
        <span>{(restash.status || '').toUpperCase()}</span> &nbsp;
        <select value={restash.status} onChange={changeStatus}>
          <option value="">Please Select</option>
          <option>mounted</option>
          <option>start</option>
          <option>progress</option>
          <option>error</option>
          <option>complete</option>
        </select>
      </div>
      <JsonData data={state} />
      <pre>
        {JSON.stringify(restash.state, null, 2)}
      </pre>
    </div>
  );

};

export default Store;
