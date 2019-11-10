import React, { FC } from 'react';
import { useStore } from './store';

const Default: FC = () => {

  const [state, setState] = useStore();

  

  return (
    <div>
      <h2>Default</h2>

      <pre>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );

};

export default Default;
