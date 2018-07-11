#!/usr/bin/env node

'use strict';

const { execSync } = require('child_process');


const bin = require.resolve('webpack-cli');
execSync(bin, { stdio:'inherit' });
