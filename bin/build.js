#!/usr/bin/env node

'use strict';

const crossSpawn = require('cross-spawn');


const bin = require.resolve('webpack-cli');
crossSpawn(bin, { stdio:'inherit' });
