"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const base = __importStar(require("./vars"));
const vars = {
    ...base, ...{
        font: {
            fontFamily: 'Helvetica, serif'
        },
        color: {
            ...base.color,
            primary: base.color.blue,
            secondary: base.color.cyan,
            other: ''
        }
    }
};
exports.default = {
    vars
};
//# sourceMappingURL=dark.js.map