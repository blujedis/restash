import React, { FC } from 'react';
import { useStore } from './init';
import JsonData from './jsondata';

const StoreAt: FC = () => {

  const [state, dispatch, restash] = useStore();
  const [stateAt, dispatchAt] = useStore('numbers.mobile');

  const changeState = (key) => {
    return (e) => {
      dispatch({ [key]: e.target.value });
    };
  };

  const changeStateAt = (e) => {
    dispatchAt(e.target.value);
  };

  const changeStatus = (e) => {
    dispatch(null, e.target.value);
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
        Mobile Number: <input type="text" onBlur={changeStateAt} defaultValue={stateAt} /> (Using State at Key)
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
    </div>
  );

};

export default StoreAt;
