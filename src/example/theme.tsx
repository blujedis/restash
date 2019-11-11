import React, { FC } from 'react';
import { useTheme, useStatus } from './init';
import { StatusType } from '../types';

const Theme: FC = () => {

  const [theme, setTheme, currentTheme] = useTheme('light');
  const [status, setStatus] = useStatus(StatusType.START);

  const changeTheme = async (e) => {
    const val = e.target.value;
    setTheme(val);
    setStatus('START')
  };

  const colors = () => JSON.stringify(!theme || !theme.vars ? {} : theme.vars.color, null, 2);

  return (
    <div>
      <h2 style={{ marginBottom: '12px' }}>Theme</h2>
      <hr style={{ marginBottom: '20px' }} />
      <div style={{ marginBottom: '12px' }}>
        <span>Current Theme: </span>
        <span style={{ fontWeight: 'bolder' }}>{currentTheme}</span>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <span>Current Status: </span>
        <span style={{ fontWeight: 'bolder' }}>{status}</span>
      </div>
      <div style={{ marginBottom: '24px' }}>
        <select onChange={changeTheme} value={currentTheme}>
          <option value=''>Please Select</option>
          <option>light</option>
          <option>dark</option>
        </select>
        <span> NOTE: only color vars shown for brevity</span>
      </div>
      <h4>Display Our Theme Vars</h4>
      <pre>
        {colors()}
      </pre>
    </div>
  );

};

export default Theme;
