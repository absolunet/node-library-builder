//--------------------------------------------------------
//-- Export wrapper for browser build
//--------------------------------------------------------
'use strict';

/* eslint-disable no-restricted-globals,no-undef,no-process-env */
window[process.env.__PACKAGE_NAME__] = require(process.env.__PACKAGE_ROOT__).default;
