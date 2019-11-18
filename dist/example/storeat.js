"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const init_1 = require("./init");
const jsondata_1 = __importDefault(require("./jsondata"));
const StoreAt = () => {
    const [state, dispatch, restash] = init_1.useStore();
    const [stateAt, dispatchAt] = init_1.useStore('lastName');
    const changeState = (key) => {
        return (e) => {
            dispatch({ [key]: e.target.value });
        };
    };
    const changeStateAt = (e) => {
        dispatchAt(e.target.value);
    };
    const changeStatus = (e) => {
        dispatch(null, e.target.value);
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h2", { style: { marginBottom: '12px' } }, "Use Store At"),
        react_1.default.createElement("hr", { style: { marginBottom: '20px' } }),
        react_1.default.createElement("p", { style: { padding: '12px', backgroundColor: '#5DADE2', width: '50%' } }, "Simple example wiring up input elements to state values changing the state on blur of each field."),
        react_1.default.createElement("div", { style: { marginBottom: '12px' } },
            "First Name: ",
            react_1.default.createElement("input", { type: "text", onBlur: changeState('firstName'), defaultValue: state.firstName })),
        react_1.default.createElement("div", { style: { marginBottom: '12px' } },
            "Last Name: ",
            react_1.default.createElement("input", { type: "text", onBlur: changeStateAt, defaultValue: stateAt }),
            " (Using State at Key)"),
        react_1.default.createElement("h3", { style: { marginBottom: '12px' } }, "Current Status"),
        react_1.default.createElement("hr", { style: { marginBottom: '20px' } }),
        react_1.default.createElement("div", { style: { color: '#fff', backgroundColor: 'darkblue', padding: '6px', display: 'inline' } },
            react_1.default.createElement("span", null, (restash.status || '').toUpperCase()),
            " \u00A0",
            react_1.default.createElement("select", { value: restash.status, onChange: changeStatus },
                react_1.default.createElement("option", { value: "" }, "Please Select"),
                react_1.default.createElement("option", null, "mounted"),
                react_1.default.createElement("option", null, "start"),
                react_1.default.createElement("option", null, "progress"),
                react_1.default.createElement("option", null, "error"),
                react_1.default.createElement("option", null, "complete"))),
        react_1.default.createElement(jsondata_1.default, { data: state })));
};
exports.default = StoreAt;
//# sourceMappingURL=storeat.js.map