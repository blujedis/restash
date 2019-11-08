import React, { FC } from 'react';
import { useTheme } from './store';

const Default: FC = () => {

  const [theme, currentName, setTheme] = useTheme('light');

  console.log(theme, currentName);

  return (
    <div>
      <h2>Restash</h2>
    </div>
  );

};

export default Default;
