"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=types.js.map