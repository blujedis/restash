import React, { useEffect } from 'react';
const JsonData = ({ data, label }) => {
    let _data = data || {};
    useEffect(() => {
        _data = data || {};
    }, [data]);
    return (React.createElement("div", { style: { marginTop: '32px' } },
        React.createElement("h3", null, label || 'Current State'),
        React.createElement("hr", null),
        React.createElement("pre", null, JSON.stringify(data, null, 2))));
};
export default JsonData;
//# sourceMappingURL=jsondata.js.map