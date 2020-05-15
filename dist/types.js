"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultStatus = exports.Action = exports.StatusBase = void 0;
// HELPERS //
/**
 * Base enum for initializing status.
 */
var StatusBase;
(function (StatusBase) {
    /**
     * Store has init.
     */
    StatusBase["init"] = "init";
    /**
     * Store has mounted ready for use.
     */
    StatusBase["mounted"] = "mounted";
})(StatusBase = exports.StatusBase || (exports.StatusBase = {}));
/**
 * Defalt dispatch action.
 */
var Action;
(function (Action) {
    /**
     * Informs Restash you are dispatching data as the payload.
     */
    Action["data"] = "data";
})(Action = exports.Action || (exports.Action = {}));
var DefaultStatus;
(function (DefaultStatus) {
    DefaultStatus["start"] = "start";
    DefaultStatus["progress"] = "progress";
    DefaultStatus["error"] = "error";
    DefaultStatus["complete"] = "complete";
})(DefaultStatus = exports.DefaultStatus || (exports.DefaultStatus = {}));
//# sourceMappingURL=types.js.map