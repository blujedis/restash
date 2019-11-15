"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const JsonData = ({ data, label }) => {
    let _data = data || {};
    react_1.useEffect(() => {
        _data = data || {};
    }, [data]);
    return (react_1.default.createElement("div", { style: { marginTop: '32px' } },
        react_1.default.createElement("h3", null, label || 'Current State'),
        react_1.default.createElement("hr", null),
        react_1.default.createElement("pre", null, JSON.stringify(data, null, 2))));
};
exports.default = JsonData;
//# sourceMappingURL=jsondata.js.map