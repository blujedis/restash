import React, { FC } from 'react';
import { useStore } from './init';

const Store: FC = () => {

  const [state, setState] = useStore();

  const updateState = () => {

  };

  return (
    <div>
      <h2>Store</h2>

      <pre>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );

};

export default Store;
