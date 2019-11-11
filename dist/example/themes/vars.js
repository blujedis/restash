"use strict";
// Base Sizes //
Object.defineProperty(exports, "__esModule", { value: true });
const base_size_rem = {
    ju: '2.1rem',
    xl: '1.8rem',
    lg: '1.5rem',
    md: '1.2rem',
    nm: '1rem',
    sm: '.85rem',
    xs: '.75rem',
    mi: '.55rem'
};
const base_size_px = {
    ju: '32px',
    xl: '24px',
    lg: '20px',
    md: '16px',
    nm: '12px',
    sm: '10px',
    xs: '8px',
    mi: '6px'
};
// Colors
const color = {
    orange: 'hsl(14,  100%, 53%)',
    yellow: 'hsl(48,  100%, 67%)',
    green: 'hsl(141, 53%,  53%)',
    turquoise: 'hsl(171, 100%, 41%)',
    cyan: 'hsl(204, 71%,  53%)',
    blue: 'hsl(217, 71%,  53%)',
    purple: 'hsl(271, 100%, 71%)',
    red: 'hsl(348, 86%, 61%)'
};
exports.color = color;
// Media Queries.
const query = {
    xs: '(max-device-width: 480px)',
    sm: '(max-device-width: 767.98px)',
    md: '(min-device-width: 768px) and and (max-device-width: 991.98px)',
    lg: '(min-device-width: 992px) and (max-device-width: 1199.98px)',
    xl: '(min-device-width: 1200px) and (max-device-width: 1599.98px)',
    xxl: '(min-device-width: 1600px)'
};
exports.query = query;
const size = {
    rem: base_size_rem,
    px: base_size_px
};
exports.size = size;
//# sourceMappingURL=vars.js.map