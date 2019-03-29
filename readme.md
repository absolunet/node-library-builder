# @absolunet/library-builder

[![npm](https://img.shields.io/npm/v/@absolunet/library-builder.svg)](https://www.npmjs.com/package/@absolunet/library-builder)
[![npm dependencies](https://david-dm.org/absolunet/node-library-builder/status.svg)](https://david-dm.org/absolunet/node-library-builder)
[![npms](https://badges.npms.io/%40absolunet%2Flibrary-builder.svg)](https://npms.io/search?q=%40absolunet%2Flibrary-builder)
[![Travis CI](https://api.travis-ci.org/absolunet/node-library-builder.svg?branch=master)](https://travis-ci.org/absolunet/node-library-builder/builds)
[![Code style ESLint](https://img.shields.io/badge/code_style-@absolunet/node-659d32.svg)](https://github.com/absolunet/eslint-config)

> JS library builder via webpack

Write your JS library and export it for Node.js, browser (ES5/ES6+) via [webpack](https://webpack.js.org) and [Babel](https://babeljs.io/)


## Install

```sh
$ npm install @absolunet/library-builder
```


## Usage

Imposes some conventions to work well

### Project structure
```
index.js

dist/
	↳ browser.js
	↳ browser-es5.js
	↳ node.js

export/
	↳ browser.js
	↳ node.js

lib/
```

- Each build will be outputted in a `dist` folder with a predefined name.
- Entry points for the builds are under a `export` folder with predefined names.
- *Ideally* the main script would be under `index.js` with its subfiles under `lib`.


### Code conventions
- Internal dependencies (which will be outputted in the final built file) are dealt with the `ES6 modules (import / export)` syntax.
- External dependencies (which will be referenced in the final built file) are dealt with the `Node.js modules (require)` syntax.
- `index.js` should end with a named `export` statement representing the whole library.


### Node.js build
- External dependencies will be left untouched in the final built file thus making classic `require()` Node.js statements. *(See webpack configuration)*
- The `export/node.js` file should look like this:
```js
export * from '..';
```
- Making its final usage look like
```js
const { mylibrary } = require('@organisation/my-library');   // dist/node.js
```


### Browser build
- External dependencies will be transform to a variable assignation, assuming that the dependencies are already loaded elsewhere. *(See webpack configuration)*
```js
const cl = require('cool-lib');
// Becomes
const cl = coolLib;
```
- The `export/browser.js` file should look like this:
```js
import { mylibrary } from '..';
window.mylibrary = mylibrary;
```
- Making its final usage look like
```js
console.log(window.mylibrary);
```
- The `dist/browser.js` is a pure ES6+ built and the `dist/browser-es5.js` is the same but with a Babel compilation to ES5 syntax.


### webpack Configuration
Your `webpack.config.js` should look like this
```js
const merge          = require('lodash.merge');
const libraryBuilder = require('@absolunet/library-builder');

libraryBuilder.setRoot(__dirname);


//-- Node.js
const nodeConfig = merge({}, libraryBuilder.config.node, {
	externals: [
		'cool-lib',          // Dependencies to reference and not include
		'meaningful-helper'
	]
});


//-- Browser
const browserExternals = {
	externals: {
		'cool-lib':           'coolLib',   // Dependencies to reference and their variable counterpart
		'meaningful-helper':  'mnfHelper'
	}
};

const browserConfig    = merge({}, libraryBuilder.config.browser,    browserExternals);
const browserES5Config = merge({}, libraryBuilder.config.browserES5, browserExternals);


module.exports = [nodeConfig, browserConfig, browserES5Config];
```


### package.json
Your `package.json` should contain these entries
```json
{
	"main": "dist/node.js",
	"browser": "dist/browser.js",
	"scripts": {
		"build": "node node_modules/@absolunet/library-builder/bin/build.js"
	},
	"devDependencies": {
		"@absolunet/library-builder": "0.0.1",
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

### `setRoot(path)`
Set the root path of your project

#### path
Type: `string`<br>
Path to root folder  *(typically `__dirname`)*


<br>




## API - Configuration

### `config.node`
Base webpack config for Node.js export




<br>

### `config.browser`
Base webpack config for browser ES6+ export




<br>

### `config.browserES5`
Base webpack config for browser ES5 export (via Babel)






<br>
<br>

## License

MIT © [Absolunet](https://absolunet.com)
