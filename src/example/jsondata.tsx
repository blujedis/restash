import React, { FC, useEffect } from 'react';

const JsonData: FC<{ data: any, label?: string }> = ({ data, label }) => {

  let _data = data || {};

  useEffect(() => {
    _data = data || {};
  }, [data]);

  return (
    <div>
      <h3>{label || 'Current State'}</h3>
      <hr />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default JsonData;
