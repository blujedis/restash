"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOUNTED = Symbol.for('MOUNTED');
exports.STATUS = Symbol.for('STATUS');
exports.THEME = Symbol.for('THEME');
exports.StatusBase = {
    INIT: 'INIT',
    MOUNTED: 'MOUNTED'
};
exports.StatusType = {
    ...exports.StatusBase, ...{
        START: 'START',
        PROGRESS: 'PROGRESS',
        STOP: 'STOP',
        COMPLETE: 'COMPLETE',
        ERROR: 'ERROR'
    }
};
//# sourceMappingURL=types.js.map