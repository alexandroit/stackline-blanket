module.exports = function strictThis() {
    'use strict';
    return this === undefined;
};
