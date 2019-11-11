import React, { FC } from 'react';
import { useTheme, useStatus } from './init';
import JsonData from './jsondata';
import { StatusType } from '../types';

const Theme: FC = () => {

  const [theme, setTheme, currentTheme] = useTheme('light');

  const changeTheme = async (e) => {
    const val = e.target.value;
    setTheme(val);
  };

  const colors = () => !theme || !theme.vars ? {} : theme.vars.color;

  return (
    <div>
      <h2 style={{ marginBottom: '12px' }}>Theme</h2>
      <hr style={{ marginBottom: '20px' }} />
      <div style={{ marginBottom: '12px' }}>
        <span>Current Theme: </span>
        <span style={{ fontWeight: 'bolder' }}>{currentTheme}</span>
      </div>
      <div style={{ marginBottom: '24px' }}>
        <select onChange={changeTheme} value={currentTheme}>
          <option value=''>Please Select</option>
          <option>light</option>
          <option>dark</option>
        </select>
      </div>
      <h4 style={{ marginBottom: '8px' }}>Display Our Theme Vars</h4>
      <div style={{ fontSize: '.85rem', color: '#666' }}>(showing ONLY vars for brevity)</div>
      <JsonData data={colors()} label={'Current Theme Colors'} />
    </div>
  );

};

export default Theme;
