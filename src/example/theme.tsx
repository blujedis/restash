import React, { FC } from 'react';
import { useTheme } from './store';

const Theme: FC = () => {

  const [theme, currentName, setTheme] = useTheme('light');

  const changeTheme = (e) => {
    const val = e.target.value;
    setTheme(val);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '12px' }}>Theme</h2>
      <hr style={{ marginBottom: '20px' }} />
      <div style={{ marginBottom: '12px' }}>
        <span>Current Theme: </span>
        <span style={{ fontWeight: 'bolder' }}>{currentName}</span>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <select onChange={changeTheme}>
          <option>light</option>
          <option>dark</option>
        </select>
        <span> NOTE: only color vars shown for brevity</span>
      </div>
      <pre>
        {JSON.stringify(theme.vars.color, null, 2)}
      </pre>
    </div>
  );

};

export default Theme;
