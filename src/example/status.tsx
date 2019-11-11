import React, { FC } from 'react';
import { useStatus, useStore } from './init';
import JsonData from './jsondata';
import { StatusType } from '../types';

const Status: FC = () => {

  const [status, setStatus] = useStatus(StatusType.START);
  const [state] = useStore();

  const changeStatus = (e) => {
    setStatus(e.target.value);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '12px' }}>Status</h2>
      <hr style={{ marginBottom: '20px' }} />
      <div style={{ marginBottom: '12px' }}>
        <span>Current Status: </span>
        <span style={{ fontWeight: 'bolder' }}>{status}</span>
      </div>
      <div style={{ marginBottom: '24px' }}>
        <select onChange={changeStatus} value={status}>
          <option value=''>Please Select</option>
          <option>START</option>
          <option>PROGRESS</option>
          <option>STOP</option>
          <option>COMPLETE</option>
          <option>ERROR</option>
        </select>
      </div>
      <JsonData data={state} />
    </div>
  );

};

export default Status;