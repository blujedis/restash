/**
 * Base enum for initializing status.
 */
export var StatusBase;
(function (StatusBase) {
    /**
     * Store has init.
     */
    StatusBase["init"] = "init";
    /**
     * Store has mounted ready for use.
     */
    StatusBase["mounted"] = "mounted";
})(StatusBase || (StatusBase = {}));
/**
 * Defalt dispatch action.
 */
export var Action;
(function (Action) {
    /**
     * Informs Restash you are dispatching data as the payload.
     */
    Action["data"] = "data";
})(Action || (Action = {}));
export var DefaultStatus;
(function (DefaultStatus) {
    DefaultStatus["start"] = "start";
    DefaultStatus["progress"] = "progress";
    DefaultStatus["error"] = "error";
    DefaultStatus["complete"] = "complete";
})(DefaultStatus || (DefaultStatus = {}));
//# sourceMappingURL=types.js.map