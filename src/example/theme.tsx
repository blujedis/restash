import React, { FC } from 'react';
import JsonData from './jsondata';

const Theme: FC = () => {

  return (
    <div>
      <h2 style={{ marginBottom: '12px' }}>Theme</h2>
      <hr style={{ marginBottom: '20px' }} />
      <div style={{ marginBottom: '12px' }}>
        Status
      </div>
      <pre>
        {/* {JSON.stringify(state, null, 2)} */}
      </pre>
    </div>
  );

};

export default Theme;
