import React, { FC } from 'react';

const JsonData: FC<{ data: any, label?: string }> = ({ data, label }) => {
  if (!data || !Object.keys(data).length)
    return null;
  return (
    <div>
      <h3>{label || 'Current State'}</h3>
      <hr />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default JsonData;
