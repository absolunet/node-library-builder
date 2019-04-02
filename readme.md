# @absolunet/library-builder

[![npm](https://img.shields.io/npm/v/@absolunet/library-builder.svg)](https://www.npmjs.com/package/@absolunet/library-builder)
[![npm dependencies](https://david-dm.org/absolunet/node-library-builder/status.svg)](https://david-dm.org/absolunet/node-library-builder)
[![npms](https://badges.npms.io/%40absolunet%2Flibrary-builder.svg)](https://npms.io/search?q=%40absolunet%2Flibrary-builder)
[![Travis CI](https://api.travis-ci.org/absolunet/node-library-builder.svg?branch=master)](https://travis-ci.org/absolunet/node-library-builder/builds)
[![Code style ESLint](https://img.shields.io/badge/code_style-@absolunet/node-659d32.svg)](https://github.com/absolunet/eslint-config)

> JS library builder via webpack

Write your JS library and export it for Node.js, [kafe](https://absolunet.github.io/kafe) (ES5/ES6+) via [webpack](https://webpack.js.org) and [Babel](https://babeljs.io/)


## Install

```sh
$ npm install @absolunet/library-builder
```


## Usage

Imposes some conventions to work well

### Project structure
```
index.js
webpack.config.js

dist/
	↳ kafe.js
	↳ kafe-es5.js
	↳ node.js

lib/
```

- Each build will be outputted in a `dist` folder with a predefined name.
- Main script would be under `index.js` with its subfiles under `lib`.


### Code conventions
- Internal dependencies (which will be outputted in the final built file) are dealt with the `ES6 modules (import / export)` syntax.
- External dependencies (which will be referenced in the final built file) are dealt with the `Node.js modules (require)` syntax.
- `index.js` should end with a default `export` statement representing the whole library.


### Node.js build
- External dependencies will be left untouched in the final built file thus making classic `require()` Node.js statements. *(See webpack configuration)*
- Final usage will look like this
```js
const mylibrary = require('@organisation/my-library');   // dist/node.js
```


### kafe build
- External dependencies will be transform to a variable assignation, assuming that the dependencies are already loaded elsewhere. *(See webpack configuration)*
```js
const cl = require('cool-lib');
// Becomes
const cl = window.coolLib;
```
- Final usage will look like this
```js
console.log(window.kafe.mylibrary);
```
- The `dist/kafe.js` is a pure ES6+ built and the `dist/kafe-es5.js` is the same but with a Babel compilation to ES5 syntax.


### webpack Configuration
Your `webpack.config.js` should look like this
```js
const merge          = require('lodash.merge');
const LibraryBuilder = require('@absolunet/library-builder');

const builder = new LibraryBuilder({
	name: 'mylibrary',
	root: __dirname
});


//-- Node.js
const nodeConfig = merge({}, builder.config.node, {
	externals: [
		'cool-lib',          // Dependencies to reference and not include
		'meaningful-helper'
	]
});


//-- kafe
const kafeExternals = {
	externals: {
		'cool-lib':           'window.coolLib',   // Dependencies to reference and their variable counterpart
		'meaningful-helper':  'window.mnfHelper'
	}
};

const kafeConfig    = merge({}, builder.config.kafe,    kafeExternals);
const kafeES5Config = merge({}, builder.config.kafeES5, kafeExternals);


module.exports = [nodeConfig, kafeConfig, kafeES5Config];
```


### package.json
Your `package.json` should contain these entries
```json
{
	"main": "dist/node.js",
	"browser": "dist/kafe.js",
	"scripts": {
		"build": "node node_modules/@absolunet/library-builder/bin/build.js"
	},
	"devDependencies": {
		"@absolunet/library-builder": "1.1.0",
		"lodash.merge": "4.6.1"
	},
	"dependencies": {
		"cool-lib": "^1.2.3",
		"meaningful-helper": "^4.5.6"
	}
}
```

This way to build you only need to run `npm run build`



<br>
<br>

## API

### constructor(options)

#### options.name
*Required*<br>
Type: `String`<br>
Package name (for kafe build)

#### options.root
*Required*<br>
Type: `String`<br>
Path to root folder  *(typically `__dirname`)*






<br>

## API - Configuration

### config.node
Base webpack config for Node.js export



<br>

### config.kafe
Base webpack config for kafe ES6+ export



<br>

### config.kafeES5
Base webpack config for kafe ES5 export (via Babel)






<br>
<br>

## License

MIT © [Absolunet](https://absolunet.com)
