#!/usr/bin/env node

'use strict';

const spawn = require('cross-spawn');


const bin = require.resolve('webpack-cli');
spawn(bin, { stdio:'inherit' });
