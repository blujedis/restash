import React, { FC } from 'react';
import { useStore } from './init';
import JsonData from './jsondata';

const Theme: FC = () => {

  const [state, setState] = useStore('firstName');

  const onClick = () => {
    setState('Jason');
  };

  return (
    <div>
      <h2 style={{ marginBottom: '12px' }}>Theme</h2>
      <hr style={{ marginBottom: '20px' }} />
      <div style={{ marginBottom: '12px' }}>
        Status
      </div>
      <div>
        <button type="button" onClick={onClick}>Set Jason</button>
      </div>
      <pre>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );

};

export default Theme;
