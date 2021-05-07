import React from 'react';
import { useStore } from './init';
import JsonData from './jsondata';
const Store = () => {
    const [state, dispatch, restash] = useStore();
    const changeState = (key) => {
        return (e) => {
            dispatch({ [key]: e.target.value });
        };
    };
    const changeStatus = (e) => {
        dispatch(null, e.target.value);
    };
    return (React.createElement("div", null,
        React.createElement("h2", { style: { marginBottom: '12px' } }, "Use Store"),
        React.createElement("hr", { style: { marginBottom: '20px' } }),
        React.createElement("p", { style: { padding: '12px', backgroundColor: '#BB8FCE', width: '50%' } }, "Simple example wiring up input elements to state values changing the state on blur of each field."),
        React.createElement("div", { style: { marginBottom: '12px' } },
            "First Name: ",
            React.createElement("input", { type: "text", onBlur: changeState('firstName'), defaultValue: state.firstName })),
        React.createElement("div", { style: { marginBottom: '12px' } },
            "Last Name: ",
            React.createElement("input", { type: "text", onBlur: changeState('lastName'), defaultValue: state.lastName })),
        React.createElement("h3", { style: { marginBottom: '12px' } }, "Current Status"),
        React.createElement("hr", { style: { marginBottom: '20px' } }),
        React.createElement("div", { style: { color: '#fff', backgroundColor: 'darkblue', padding: '6px', display: 'inline' } },
            React.createElement("span", null, (restash.status || '').toUpperCase()),
            " \u00A0",
            React.createElement("select", { value: restash.status, onChange: changeStatus },
                React.createElement("option", { value: "" }, "Please Select"),
                React.createElement("option", null, "mounted"),
                React.createElement("option", null, "start"),
                React.createElement("option", null, "progress"),
                React.createElement("option", null, "error"),
                React.createElement("option", null, "complete"))),
        React.createElement(JsonData, { data: state })));
};
export default Store;
//# sourceMappingURL=store.js.map